import { PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Flex, Form, Input, message, Modal, Select, Space, Table, TableProps } from 'antd';
import { ID, Query } from 'appwrite';
import { useState } from 'react';
import { Active } from '../../../types/db.ts';
import { CollectionName, DatabaseName, SubjectType } from '../../../types/enums.ts';
import { databases } from '../../utils/appwrite.ts';
import './index.scss';
import { useNavigate } from 'react-router';

interface Result {
    total: number;
    list: Active[];
}

function ActiveAdmin() {
    const [loading, setLoading] = useState(false)
    const getTableData = ({ current, pageSize }: any): Promise<Result> => {
        return new Promise((resolve, reject) => {
            databases.listDocuments<Active>(DatabaseName.ai_stem, CollectionName.active, [
                Query.limit(pageSize),
                Query.offset((current - 1) * pageSize),
                Query.orderDesc('$createdAt'),
            ])
                .then((res) => {
                    resolve({
                        total: res.total,
                        list: res.documents,
                    })
                })
                .catch((err) => {
                    reject(err);
                })
        })
    };

    const { tableProps, run } = useAntdTable(getTableData);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate()

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
            align: 'center',
            render: (_, { subject }) => (
                <p>{SubjectType[subject as keyof typeof SubjectType]}</p>
            )
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
                    <Button onClick={() => navigate(`/course-preview/course-admin/${active.$id}`)} size="small" color="primary" variant="text">
                        管理课程
                    </Button>
                    <Button  onClick={() => handleUpdate(active)} size="small" color="primary" variant="text">
                        修改
                    </Button>
                    <Button onClick={() => handleDeltet(active)} size="small" color="danger" variant="text">
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    const handleDeltet = async (active: Active) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除课程以及课程内的所有步骤？`,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await databases.deleteDocument(DatabaseName.ai_stem, CollectionName.active, active.$id);
                    run({ current: tableProps.pagination.current, pageSize: tableProps.pagination.pageSize });
                } catch (e) {
                    message.error((e as Error).message);
                }
            }
        });
    }

    const handleUpdate = (active: Active) => {
        form.setFieldsValue(active);
        setOpen(true);
    }

    const handleCreate = async () => {
        const formData: Active = form.getFieldsValue();
        await form.validateFields();
        setLoading(true);
        // 上传选项
        try {
            if (formData.$id) {
                await databases.updateDocument<Active>(DatabaseName.ai_stem, CollectionName.active, formData.$id, formData);
                run({ current: tableProps.pagination.current, pageSize: tableProps.pagination.pageSize });
            } else {
                await databases.createDocument<Active>(DatabaseName.ai_stem, CollectionName.active, ID.unique(), formData);
                run({ current: 1, pageSize: tableProps.pagination.pageSize });
            }
            setOpen(false);
        } catch (e) {
            message.error((e as Error).message);
        }
        setLoading(false);
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
                confirmLoading={loading}
                onOk={handleCreate}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="活动名称" rules={[{ required: true, message: '请输入活动名称' }]}>
                        <Input placeholder="请输入活动名称" />
                    </Form.Item>
                    <Form.Item name="subject" label="学科类型" rules={[{ required: true, message: '请选择学科类型' }]}>
                        <Select placeholder="请选择学科">
                            <Select.Option key="S" value="S">科学</Select.Option>
                            <Select.Option key="T" value="T">技术</Select.Option>
                            <Select.Option key="E" value="E">工程</Select.Option>
                            <Select.Option key="M" value="M">数学</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item noStyle name="$id" />
                </Form>
            </Modal>
            <div className="istem-active-admin-inner">
                <Flex style={{ marginBottom: 16 }} align="center" justify="space-between">
                    <p className="active-title">所有活动</p>
                    <Button onClick={() => { form.resetFields(); setOpen(true) }}
                        style={{ background: '#FF5F2F', color: 'white', border: 'none' }} icon={<PlusOutlined />}>
                        添加新活动
                    </Button>
                </Flex>
                <Table<Active> {...tableProps} bordered columns={columns} size="small" style={{ minHeight: 500 }} />
            </div>
        </div>
    );
}

export default ActiveAdmin;