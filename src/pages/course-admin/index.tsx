import { PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Flex, Form, Input, message, Modal, Space, Table, TableProps, Upload, UploadFile, UploadProps } from 'antd';
import { ID, Query } from 'appwrite';
import { useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Active, Course } from '../../../types/db.ts';
import { BucketName, CollectionName, DatabaseName } from '../../../types/enums.ts';
import { databases, storage } from '../../utils/appwrite.ts';
import CourseContentModal from '../../components/course-content-modal';
import './index.scss';

interface Result {
    total: number;
    list: Course[];
}

function CourseAdmin() {
    const { activeId } = useParams<{ activeId: string }>();
    const [activeName, setActiveName] = useState<string>('');

    useEffect(() => {
        if (activeId) {
            databases.getDocument<Active>(DatabaseName.ai_stem, CollectionName.active, activeId)
                .then((res) => {
                    setActiveName(res.name);
                })
                .catch((err) => {
                    message.error('获取活动信息失败');
                });
        }
    }, [activeId]);

    const getTableData = ({ current, pageSize }: any): Promise<Result> => {
        return new Promise((resolve, reject) => {
            const queries = [
                Query.limit(pageSize),
                Query.offset((current - 1) * pageSize),
                Query.orderDesc('$createdAt'),
            ];

            // 如果有activeId，添加筛选条件
            if (activeId) {
                queries.push(Query.equal('active', [activeId]));
            }

            databases.listDocuments<Course>(DatabaseName.ai_stem, CollectionName.course, queries)
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
    const [contentModalOpen, setContentModalOpen] = useState(false);
    const [currentCourseId, setCurrentCourseId] = useState<string>('');
    const [form] = Form.useForm();
    const [_, forceUpdate] = useState(0)
    const navigate = useNavigate();
    // 不再单独维护fileList状态，改为由Form.Item托管

    const columns: TableProps<Course>['columns'] = [
        {
            title: '课程名称',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: '课程ID',
            dataIndex: '$id',
            key: 'id',
            align: 'center',
        },
        {
            title: '课程时长',
            dataIndex: 'duration',
            key: 'duration',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: 'options',
            width: 200,
            align: 'center',
            render: (_, course) => (
                <Space>
                    <Button onClick={() => window.open(`/course-preview/course-learning/${course.$id}`)} size="small" color="primary" variant="text">
                        预览
                    </Button>
                    <Button onClick={() => handleCourseContent(course)} size="small" color="primary" variant="text">
                        课程内容
                    </Button>
                    <Button onClick={() => handleUpdate(course)} size="small" color="primary" variant="text">
                        修改
                    </Button>
                    <Button onClick={() => handleDelete(course)} size="small" color="danger" variant="text">
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    const handleCourseContent = (course: Course) => {
        setCurrentCourseId(course.$id);
        setContentModalOpen(true);
    };

    const handleDelete = async (course: Course) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除课程？`,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await databases.deleteDocument(DatabaseName.ai_stem, CollectionName.course, course.$id);
                    run({ current: tableProps.pagination.current, pageSize: tableProps.pagination.pageSize });
                } catch (e) {
                    message.error((e as Error).message);
                }
            }
        });
    }

    const handleUpdate = (course: Course) => {
        // 如果有attachment，转换为fileList格式以便显示已上传的课程封面
        if (course.attachment) {
            const uploadFile: UploadFile = {
                uid: course.$id,
                name: course.name,
                status: 'done',
                url: course.attachment
            };
            form.setFieldsValue({
                ...course,
                attachment: [uploadFile]
            });
        } else {
            form.setFieldsValue(course);
        }
        setOpen(true);
    }

    const handleCreate = async () => {
        await form.validateFields();
        const formData: Course = form.getFieldsValue();

        // 处理附件，从数组转为URL字符串
        const attachmentFiles = formData.attachment as unknown as UploadFile[];
        if (Array.isArray(attachmentFiles) && attachmentFiles.length > 0) {
            formData.attachment = attachmentFiles[0].url || attachmentFiles[0].response.url || '';
        }

        // 上传选项
        try {
            if (formData.$id) {
                await databases.updateDocument<Course>(DatabaseName.ai_stem, CollectionName.course, formData.$id, formData);
                run({ current: tableProps.pagination.current, pageSize: tableProps.pagination.pageSize });
            } else {
                // 如果有activeId，添加到课程的active字段
                if (activeId && !formData.active) {
                    formData.active = activeId;
                }
                await databases.createDocument<Course>(DatabaseName.ai_stem, CollectionName.course, ID.unique(), formData);
                run({ current: 1, pageSize: tableProps.pagination.pageSize });
            }
            setOpen(false);
        } catch (e) {
            message.error((e as Error).message);
        }
    };

    const uploadProps: UploadProps = {
        onRemove: () => {
            form.setFieldValue('attachment', [])
            forceUpdate(Math.random())
        },
        customRequest: async ({ file, onSuccess, onError }) => {
            const customFile = file as unknown as File;
            try {
                const { bucketId, $id } = await storage.createFile(BucketName.course, ID.unique(), customFile);
                const fileContent = storage.getFileView(bucketId, $id);

                // 更新文件信息
                const updatedFile = {
                    uid: $id,
                    name: customFile.name,
                    status: 'done',
                    url: fileContent
                } as any;

                // 通知上传成功
                onSuccess?.(updatedFile, new XMLHttpRequest());
            } catch (e) {
                onError?.(e as Error);
                message.error((e as Error).message);
            }
        },
        listType: 'picture-card',
        maxCount: 1,
    };

    return (
        <div className="istem-course-admin">
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title="创建课程"
                okText="确定"
                cancelText="取消"
                maskClosable={false}
                keyboard={false}
                onOk={handleCreate}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="课程名称" rules={[{ required: true, message: '请输入课程名称' }]}>
                        <Input placeholder="请输入课程名称" />
                    </Form.Item>
                    <Form.Item name="attachment" label="课程封面" rules={[{ required: true, message: '请上传课程封面' }]} valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}>
                        <Upload {...uploadProps}>
                            {!form.getFieldValue('attachment')?.length ? <button style={{ border: 0, background: 'none' }} type="button">
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>上传</div>
                            </button> : null}
                        </Upload>
                    </Form.Item>
                    <Form.Item name="description" label="课程描述" rules={[{ required: true, message: '请输入课程描述' }]}>
                        <Input.TextArea rows={3} placeholder="请输入课程描述" />
                    </Form.Item>
                    <Form.Item name="duration" label="课程时长" rules={[{ required: true, message: '请输入课程时长' }]}>
                        <Input placeholder="请输入课程时长" />
                    </Form.Item>
                    <Form.Item noStyle name="$id" />
                    <Form.Item noStyle name="active" />
                </Form>
            </Modal>
            <CourseContentModal
                open={contentModalOpen}
                onCancel={() => setContentModalOpen(false)}
                courseId={currentCourseId}
            />
            <div className="istem-course-admin-inner">
                <Flex style={{ marginBottom: 16 }} align="center" justify="space-between">
                    <p className="course-title">{activeId ? activeName : '所有课程'}</p>
                    <Button onClick={() => { form.resetFields(); setOpen(true) }}
                        style={{ background: '#FF5F2F', color: 'white', border: 'none' }} icon={<PlusOutlined />}>
                        添加新课程
                    </Button>
                </Flex>
                <Table<Course> {...tableProps} bordered columns={columns} size="small" style={{ minHeight: 450 }} />
            </div>
        </div>
    );
}

export default CourseAdmin;