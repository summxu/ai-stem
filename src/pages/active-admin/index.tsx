import './index.scss';
import { Button, Flex, Form, Input, message, Modal, Select, Space, Table, TableProps } from 'antd';
import { Active } from '../../../types/db.ts';
import { useAntdTable } from 'ahooks';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { databases } from '../../utils/appwrite.ts';
import { CollectionName, DatabaseName } from '../../../types/enums.ts';
import { ID } from 'appwrite';

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

    const { tableProps, run } = useAntdTable(getTableData);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

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

    const handleCreate = async () => {
        const formData: Active = form.getFieldsValue();
        await form.validateFields();
        // 上传选项
        try {
            if (formData.$id) {
                await databases.updateDocument<Active>(DatabaseName.ai_stem, CollectionName.interaction, formData.id, formData);
            } else {
                await databases.createDocument<Active>(DatabaseName.ai_stem, CollectionName.interaction, ID.unique(), formData);
            }
            run({});
            setOpen(false);
        } catch (e) {
            message.error((e as Error).message);
        }
    };

    return (
        <div className="istem-active-admin">
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title="创建活动"
                okText="确定"
                cancelText="取消"
                maskClosable={false}
                keyboard={false}
                onOk={handleCreate}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="活动名称" rules={[{ required: true }]}>
                        <Input placeholder="请输入活动名称" />
                    </Form.Item>
                    <Form.Item name="subject" label="学科类型" rules={[{ required: true }]}>
                        <Select placeholder="请选择学科">
                            <Select.Option key="S" value="S">科学</Select.Option>
                            <Select.Option key="T" value="T">技术</Select.Option>
                            <Select.Option key="A" value="A">工程</Select.Option>
                            <Select.Option key="M" value="M">数学</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <div className="istem-active-admin-inner">
                <Flex style={{ marginBottom: 16 }} align="center" justify="space-between">
                    <p className="active-title">所有活动</p>
                    <Button onClick={() => setOpen(true)}
                            style={{ background: '#FF5F2F', color: 'white', border: 'none' }} icon={<PlusOutlined />}>
                        添加新活动
                    </Button>
                </Flex>
                <Table<Active> {...tableProps} bordered columns={columns} size="small" style={{ minHeight: 450 }} />
            </div>
        </div>
    );
}

export default ActiveAdmin;