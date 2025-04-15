import { PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Form, Modal, ModalProps, message } from 'antd';
import { ID, Query } from 'appwrite';
import { ClassicEditor, EventInfo } from 'ckeditor5';
import { useEffect, useState } from 'react';
import { Chapter } from '../../../types/db';
import { CollectionName, DatabaseName, StepType } from '../../../types/enums';
import { databases } from '../../utils/appwrite';
import CKeditor from '../ckeditor';
import './index.scss';

interface CourseContentModalProps extends ModalProps {
    courseId?: string;
    onSuccess?: () => void;
}

type StepChapters = {
    [K in StepType]?: Chapter[];
};

function CourseContentModal({ courseId, onSuccess, ...props }: CourseContentModalProps) {
    const [form] = Form.useForm();
    const [stepChapters, setStepChapters] = useState<StepChapters>({});
    const [loading, setLoading] = useState(false);

    // 获取课程章节数据
    useEffect(() => {
        if (props.open && courseId) {
            setLoading(true);
            fetchChapters();
        }
    }, [props.open, courseId]);

    const fetchChapters = async () => {
        try {
            const response = await databases.listDocuments<Chapter>(
                DatabaseName.ai_stem,
                CollectionName.chapter,
                [Query.equal('course', [courseId!]), Query.orderAsc('sort')]
            );

            // 按步骤类型分组章节
            const grouped: StepChapters = {};
            response.documents.forEach(chapter => {
                const chapterStepValue = StepType[chapter.step] as StepType;
                if (!grouped[chapterStepValue]) {
                    grouped[chapterStepValue] = [];
                }
                grouped[chapterStepValue]!.push(chapter);
            });

            setStepChapters(grouped);

            // 设置表单初始值
            const formValues: any = {};
            response.documents.forEach(chapter => {
                formValues[`chapter_${chapter.$id}`] = chapter.content;
            });
            form.setFieldsValue(formValues);

            setLoading(false);
        } catch (error) {
            message.error('获取课程章节失败');
            setLoading(false);
        }
    };

    // 处理编辑器内容变化
    const handleEditorChange = (chapterId: string) => (data: EventInfo<string, unknown>, editor: ClassicEditor) => {
        const content = editor.data.get();
        form.setFieldsValue({ [`chapter_${chapterId}`]: content });
    };

    // 添加新章节
    const addChapter = async (step: StepType) => {
        try {
            const stepKey = Object.keys(StepType).find(key => StepType[key as keyof typeof StepType] === step) as StepType
            const sort = stepChapters[stepKey]?.length || 0;
            const newChapter = await databases.createDocument<Chapter>(
                DatabaseName.ai_stem,
                CollectionName.chapter,
                ID.unique(),
                {
                    content: '',
                    step: stepKey,
                    sort,
                    course: courseId
                }
            );

            // 更新状态
            setStepChapters((prev: StepChapters) => {
                const updated = { ...prev };
                if (!updated[step]) {
                    updated[step] = [];
                }
                updated[step] = [...(updated[step] || []), newChapter];
                return updated;
            });

            // 设置表单值
            form.setFieldsValue({ [`chapter_${newChapter.$id}`]: newChapter.content });
        } catch (error) {
            message.error('添加章节失败');
        }
    };

    // 删除章节
    const deleteChapter = async (chapter: Chapter) => {
        try {
            await databases.deleteDocument(
                DatabaseName.ai_stem,
                CollectionName.chapter,
                chapter.$id
            );

            // 更新状态
            setStepChapters((prev: StepChapters) => {
                const updated = { ...prev };
                if (updated[chapter.step as StepType]) {
                    updated[chapter.step as StepType] = updated[chapter.step as StepType]!.filter(
                        (item: Chapter) => item.$id !== chapter.$id
                    );
                }
                return updated;
            });

            message.success('删除章节成功');
        } catch (error) {
            message.error('删除章节失败');
        }
    };

    // 保存所有章节内容
    const handleSave = async () => {
        try {
            setLoading(true);
            const formValues = form.getFieldsValue();

            // 批量更新所有章节
            const updatePromises = Object.keys(formValues).map(key => {
                if (key.startsWith('chapter_')) {
                    const chapterId = key.replace('chapter_', '');
                    return databases.updateDocument<Chapter>(
                        DatabaseName.ai_stem,
                        CollectionName.chapter,
                        chapterId,
                        { content: formValues[key] }
                    );
                }
                return Promise.resolve();
            });

            await Promise.all(updatePromises);
            message.success('保存成功');
            onSuccess?.();
            props.onCancel?.(null as any);
            setLoading(false);
        } catch (error) {
            message.error('保存失败');
            setLoading(false);
        }
    };

    // 渲染步骤面板
    const renderStepPanels = () => {
        return Object.entries(StepType).map(([key, value]) => {
            const stepKey = key as keyof typeof StepType;
            const stepValue = value as StepType;
            const chapters = stepChapters[stepValue] || [];

            return (
                <Collapse.Panel key={stepKey} header={value}>
                    {chapters.map((chapter: Chapter, index: number) => (
                        <div key={chapter.$id} className="chapter-editor-container">
                            <div className="chapter-editor-header">
                                <span>第{index + 1}页</span>
                                <Button
                                    danger
                                    type="text"
                                    onClick={() => deleteChapter(chapter)}
                                >
                                    删除
                                </Button>
                            </div>
                            <Form.Item name={`chapter_${chapter.$id}`} noStyle>
                                <CKeditor
                                    initialData={chapter.content}
                                    onChange={handleEditorChange(chapter.$id)}
                                />
                            </Form.Item>
                        </div>
                    ))}
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => addChapter(stepValue)}
                        style={{ marginTop: 16, width: '100%' }}
                    >
                        添加内容
                    </Button>
                </Collapse.Panel>
            );
        });
    };

    return (
        <Modal
            title="课程内容编辑"
            width={1075}
            {...props}
            onOk={handleSave}
            okText="保存"
            cancelText="取消"
            confirmLoading={loading}
            maskClosable={false}
            keyboard={false}
        >
            <Form form={form} layout="vertical">
                <Collapse defaultActiveKey={Object.keys(StepType)}>
                    {renderStepPanels()}
                </Collapse>
            </Form>
        </Modal>
    );
}

export default CourseContentModal;