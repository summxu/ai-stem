import { useAntdTable } from 'ahooks';
import { Button, Flex, message, Table, TableProps } from 'antd';
import { Query } from 'appwrite';
import * as docx from "docx";
import { Document, Paragraph, TextRun } from "docx";
import { useParams } from 'react-router';
import { FunctionsReturn } from '../../../types/common.ts';
import { Course, Learning, Learning as LearningType, Step } from '../../../types/db.ts';
import { CollectionName, DatabaseName, FunctionName, StepType } from '../../../types/enums.ts';
import { databases, functions } from '../../utils/appwrite.ts';
import './index.scss';

interface Result {
    total: number;
    list: Course[];
}

export interface DownloadLearningResponse {
    chapterLeaningList: Learning[]
    interactionLeaningList: Learning[]
}

function LearningDetail() {
    const { userId, userName } = useParams();

    const getTableData = (): Promise<Result> => {
        return new Promise(async (resolve, reject) => {
            const queries = [
                Query.equal('createdBy', userId!),
                Query.isNotNull("chapter"),
                Query.limit(10000),
                Query.orderDesc('$createdAt'),
            ];
            try {
                const allLeanringByChapter = await databases.listDocuments<LearningType>(DatabaseName.ai_stem, CollectionName.leaning, queries)
                const groupedCourseData = allLeanringByChapter.documents.reduce((acc, curr) => {
                    const courseId = curr.chapter?.course?.$id;
                    if (courseId && !acc.some(item => item.$id === courseId)) {
                        acc.push(curr.chapter?.course!);
                    }
                    return acc;
                }, [] as Course[]);

                resolve({
                    total: groupedCourseData.length,
                    list: groupedCourseData
                });
            } catch (error) {
                reject(error);
                message.error((error as Error).message);
            }
        })
    };

    const { tableProps } = useAntdTable(getTableData);

    const download = async (course: Course, step: Step) => {
        const fileRes = await functions.createExecution(FunctionName.leaning,
            JSON.stringify({
                courseId: course.$id,
                step: step,
                userId: userId!
            }),
            false,
            '/download'
        )

        const { responseBody } = fileRes
        const { data } = JSON.parse(responseBody) as FunctionsReturn<DownloadLearningResponse>;
        
        console.log(data)

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun("Hello World"),
                                new TextRun({
                                    text: "Foo Bar",
                                    bold: true,
                                }),
                                new TextRun({
                                    text: "\tGithub is the best",
                                    bold: true,
                                }),
                            ],
                        }),
                    ],
                },
            ],
        });

        docx.Packer.toBlob(doc).then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${userName}-${course.name}-${StepType[step]}.docx`;
            link.click();
            window.URL.revokeObjectURL(url);
        });

    };

    const columns: TableProps<Course>['columns'] = [
        {
            title: '课程',
            dataIndex: 'name',
            align: 'center',
            key: 'name'
        },
        {
            title: '共情',
            dataIndex: '1',
            align: 'center',
            render: (_, course) => (
                <Button onClick={() => download(course, 'empathize')} size="small" color="primary" variant="text">下载</Button>
            ),
        },
        {
            title: '定义',
            dataIndex: '2',
            align: 'center',
            render: (_, course) => (
                <Button onClick={() => download(course, 'define')} size="small" color="primary" variant="text">下载</Button>
            ),
        },
        {
            title: '创意',
            dataIndex: '3',
            align: 'center',
            render: (_, course) => (
                <Button onClick={() => download(course, 'ideate')} size="small" color="primary" variant="text">下载</Button>
            ),
        },
        {
            title: '原型',
            dataIndex: '4',
            align: 'center',
            render: (_, course) => (
                <Button onClick={() => download(course, 'prototype')} size="small" color="primary" variant="text">下载</Button>
            ),
        },
        {
            title: '测试',
            dataIndex: '5',
            align: 'center',
            render: (_, course) => (
                <Button onClick={() => download(course, 'test')} size="small" color="primary" variant="text">下载</Button>
            ),
        }
    ];

    return (
        <div className="istem-learning-detail">
            <div className="istem-learning-detail-inner">
                <Flex style={{ marginBottom: 16 }} align="center" justify="space-between">
                    <p className="teams-members-title">{`${userName}的学习记录`}</p>
                </Flex>
                <Table<Course> {...tableProps} bordered columns={columns} size="small" style={{ minHeight: 500 }} />
            </div>
        </div>
    );
}

export default LearningDetail;