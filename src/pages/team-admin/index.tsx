import { PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Flex, Form, Input, message, Modal, Space, Table, TableProps } from 'antd';
import { ID, Models, Query } from 'appwrite';
import { useState } from 'react';
import { functions, teams } from '../../utils/appwrite.ts';
import './index.scss';
import { useNavigate } from 'react-router';
import { FunctionName } from '../../../types/enums.ts';

interface Result {
    total: number;
    list: Models.Team<Models.Preferences>[];
}

function TeamAdmin() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const getTableData = ({ current, pageSize }: any): Promise<Result> => {
        return new Promise((resolve, reject) => {
            const queries = [
                Query.limit(pageSize),
                Query.offset((current - 1) * pageSize),
                Query.orderDesc('$createdAt'),
            ];
            teams.list(queries)
                .then((res) => {
                    resolve({
                        total: res.total,
                        list: res.teams,
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
    // 不再单独维护fileList状态，改为由Form.Item托管
    const columns: TableProps<Models.Team<Models.Preferences>>['columns'] = [
        {
            title: '小组名称',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: '小组ID',
            dataIndex: '$id',
            key: 'id',
            align: 'center',
        },
        {
            title: '成员数量',
            dataIndex: 'total',
            align: 'center',
            render: (_, team) => (<span>{team.total - 1}</span>)
        },
        {
            title: '操作',
            dataIndex: 'options',
            width: 200,
            align: 'center',
            render: (_, team) => (
                <Space>
                    <Button onClick={() => navigate(`/teams/teams-member/${team.$id}`)} size="small" color="primary" variant="text">
                        管理成员
                    </Button>
                    <Button onClick={() => handleUpdate(team)} size="small" color="primary" variant="text">
                        修改
                    </Button>
                    <Button onClick={() => handleDelete(team)} size="small" color="danger" variant="text">
                        删除
                    </Button>
                    <Button onClick={() => navigate(`/learning/${team.$id}`)} size="small" color="primary" variant="text">
                        学习记录
                    </Button>
                </Space>
            ),
        },
    ];

    const handleUpdate = (team: Models.Team<Models.Preferences>) => {
        form.setFieldsValue(team);
        setOpen(true);
    }

    const handleDelete = async (team: Models.Team<Models.Preferences>) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除小组？`,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await functions.createExecution(
                        FunctionName.teams,
                        JSON.stringify({ $id: team.$id }),
                        false,
                        '/delete'
                    );
                    run({ current: tableProps.pagination.current, pageSize: tableProps.pagination.pageSize });
                } catch (e) {
                    message.error((e as Error).message);
                }
            }
        });
    }

    const handleCreate = async () => {
        await form.validateFields();
        const formData = form.getFieldsValue();
        setLoading(true);
        try {
            if (formData.$id) {
                await functions.createExecution(
                    FunctionName.teams,
                    JSON.stringify({ name: formData.name, $id: formData.$id }),
                    false,
                    '/updateName'
                );
                run({ current: 1, pageSize: tableProps.pagination.pageSize });
            } else {
                await teams.create(ID.unique(), formData.name, [])
                run({ current: tableProps.pagination.current, pageSize: tableProps.pagination.pageSize });
            }
            setOpen(false);
        } catch (error) {
            message.error((error as Error).message);
        }
        setLoading(false);
    };

    return (
        <div className="istem-team-admin">
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title="创建小组"
                okText="确定"
                cancelText="取消"
                maskClosable={false}
                keyboard={false}
                confirmLoading={loading}
                onOk={handleCreate}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="小组名称" rules={[{ required: true, message: '请输入小组名称' }]}>
                        <Input placeholder="请输入小组名称" />
                    </Form.Item>
                    <Form.Item noStyle name="$id" />
                </Form>
            </Modal>
            <div className="istem-team-admin-inner">
                <Flex style={{ marginBottom: 16 }} align="center" justify="space-between">
                    <p className="team-title">{'所有小组'}</p>
                    <Button onClick={() => { form.resetFields(); setOpen(true) }}
                        style={{ background: '#FF5F2F', color: 'white', border: 'none' }} icon={<PlusOutlined />}>
                        添加新小组
                    </Button>
                </Flex>
                <Table<Models.Team<Models.Preferences>> {...tableProps} bordered columns={columns} size="small" style={{ minHeight: 500 }} />
            </div>
        </div>
    );
}

export default TeamAdmin;