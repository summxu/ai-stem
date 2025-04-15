import { Button, Flex, Space } from 'antd';
import { ID, Query } from 'appwrite';
import { useEffect, useState } from 'react';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import { useNavigate, useParams } from 'react-router';
import { Chapter, Course } from '../../../types/db';
import { CollectionName, DatabaseName, StepType } from '../../../types/enums';
import InteractionRender from '../../components/interaction-render';
import { databases } from '../../utils/appwrite';
import './index.scss';

function CourseLearning() {
    const { courseId, chapterId } = useParams<{ courseId: string; chapterId?: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course>();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [currentChapter, setCurrentChapter] = useState<Chapter>();

    const transform = (node: any, index: number) => {
        if (node.type === 'tag' && node.name === 'div' && node.attribs['data-locked'] === 'true') {
            // 转换自定义解析题
            const dataId: string = node.attribs['data-id'];
            return <InteractionRender key={index} id={dataId} />;
        }
        return convertNodeToElement(node, index, transform);
    };

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            try {
                const response = await databases.getDocument(
                    DatabaseName.ai_stem,
                    CollectionName.course,
                    courseId
                );
                setCourse(response as Course);
            } catch (error) {
                console.error('Error fetching course:', error);
            }
        };

        const fetchChapters = async () => {
            if (!courseId) return;
            try {
                const response = await databases.listDocuments(
                    DatabaseName.ai_stem,
                    CollectionName.chapter,
                    [
                        Query.equal('course', [courseId]),
                        Query.orderAsc('sort')
                    ]
                );
                setChapters(response.documents as Chapter[]);
            } catch (error) {
                console.error('Error fetching chapters:', error);
            }
        };

        fetchCourse();
        fetchChapters();
    }, [courseId]);

    useEffect(() => {
        if (!chapterId && chapters.length > 0) {
            setCurrentChapter(chapters[0]);
        } else if (chapterId && chapters.length > 0) {
            const chapter = chapters.find(c => c.$id === chapterId);
            if (chapter) setCurrentChapter(chapter);
        }
    }, [chapterId, chapters]);

    const createLearningRecord = async (chapterId: string) => {
        try {
            await databases.createDocument(
                DatabaseName.ai_stem,
                CollectionName.leaning,
                ID.unique(),
                {
                    chapter: chapterId
                }
            );
        } catch (error) {
            console.error('Error creating learning record:', error);
        }
    };

    const handleStartLearning = () => {
        if (chapters.length > 0) {
            const firstChapter = chapters[0];
            createLearningRecord(firstChapter.$id);
            navigate(`/course-preview/course-learning/${courseId}/${firstChapter.$id}`);
        }
    };

    const handleNextChapter = () => {
        if (!currentChapter || !chapters.length) return;
        const currentIndex = chapters.findIndex(c => c.$id === currentChapter.$id);
        if (currentIndex < chapters.length - 1) {
            const nextChapter = chapters[currentIndex + 1];
            createLearningRecord(nextChapter.$id);
            navigate(`/course-preview/course-learning/${courseId}/${nextChapter.$id}`);
        }
    };

    const handleOverChapter = () => {
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

    if (!course) return <div>Loading...</div>;

    return (
        <div className="istem-course-learning-box">
            <div className="learning-left-box">
                <p className='learning-left-title'>设计思维的五个步骤</p>
                <p className='learning-left-item'>{StepType.empathize}</p>
                <p className='learning-left-item'>{StepType.define}</p>
                <p className='learning-left-item'>{StepType.ideate}</p>
                <p className='learning-left-item'>{StepType.prototype}</p>
                <p className='learning-left-item'>{StepType.test}</p>
            </div>
            <div className="learning-center-box">
                <div className="learning-center-left">
                    {!chapterId ? (
                        <div className="course-intro">
                            <Flex justify='space-between'>
                                <p className='course-title'>{course.name}课程介绍：</p>
                                <p className='course-duration'>学习时长：{course.duration}</p>
                            </Flex>
                            <p className='course-desc'>
                                <img className='course-img' src={course.attachment} alt="course-cover" />
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
                                    {chapters.indexOf(currentChapter!) === chapters.length - 1 ? <Button style={{ background: "#FF5F2F", color: "white", border: "none" }} onClick={handleOverChapter}>
                                        完成学习
                                    </Button> : <Button style={{ background: "#FF5F2F", color: "white", border: "none" }} onClick={handleNextChapter}>
                                        下一个
                                    </Button>}
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