import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Flex, Space, Tooltip } from 'antd';
import { ID, Permission, Query, Role } from 'appwrite';
import { useEffect, useRef, useState } from 'react';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import { useNavigate, useParams } from 'react-router';
import { Chapter, Course, Learning, Step } from '../../../types/db';
import { CollectionName, DatabaseName, FunctionName, StepType } from '../../../types/enums';
import InteractionRender from '../../components/interaction-render';
import { databases, functions } from '../../utils/appwrite';
import './index.scss';
import { useUser } from '../../hooks/user';
import { FunctionsReturn } from '../../../types/common';

function CourseLearning() {
    const { courseId, chapterId } = useParams<{ courseId: string; chapterId?: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course>();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [currentChapter, setCurrentChapter] = useState<Chapter>();
    const [learningRecords, setLearningRecords] = useState<{ [key: string]: Learning }>({});
    const [completedSteps, setCompletedSteps] = useState<{ [key in Step]?: boolean }>({});
    const chapterInteractions = useRef<string[]>([])
    const [allInteractionsAnswered, setAllInteractionsAnswered] = useState<boolean>(false);
    const { userInfo } = useUser()
    const transform = (node: any, index: number) => {
        if (node.type === 'tag' && node.name === 'div' && node.attribs['data-locked'] === 'true') {
            // 转换自定义解析题
            const dataId: string = node.attribs['data-id'];
            // 查找该交互题是否有完成的学习记录
            const learningRecord = Object.values(learningRecords).find(record => {
                return (
                    record.interaction?.$id === dataId && record.complete
                )
            });
            return (
                <InteractionRender
                    key={dataId}
                    id={dataId}
                    savedAnswer={(learningRecord && learningRecord.complete) ? learningRecord.answer : []}
                    disabled={learningRecord && learningRecord.complete}
                    onAnswer={(answer, isCorrect) => handleInteractionAnswer(dataId, answer, isCorrect)}
                />
            );
        }
        return convertNodeToElement(node, index, transform);
    };

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            try {
                const response = await databases.getDocument<Course>(
                    DatabaseName.ai_stem,
                    CollectionName.course,
                    courseId
                );

                const chapterResponse = await databases.listDocuments<Chapter>(
                    DatabaseName.ai_stem,
                    CollectionName.chapter,
                    [
                        Query.equal('course', courseId)
                    ]
                );
                setCourse(response);
                setChapters(chapterResponse.documents.sort((a, b) => a.sort - b.sort));
            } catch (error) {
                console.error('Error fetching course:', error);
            }
        };

        fetchCourse();
    }, [courseId]);

    useEffect(() => {
        if (!chapterId && chapters.length > 0) {
            setCurrentChapter(chapters[0]);
        } else if (chapterId && chapters.length > 0) {
            const chapter = chapters.find(c => c.$id === chapterId);
            if (chapter) setCurrentChapter(chapter);
        }
    }, [chapterId, chapters]);

    // 获取当前章节的学习记录
    useEffect(() => {
        if (chapterId) {
            // 获取当前章节中的所有交互题ID
            if (currentChapter) {
                const interactionIds = extractInteractionIds(currentChapter.content);
                chapterInteractions.current = interactionIds
            }
            fetchLearningRecords(chapterId);
        }
    }, [chapterId, currentChapter]);

    // 提取章节内容中的交互题ID
    const extractInteractionIds = (content: string): string[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const interactionElements = doc.querySelectorAll('div[data-locked="true"]');

        const ids: string[] = [];
        interactionElements.forEach(element => {
            const id = element.getAttribute('data-id');
            if (id) ids.push(id);
        });

        return ids;
    };

    // 获取学习记录
    const fetchLearningRecords = async (chapterId: string) => {
        try {
            const response = await databases.listDocuments(
                DatabaseName.ai_stem,
                CollectionName.leaning,
                [
                    Query.equal('chapter', [chapterId])
                ]
            );

            const records: { [key: string]: Learning } = {};
            (response.documents as Learning[]).forEach(record => {
                if (record.interaction) {
                    records[record.interaction.$id] = record;
                }
            });

            setLearningRecords(records);

            // 获取所有步骤的完成状态
            fetchCompletedSteps();
        } catch (error) {
            console.error('Error fetching learning records:', error);
        }
    };

    // 检查章节是否已有学习记录，如果没有则创建
    const createLearningRecord = async (chapterId: string) => {
        try {
            // 先查询该章节是否已有学习记录
            const response = await databases.listDocuments(
                DatabaseName.ai_stem,
                CollectionName.leaning,
                [
                    Query.equal('chapter', [chapterId]),
                    Query.limit(1) // 只需要确认是否存在，限制返回数量
                ]
            );

            // 如果没有学习记录，才创建新的
            if (response.documents.length === 0) {
                await functions.createExecution(
                    FunctionName.leaning,
                    JSON.stringify({
                        data: {
                            chapter: chapterId,
                            complete: true,
                            createdBy: userInfo?.$id,
                        },
                        teamId: userInfo?.prefs.teamId
                    }),
                    false,
                    '/create'
                );
            }
        } catch (error) {
            console.error('Error creating learning record:', error);
        }
    };

    // 获取所有步骤的完成状态
    const fetchCompletedSteps = async () => {
        if (!courseId || !chapters.length) return;

        try {
            // 获取所有章节的学习记录
            const response = await databases.listDocuments<Learning>(
                DatabaseName.ai_stem,
                CollectionName.leaning,
                [
                    Query.equal('chapter', chapters.map(c => c.$id))
                ]
            );

            // 按步骤分组章节
            const stepChapters: { [key in Step]?: Chapter[] } = {};
            chapters.forEach(chapter => {
                if (!stepChapters[chapter.step]) {
                    stepChapters[chapter.step] = [];
                }
                stepChapters[chapter.step]!.push(chapter);
            });

            // 检查每个步骤的完成状态
            const completed: { [key in Step]?: boolean } = {};
            Object.entries(stepChapters).forEach(([step, stepChaps]) => {
                // 获取该步骤所有章节的ID
                const chapterIds = stepChaps.map(c => c.$id);

                // 检查每个章节是否有学习记录
                const hasRecords = chapterIds.every(id => {
                    return response.documents.some((doc: Learning) =>
                        doc.chapter && doc.chapter.$id === id
                    );
                });

                completed[step as Step] = hasRecords;
            });

            setCompletedSteps(completed);

            // 检查当前章节的所有交互题是否都已完成（根据complete字段判断）
            if (chapterInteractions.current.length > 0) {
                const allCompleted = chapterInteractions.current.every(id => {
                    return Object.values(learningRecords).some(record =>
                        record.interaction && record.interaction.$id === id && record.complete
                    );
                });
                setAllInteractionsAnswered(allCompleted);
            } else {
                // 如果没有交互题，则视为已完成
                setAllInteractionsAnswered(true);
            }
        } catch (error) {
            console.error('Error fetching completed steps:', error);
        }
    };

    // 处理交互题答案提交
    const handleInteractionAnswer = async (interactionId: string, answer: string[], isCorrect: boolean) => {
        // 创建学习记录并保存答案
        const { responseBody } = await functions.createExecution(
            FunctionName.leaning,
            JSON.stringify({
                data: {
                    chapter: chapterId,
                    interaction: interactionId,
                    answer: answer,
                    complete: isCorrect,
                    createdBy: userInfo?.$id,
                },
                teamId: userInfo?.prefs.teamId
            }),
            false,
            '/create'
        );
        const { data: response } = JSON.parse(responseBody) as FunctionsReturn<Learning>;

        // 更新本地学习记录状态
        setLearningRecords(prev => ({
            ...prev,
            [interactionId]: response as Learning
        }));

        // 检查是否所有交互题都已完成（根据complete字段判断）
        const updatedRecords = {
            ...learningRecords,
            [interactionId]: response as Learning
        };

        const allCompleted = chapterInteractions.current.every(id => {
            return Object.values(updatedRecords).some(record =>
                record.interaction && record.interaction.$id === id && record.complete
            );
        });

        setAllInteractionsAnswered(allCompleted);
    };

    const handleStartLearning = async () => {
        if (chapters.length > 0) {
            const firstChapter = chapters[0];
            await createLearningRecord(firstChapter.$id);
            navigate(`/course-preview/course-learning/${courseId}/${firstChapter.$id}`);
        }
    };

    const handleNextChapter = async () => {
        if (!currentChapter || !chapters.length) return;

        // 检查当前章节的所有交互题是否都已回答
        if (!allInteractionsAnswered) {
            alert('请先完成本章节的所有互动题目');
            return;
        }

        const currentIndex = chapters.findIndex(c => c.$id === currentChapter.$id);
        if (currentIndex < chapters.length - 1) {
            const nextChapter = chapters[currentIndex + 1];
            await createLearningRecord(nextChapter.$id);
            navigate(`/course-preview/course-learning/${courseId}/${nextChapter.$id}`);
        }
    };

    const handleOverChapter = () => {
        // 检查当前章节的所有交互题是否都已回答
        if (!allInteractionsAnswered) {
            alert('请先完成本章节的所有互动题目');
            return;
        }

        alert('完成学习');
    };

    const handlePrevChapter = () => {
        if (!currentChapter || !chapters.length) return;
        const currentIndex = chapters.findIndex(c => c.$id === currentChapter.$id);
        if (currentIndex > 0) {
            const prevChapter = chapters[currentIndex - 1];
            navigate(`/course-preview/course-learning/${courseId}/${prevChapter.$id}`);
        }
    };

    // 处理步骤导航点击
    const handleStepClick = (step: Step) => {
        // 只允许点击已完成的步骤
        if (!completedSteps[step] && step !== 'empathize') {
            // alert('请先完成前面的步骤');
            return;
        }

        // 找到该步骤的第一个章节
        const firstChapterOfStep = chapters.find(c => c.step === step);
        if (firstChapterOfStep) {
            navigate(`/course-preview/course-learning/${courseId}/${firstChapterOfStep.$id}`);
        }
    };

    if (!course) return <div>Loading...</div>;

    return (
        <div className="istem-course-learning-box">
            <div className="learning-left-box">
                <p className='learning-left-title'>设计思维的五个步骤</p>
                <div
                    className={`learning-left-item ${currentChapter?.step === 'empathize' ? 'active' : ''}`}
                    onClick={() => handleStepClick('empathize')}
                >
                    {StepType.empathize}
                    {completedSteps['empathize'] && <CheckCircleFilled className="step-completed-icon" />}
                </div>
                <div
                    className={`learning-left-item ${currentChapter?.step === 'define' ? 'active' : ''}`}
                    onClick={() => handleStepClick('define')}
                >
                    {StepType.define}
                    {completedSteps['define'] && <CheckCircleFilled className="step-completed-icon" />}
                </div>
                <div
                    className={`learning-left-item ${currentChapter?.step === 'ideate' ? 'active' : ''}`}
                    onClick={() => handleStepClick('ideate')}
                >
                    {StepType.ideate}
                    {completedSteps['ideate'] && <CheckCircleFilled className="step-completed-icon" />}
                </div>
                <div
                    className={`learning-left-item ${currentChapter?.step === 'prototype' ? 'active' : ''}`}
                    onClick={() => handleStepClick('prototype')}
                >
                    {StepType.prototype}
                    {completedSteps['prototype'] && <CheckCircleFilled className="step-completed-icon" />}
                </div>
                <div
                    className={`learning-left-item ${currentChapter?.step === 'test' ? 'active' : ''}`}
                    onClick={() => handleStepClick('test')}
                >
                    {StepType.test}
                    {completedSteps['test'] && <CheckCircleFilled className="step-completed-icon" />}
                </div>
            </div>
            <div className="learning-center-box">
                <div className="learning-center-left">
                    {!chapterId ? (
                        <div className="course-intro">
                            <Flex justify='space-between'>
                                <p className='course-title'>{course.name}课程介绍：</p>
                                <p className='course-duration'>学习时长：{course.duration}</p>
                            </Flex>
                            <p className='course-desc' style={{ whiteSpace: 'pre-wrap' }}>
                                {course.description}
                            </p>
                            <Flex justify='flex-end'>
                                <Button style={{ background: "#FF5F2F", color: "white", border: "none" }} onClick={handleStartLearning}>开始学习</Button>
                            </Flex>
                        </div>
                    ) : (
                        <>
                            {currentChapter && ReactHtmlParser(currentChapter.content, { transform })}
                            <Flex justify='flex-end'>
                                <Space>
                                    {chapters.indexOf(currentChapter!) !== 0 && (
                                        <Button
                                            style={{ background: "#FF5F2F", color: "white", border: "none" }}
                                            onClick={handlePrevChapter}
                                        >
                                            上一个
                                        </Button>
                                    )}
                                    {chapters.indexOf(currentChapter!) === chapters.length - 1 ?
                                        <Tooltip title={!allInteractionsAnswered ? "请先完成本章节的所有互动题目" : ""}>
                                            <Button
                                                disabled={!allInteractionsAnswered}
                                                style={{ background: "#FF5F2F", color: "white", border: "none" }}
                                                onClick={handleOverChapter}
                                            >
                                                完成学习
                                            </Button>
                                        </Tooltip> :
                                        <Tooltip title={!allInteractionsAnswered ? "请先完成本章节的所有互动题目" : ""}>
                                            <Button
                                                style={{ background: "#FF5F2F", color: "white", border: "none" }}
                                                onClick={handleNextChapter}
                                                disabled={!allInteractionsAnswered}
                                            >
                                                下一个
                                            </Button>
                                        </Tooltip>
                                    }
                                </Space>
                            </Flex>
                        </>
                    )}
                </div>
                <div className="learning-right-chat"></div>
            </div>
        </div>
    );
}

export default CourseLearning;