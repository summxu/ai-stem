import { PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Flex, Form, InputNumber, message, Modal, Space, Table, TableProps } from 'antd';
import { Models } from 'appwrite';
import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { TeamGenerateResponse } from '../../../functions/teams/src/main.ts';
import { FunctionsReturn } from '../../../types/common.ts';
import { FunctionName } from '../../../types/enums.ts';
import { functions, teams } from '../../utils/appwrite.ts';
import { removeEmailSuffix } from '../../utils/index.ts';
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

    const getTableData = (): Promise<Result> => {
        return new Promise((resolve, reject) => {
            functions.createExecution(
                FunctionName.teams,
                JSON.stringify({ teamId }),
                false,
                '/get'
            ).then((res) => {
                const { responseBody } = res
                const { data: { total, memberships } } = JSON.parse(responseBody) as FunctionsReturn<Models.MembershipList>;
                resolve({
                    total: total,
                    list: memberships,
                });
            }).catch((err) => {
                reject(err)
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
                    {!member.roles.includes('owner') && <Fragment>
                        <Button onClick={() => resetPasswordHandle(member)} size="small" color="primary" variant="text">
                            重置密码
                        </Button>
                        <Button onClick={() => handleDelete(member)} size="small" color="danger" variant="text">
                            删除
                        </Button>
                    </Fragment>}
                </Space>
            ),
        },
    ];

    const resetPasswordHandle = async (member: Models.Membership) => {
        Modal.confirm({
            title: '确认重置',
            content: `确定要重置密码？`,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const { responseBody } = await functions.createExecution(
                        FunctionName.teams,
                        JSON.stringify({ userId: member.userId }),
                        false,
                        '/resetPassword'
                    );
                    const { data } = JSON.parse(responseBody) as FunctionsReturn<Models.User<Models.Preferences>>;
                    run({ current: tableProps.pagination.current, pageSize: tableProps.pagination.pageSize });
                    Modal.info({
                        title: '这个页面只会出现一次，请复制以下重置的账号密码',
                        okText: "复制并关闭窗口",
                        closable: false,
                        width: 550,
                        content: (
                            <div>
                                <p>账号：{removeEmailSuffix(data.email)} 密码：{data.password}</p>
                            </div>
                        ),
                        onOk() {
                            // 创建临时文本区域
                            const textArea = document.createElement('textarea');
                            // 构建要复制的文本内容
                            const content = [`账号：${removeEmailSuffix(data.email)} 密码：${data.password}`].join('\n');
                            textArea.value = content;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            message.success('账号密码已复制到剪贴板');
                        }
                    });
                } catch (e) {
                    message.error((e as Error).message);
                }
            }
        });
    };

    const handleDelete = async (member: Models.Membership) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除小组成员？`,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await functions.createExecution(
                        FunctionName.teams,
                        JSON.stringify({ $id: member.$id, teamId: member.teamId, userId: member.userId }),
                        false,
                        '/deleteMember'
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
        try {
            const { responseBody } = await functions.createExecution(
                FunctionName.teams,
                JSON.stringify({ teamId, teacherCount: formData.teacherCount, studentCount: formData.studentCount }),
                false,
                '/generate'
            );
            const { status, message: msg, data: { teachers, students } } = JSON.parse(responseBody) as FunctionsReturn<TeamGenerateResponse>;
            if (!status) {
                message.error(msg);
                return
            }
            run({ current: tableProps.pagination.current, pageSize: tableProps.pagination.pageSize });
            setOpen(false);

            Modal.info({
                title: '这个页面只会出现一次，请复制以下生成的账号密码',
                okText: "复制并关闭窗口",
                closable: false,
                width: 550,
                content: (
                    <div>
                        <h3>教师账号：</h3>
                        {teachers.map(item => <p>账号：{removeEmailSuffix(item.email)} 密码：{item.password}</p>)}
                        <h3>学生账号：</h3>
                        {students.map(item => <p>账号：{removeEmailSuffix(item.email)} 密码：{item.password}</p>)}
                    </div>
                ),
                onOk() {
                    // 创建临时文本区域
                    const textArea = document.createElement('textarea');
                    // 构建要复制的文本内容
                    const content = [
                        '教师账号：',
                        ...teachers.map(item => `账号：${removeEmailSuffix(item.email)} 密码：${item.password}`),
                        '学生账号：',
                        ...students.map(item => `账号：${removeEmailSuffix(item.email)} 密码：${item.password}`)
                    ].join('\n');
                    textArea.value = content;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    message.success('账号密码已复制到剪贴板');
                }
            });
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
                    <Form.Item initialValue={1} name="teacherCount" label="教师数量" >
                        <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入教师数量" />
                    </Form.Item>
                    <Form.Item initialValue={10} name="studentCount" label="学生数量" >
                        <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入学生数量" />
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