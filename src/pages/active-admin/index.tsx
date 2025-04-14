import './index.scss';
import { Button, Space, Table, TableProps, Flex } from 'antd';
import { Active } from '../../../types/db.ts';
import { useAntdTable } from 'ahooks';
import { PlusOutlined } from '@ant-design/icons';

interface Result {
    total: number;
    list: Active[];
}

function ActiveAdmin() {

    const getTableData = ({ current, pageSize }: any): Promise<Result> => {
        const query = `page=${current}&size=${pageSize}`;
        return fetch(`https://randomuser.me/api?results=55&${query}`)
            .then((res) => res.json())
            .then((res) => ({
                total: res.info.results,
                list: res.results,
            }));
    };

    const { tableProps } = useAntdTable(getTableData);

    const columns: TableProps<Active>['columns'] = [
        {
            title: '活动名称',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: '活动ID',
            dataIndex: '$id',
            key: 'id',
            align: 'center',
        },
        // {
        //     title: '年级',
        //     dataIndex: 'grade',
        //     key: 'grade',
        // },
        {
            title: '学科',
            dataIndex: 'subject',
            key: 'subject',
            align: 'center',
        },
        {
            title: '课程数',
            dataIndex: 'courseCount',
            align: 'center',
            render: (_, { course }) => (
                <p>{course?.length || 0}</p>
            ),
        },
        {
            title: '操作',
            dataIndex: 'options',
            width: 200,
            align: 'center',
            render: (_, active) => (
                <Space>
                    <Button size="small" color="primary" variant="text">
                        管理课程
                    </Button>
                    <Button size="small" color="default" variant="text">
                        修改
                    </Button>
                    <Button size="small" color="danger" variant="text">
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="istem-active-admin">
            <div className="istem-active-admin-inner">
                <Flex style={{ marginBottom: 16 }} align="center" justify="space-between">
                    <p className="active-title">所有活动</p>
                    <Button style={{ background: '#FF5F2F', color: 'white', border: 'none' }} icon={<PlusOutlined />}>
                        添加新活动
                    </Button>
                </Flex>
                <Table<Active> {...tableProps} bordered columns={columns} size="small" style={{ minHeight: 450 }} />
            </div>
        </div>
    );
}

export default ActiveAdmin;