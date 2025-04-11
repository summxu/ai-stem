import { Button, Flex, Form, Input, InputNumber, message, Modal, ModalProps } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import type { Interaction, InteractionType } from '../../../types/db';
import { databases } from '../../utils/appwrite.ts';
import { CollectionName, DatabaseName, InteractionTypeName } from '../../../types/enums.ts';
import { ID } from 'appwrite';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

interface InteractionModalProps extends ModalProps {
    type: InteractionType;
    id?: string;
    onSuccess: (interactionData: Interaction, type: 'update' | 'insert') => void;
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
                props.onSuccess(interactionData, 'update');
            } else {
                interactionData = await databases.createDocument<Interaction>(DatabaseName.ai_stem, CollectionName.interaction, ID.unique(), formData);
                props.onSuccess(interactionData, 'insert');
            }
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
        if (props.open && props.id) {
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
                {(props.type === 'choice' || props.type === 'flow') && <Fragment>
                    <p>选项{props.type === 'flow' && '（正确答案的顺序，前端会自动打乱）'}</p>
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
                                                icon={<ArrowUpOutlined />}
                                                onClick={() => {
                                                    if (index > 0) {
                                                        // 交换当前选项与上一个选项
                                                        const options = form.getFieldValue('options');
                                                        [options[index], options[index - 1]] = [options[index - 1], options[index]];
                                                        form.setFieldsValue({ options });
                                                        handleOptionsChange();
                                                    }
                                                }}
                                                disabled={index === 0}>
                                            </Button>
                                            <Button
                                                icon={<ArrowDownOutlined />}
                                                onClick={() => {
                                                    const options = form.getFieldValue('options');
                                                    if (index < options.length - 1) {
                                                        // 交换当前选项与下一个选项
                                                        [options[index], options[index + 1]] = [options[index + 1], options[index]];
                                                        form.setFieldsValue({ options });
                                                        handleOptionsChange();
                                                    }
                                                }}
                                                disabled={index === fields.length - 1}>
                                            </Button>
                                            <Button
                                                type="text"
                                                danger
                                                onClick={() => {
                                                    remove(field.name);
                                                    handleOptionsChange();
                                                }}>
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
                </Fragment>}

                {props.type === 'gap' && <Form.Item name="content" label="内容" tooltip="{{}}代表一个填空，{{内容}}代表答案内容并且会答案判定">
                    <Input.TextArea rows={4} placeholder="请输入填空内容" />
                </Form.Item>}

                {props.type === 'choice' && <Form.Item name="answer" label="正确答案" tooltip="正确答案的序号，从1开始">
                    <InputNumber min={1} max={optionsCount || 1} placeholder="请输入正确答案的序号"
                        style={{ width: '100%' }} />
                </Form.Item>}

                {(props.type === 'choice' || props.type === 'flow' || props.type === 'gap') &&
                    <Form.Item name="explain" label="解析">
                        <Input.TextArea rows={4} placeholder="请输入题目解析" />
                    </Form.Item>}
            </Form>
        </Modal>
    );
}

export default InteractionModal;
