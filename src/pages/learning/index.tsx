import { useAntdTable } from 'ahooks';
import { Button, Flex, message, Space, Table, TableProps } from 'antd';
import { Models } from 'appwrite';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { FunctionsReturn } from '../../../types/common.ts';
import { FunctionName } from '../../../types/enums.ts';
import { useUser } from '../../hooks/user.tsx';
import { functions, teams } from '../../utils/appwrite.ts';
import { removeEmailSuffix } from '../../utils/index.ts';
import './index.scss';

interface Result {
    total: number;
    list: Models.Membership[];
}

function Learning() {
    const [teamName, setTeamName] = useState<string>('');
    const { teamId } = useParams()
    const { userInfo } = useUser();
    const navigate = useNavigate()

    const getTableData = (): Promise<Result> => {
        return new Promise((resolve, reject) => {
            functions.createExecution(
                FunctionName.leaning,
                JSON.stringify({ teamId: teamId || userInfo!.prefs.teamId }),
                false,
                '/listMemberships'
            ).then((res) => {
                const { responseBody } = res
                const { data: { total, memberships } } = JSON.parse(responseBody) as FunctionsReturn<Models.MembershipList>;

                resolve({
                    total: total,
                    list: memberships.filter((item: Models.Membership) => item.roles.includes('student')),
                });
            }).catch((err) => {
                reject(err)
                message.error((err as Error).message);
            })
        })
    }

    const { tableProps, run } = useAntdTable(getTableData, { manual: true });

    useEffect(() => {
        if (teamId) {
            run({ current: 1, pageSize: tableProps.pagination.pageSize });
            teams.get(teamId).then((res) => {
                setTeamName(res.name);
            })
        } else if (userInfo && userInfo.prefs && userInfo.prefs.teamId) {
            run({ current: 1, pageSize: tableProps.pagination.pageSize });
            teams.get(userInfo.prefs.teamId).then((res) => {
                setTeamName(res.name);
            })
        }
    }, [teamId, userInfo]);

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
            align: 'center',
            render: (_, member) => {
                return removeEmailSuffix(member.userEmail);
            },
        },
        {
            title: '操作',
            dataIndex: 'options',
            width: 150,
            align: 'center',
            render: (_, member) => (
                <Space>
                    <Button onClick={() => navigate(`/learning/learning-detail/${member.userId}/${member.userName}`)} size="small" color="primary" variant="text">
                        详细学习记录
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="istem-learning-admin">
            <div className="istem-learning-admin-inner">
                <Flex style={{ marginBottom: 16 }} align="center" justify="space-between">
                    <p className="teams-members-title">{teamName + '小组的学习记录'}</p>
                </Flex>
                <Table<Models.Membership> {...tableProps} bordered columns={columns} size="small" style={{ minHeight: 500 }} />
            </div>
        </div>
    );
}

export default Learning;