import { Button, Flex, Form, Input, InputNumber, message, Modal, ModalProps } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import type { Interaction, InteractionType } from '../../../types/db';
import { databases } from '../../utils/appwrite.ts';
import { CollectionName, DatabaseName, InteractionTypeName } from '../../../types/enums.ts';
import { ID } from 'appwrite';

interface InteractionModalProps extends ModalProps {
    type: InteractionType;
    id?: string;
    onSuccess: (interactionData: Interaction) => void;
}

function InteractionModal(props: InteractionModalProps) {
    const [form] = Form.useForm();
    const [optionsCount, setOptionsCount] = useState<number>(0);

    // 当options变化时更新答案的最大值
    const handleOptionsChange = () => {
        const options = form.getFieldValue('options');
        setOptionsCount(options?.length || 0);
        // 如果当前答案大于选项数量，则重置答案
        const currentAnswer = form.getFieldValue('answer');
        if (currentAnswer > options?.length) {
            form.setFieldValue('answer', options?.length);
        }
        if (!options?.length) {
            form.setFieldValue('answer', undefined);
        }
    };

    const handleSubmit = async () => {
        const formData: Interaction = form.getFieldsValue();
        formData.type = props.type;
        await form.validateFields();
        // 上传选项
        try {
            let interactionData;
            if (props.id) {
                interactionData = await databases.updateDocument<Interaction>(DatabaseName.ai_stem, CollectionName.interaction, props.id, formData);
            } else {
                interactionData = await databases.createDocument<Interaction>(DatabaseName.ai_stem, CollectionName.interaction, ID.unique(), formData);
            }
            props.onSuccess(interactionData);
            form.submit();
        } catch (e) {
            message.error((e as Error).message);
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const interactionData = await databases.getDocument(DatabaseName.ai_stem, CollectionName.interaction, props.id!);
                form.setFieldsValue(interactionData);
            } catch (e) {
                message.error((e as Error).message);
            }
        };
        form.resetFields();
        setOptionsCount(0);
        if (props.id) {
            getData();
        }
    }, [props.open]);

    return (
        <Modal
            title={`插入${InteractionTypeName[props.type]}`}
            okText="确定"
            cancelText="取消"
            maskClosable={false}
            width={850}
            keyboard={false}
            onOk={handleSubmit}
            {...props}>
            <Form form={form} layout="vertical">
                <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
                    <Input placeholder="请输入题目标题" />
                </Form.Item>
                <p>选项</p>
                <Form.List name="options" rules={[
                    {
                        validator: async (_, options) => {
                            if (!options || options.length < 2) {
                                return Promise.reject(new Error('至少需要2个选项'));
                            }
                            return Promise.resolve();
                        },
                    },
                ]}>
                    {(fields, { add, remove }, { errors }) => (
                        <Fragment>
                            {fields.map((field, index) => (
                                <Form.Item required={false} key={field.key}>
                                    <Flex>
                                        <Form.Item
                                            {...field}
                                            key={index}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入选项内容或删除此选项',
                                                },
                                            ]}
                                            noStyle>
                                            <Input placeholder="请输入选项内容" onChange={handleOptionsChange} />
                                        </Form.Item>
                                        <Button
                                            type="text"
                                            danger
                                            onClick={() => {
                                                remove(field.name);
                                                handleOptionsChange();
                                            }}
                                            style={{ marginLeft: '8px' }}>
                                            删除
                                        </Button>
                                    </Flex>
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} style={{ width: '100%' }}>
                                    添加选项
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </Fragment>
                    )}
                </Form.List>

                <Form.Item name="answer" label="正确答案" tooltip="正确答案的序号，从1开始">
                    <InputNumber min={1} max={optionsCount || 1} placeholder="请输入正确答案的序号"
                                 style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="explain" label="解析">
                    <Input.TextArea rows={4} placeholder="请输入题目解析" />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default InteractionModal;
