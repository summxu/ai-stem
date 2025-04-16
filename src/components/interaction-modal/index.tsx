import { Button, Flex, Form, Input, InputNumber, message, Modal, ModalProps, Checkbox, Space } from 'antd';
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

    // 当options变化时更新选项数量和检查答案
    const handleOptionsChange = () => {
        const options = form.getFieldValue('options');
        setOptionsCount(options?.length || 0);
        
        // 检查答案是否在选项范围内
        const currentAnswers = form.getFieldValue('answer') || [];
        if (Array.isArray(currentAnswers) && currentAnswers.length > 0) {
            // 过滤掉不在选项范围内的答案
            const validAnswers = currentAnswers.filter((ans: number) => ans <= options?.length);
            if (validAnswers.length !== currentAnswers.length) {
                form.setFieldValue('answer', validAnswers);
            }
        }
        
        if (!options?.length) {
            form.setFieldValue('answer', []);
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
                <Form.Item name="title" label="标题">
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
                                              <Input style={{width:'calc(100% - 110px)'}} placeholder="请输入选项内容" onChange={handleOptionsChange} />
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

                {props.type === 'gap' &&
                  <Form.Item rules={[
                      {
                          required: true,
                          whitespace: true,
                          message: '请输入内容',
                      },
                  ]} name="content" label="内容" tooltip="{{}}代表一个填空，{{内容}}代表答案内容并且会答案判定">
                    <Input.TextArea rows={4} placeholder="请输入填空内容" />
                  </Form.Item>}

                {props.type === 'choice' && <Form.Item name="answer" label="正确答案" tooltip="可选择多个正确答案" rules={[
                    {
                        validator: async (_, value) => {
                            if (!value || value.length === 0) {
                                return Promise.reject(new Error('请至少选择一个正确答案'));
                            }
                            return Promise.resolve();
                        },
                    },
                ]}>
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {form.getFieldValue('options')?.map((option: string, index: number) => (
                        <Checkbox key={index} value={index + 1}>{option}</Checkbox>
                      ))}
                    </Space>
                  </Checkbox.Group>
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
