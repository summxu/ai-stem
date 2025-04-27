import { PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Flex, Form, InputNumber, message, Modal, Space, Table, TableProps } from 'antd';
import { Models, Query } from 'appwrite';
import { Fragment, useEffect, useState } from 'react';
import { TeamGenerateResponse } from '../../../functions/teams/src/main.ts';
import { FunctionsReturn } from '../../../types/common.ts';
import { Learning as LearningType } from '../../../types/db.ts';
import { CollectionName, DatabaseName, FunctionName } from '../../../types/enums.ts';
import { useUser } from '../../hooks/user.tsx';
import { databases, functions, teams } from '../../utils/appwrite.ts';
import { removeEmailSuffix } from '../../utils/index.ts';
import './index.scss';

interface Result {
    total: number;
    list: LearningType[];
}

function Learning() {
    const [teamName, setTeamName] = useState<string>('');
    const { userInfo } = useUser()
    const [team, setTeam] = useState<Models.Team<Models.Preferences>>()

    useEffect(() => {
        teams.get(userInfo?.prefs.teamId).then(res => {
            setTeam(res)
        })
    }, [userInfo]);

    const getTableData = ({ current, pageSize }: any): Promise<Result> => {
        return new Promise((resolve, reject) => {
            const queries = [
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

    const { tableProps, run } = useAntdTable(getTableData);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    // 不再单独维护fileList状态，改为由Form.Item托管

    const columns: TableProps<LearningType>['columns'] = [
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
            title: '成员角色',
            dataIndex: 'roles',
            key: 'roles',
            align: 'center',
        },
    ];

    return (
        <div className="istem-learning-admin">
            <div className="istem-learning-admin-inner">
                <Flex style={{ marginBottom: 16 }} align="center" justify="space-between">
                    <p className="teams-members-title">{teamName || '所有成员'}</p>
                </Flex>
                <Table<LearningType> {...tableProps} bordered columns={columns} size="small" style={{ minHeight: 450 }} />
            </div>
        </div>
    );
}

export default Learning;