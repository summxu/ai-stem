import { PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Flex, Form, InputNumber, message, Modal, Space, Table, TableProps } from 'antd';
import { Models, Query } from 'appwrite';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { teams } from '../../utils/appwrite.ts';
import './index.scss';

interface Result {
    total: number;
    list: Models.Membership[];
}

function TeamMembersAdmin() {
    const { teamId } = useParams<{ teamId: string }>();
    const [teamName, setTeamName] = useState<string>('');

    useEffect(() => {
        if (teamId) {
            teams.get(teamId)
                .then((res) => {
                    setTeamName(res.name);
                })
                .catch((err) => {
                    message.error((err as Error).message);
                })
        }
    }, [teamId]);

    const getTableData = ({ current, pageSize }: any): Promise<Result> => {
        return new Promise((resolve, reject) => {
            const queries = [
                Query.limit(pageSize),
                Query.offset((current - 1) * pageSize),
                Query.orderDesc('$createdAt'),
            ];

            teams.listMemberships(teamId!, queries)
                .then((res) => {
                    resolve({
                        total: res.total,
                        list: res.memberships,
                    });
                })
                .catch((err) => {
                    message.error((err as Error).message);
                })
        })
    };

    const { tableProps, run } = useAntdTable(getTableData);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    // 不再单独维护fileList状态，改为由Form.Item托管

    const columns: TableProps<Models.Membership>['columns'] = [
        {
            title: '成员名称',
            dataIndex: 'userName',
            key: 'userName',
            align: 'center',
        },
        {
            title: '成员ID',
            dataIndex: '$id',
            key: 'id',
            align: 'center',
        },
        {
            title: '成员账号',
            dataIndex: 'userEmail',
            key: 'userEmail',
            align: 'center',
        },
        {
            title: '成员角色',
            dataIndex: 'roles',
            key: 'roles',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: 'options',
            width: 150,
            align: 'center',
            render: (_, member) => (
                <Space>
                    <Button onClick={() => resetPasswordHandle(member)} size="small" color="primary" variant="text">
                        重置密码
                    </Button>
                    <Button onClick={() => handleDelete(member)} size="small" color="danger" variant="text">
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    const resetPasswordHandle = (member: Models.Membership) => {
        try {

        } catch (e) {
            message.error((e as Error).message);
        }
    };

    const handleDelete = async (member: Models.Membership) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除小组成员？`,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                try {

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
        try {
            console.log(formData);
            run({ current: tableProps.pagination.current, pageSize: tableProps.pagination.pageSize });
            setOpen(false);
        } catch (e) {
            message.error((e as Error).message);
        }
    };

    return (
        <div className="istem-teams-members-admin">
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title="生成新成员"
                okText="生成"
                cancelText="取消"
                maskClosable={false}
                keyboard={false}
                onOk={handleCreate}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="教师数量" >
                        <InputNumber min={0} placeholder="请输入教师数量" />
                    </Form.Item>
                    <Form.Item name="name" label="学生数量" >
                        <InputNumber min={0} placeholder="请输入学生数量" />
                    </Form.Item>
                </Form>
            </Modal>
            <div className="istem-teams-members-admin-inner">
                <Flex style={{ marginBottom: 16 }} align="center" justify="space-between">
                    <p className="teams-members-title">{teamName || '所有成员'}</p>
                    <Button onClick={() => { form.resetFields(); setOpen(true) }}
                        style={{ background: '#FF5F2F', color: 'white', border: 'none' }} icon={<PlusOutlined />}>
                        生成新成员
                    </Button>
                </Flex>
                <Table<Models.Membership> {...tableProps} bordered columns={columns} size="small" style={{ minHeight: 450 }} />
            </div>
        </div>
    );
}

export default TeamMembersAdmin;