import { useAntdTable } from 'ahooks';
import { Button, Flex, message, Table, TableProps } from 'antd';
import { Query } from 'appwrite';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Learning as LearningType } from '../../../types/db.ts';
import { CollectionName, DatabaseName } from '../../../types/enums.ts';
import { databases } from '../../utils/appwrite.ts';
import './index.scss';

interface Result {
    total: number;
    list: LearningType[];
}

function LearningDetail() {
    const { userId, userName } = useParams();

    const getTableData = ({ current, pageSize }: any): Promise<Result> => {
        return new Promise((resolve, reject) => {
            const queries = [
                Query.equal('createdBy', userId!),
                Query.limit(pageSize),
                Query.offset((current - 1) * pageSize),
                Query.orderDesc('$createdAt'),
            ];
            databases.listDocuments<LearningType>(DatabaseName.ai_stem, CollectionName.leaning, queries)
                .then((res) => {
                    resolve({
                        total: res.total,
                        list: res.documents,
                    })
                }).catch((err) => {
                    reject(err)
                    message.error((err as Error).message);
                })
        })
    };

    const { tableProps } = useAntdTable(getTableData);

    const columns: TableProps<LearningType>['columns'] = [
        {
            title: '课程',
            dataIndex: 'course',
            align: 'center',
            key: 'course'
        },
        {
            title: '共情',
            dataIndex: '1',
            align: 'center',
            render: (_, member) => (
                <Button size="small" color="primary" variant="text">下载</Button>
            ),
        },
        {
            title: '定义',
            dataIndex: '2',
            align: 'center',
            render: (_, member) => (
                <Button size="small" color="primary" variant="text">下载</Button>
            ),
        },
        {
            title: '创意',
            dataIndex: '3',
            align: 'center',
            render: (_, member) => (
                <Button size="small" color="primary" variant="text">下载</Button>
            ),
        },
        {
            title: '原型',
            dataIndex: '4',
            align: 'center',
            render: (_, member) => (
                <Button size="small" color="primary" variant="text">下载</Button>
            ),
        },
        {
            title: '测试',
            dataIndex: '5',
            align: 'center',
            render: (_, member) => (
                <Button size="small" color="primary" variant="text">下载</Button>
            ),
        }
    ];

    useEffect(() => {

    }, [userId])

    return (
        <div className="istem-learning-detail">
            <div className="istem-learning-detail-inner">
                <Flex style={{ marginBottom: 16 }} align="center" justify="space-between">
                    <p className="teams-members-title">{`${userName}的学习记录`}</p>
                </Flex>
                <Table<LearningType> {...tableProps} bordered columns={columns} size="small" style={{ minHeight: 450 }} />
            </div>
        </div>
    );
}

export default LearningDetail;