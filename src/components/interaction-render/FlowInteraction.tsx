import { Button, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { Interaction } from '../../../types/db';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

interface FlowInteractionProps {
    data: Interaction;
    isSubmitted: boolean;
    onSubmit: (answers: string[], isCorrect: boolean) => void;
}

const FlowInteraction: React.FC<FlowInteractionProps> = ({ data, isSubmitted, onSubmit }) => {
    // 用户排序后的选项
    const [sortedOptions, setSortedOptions] = useState<string[]>([]);
    // 正确的选项顺序
    const [correctOrder, setCorrectOrder] = useState<string[]>([]);

    useEffect(() => {
        if (data.options && data.options.length > 0) {
            // 初始化时随机打乱选项顺序
            const shuffled = [...data.options].sort(() => Math.random() - 0.5);
            setSortedOptions(shuffled);
            // 保存正确顺序
            setCorrectOrder([...data.options]);
        }
    }, [data.options]);

    const moveOption = (index: number, direction: 'up' | 'down') => {
        if (isSubmitted) return;

        const newOptions = [...sortedOptions];
        if (direction === 'up' && index > 0) {
            // 向上移动
            [newOptions[index], newOptions[index - 1]] = [newOptions[index - 1], newOptions[index]];
        } else if (direction === 'down' && index < newOptions.length - 1) {
            // 向下移动
            [newOptions[index], newOptions[index + 1]] = [newOptions[index + 1], newOptions[index]];
        }
        setSortedOptions(newOptions);
    };

    const handleSubmit = () => {
        // 判断答案是否正确 - 流程题要求完全按顺序匹配
        const isCorrect = sortedOptions.every((option, index) => option === correctOrder[index]);
        // 传递排序后的答案和是否正确
        onSubmit(sortedOptions, isCorrect);
    };

    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }}>
                {sortedOptions.map((option, index) => (
                    <div
                        key={index}
                        className="flow-item"
                    >
                        <div style={{ flex: 1, fontSize: 16 }}>{option}</div>
                        {!isSubmitted && (
                            <Space>
                                <Button
                                    icon={<ArrowUpOutlined />}
                                    disabled={index === 0}
                                    onClick={() => moveOption(index, 'up')}
                                />
                                <Button
                                    icon={<ArrowDownOutlined />}
                                    disabled={index === sortedOptions.length - 1}
                                    onClick={() => moveOption(index, 'down')}
                                />
                            </Space>
                        )}
                    </div>
                ))}
            </Space>

            {!isSubmitted && (
                <div style={{ marginTop: 16 }}><Button type="primary" onClick={handleSubmit}> 确认答案 </Button></div>
            )}
        </div>
    );
};

export default FlowInteraction;