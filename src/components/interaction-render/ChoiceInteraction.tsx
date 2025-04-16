import { Checkbox, Space, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { Interaction } from '../../../types/db';

interface ChoiceInteractionProps {
    data: Interaction;
    isSubmitted: boolean;
    onSubmit: (answer: string[], isCorrect: boolean) => void;
    savedAnswer?: string[];
    disabled?: boolean;
}

const ChoiceInteraction: React.FC<ChoiceInteractionProps> = ({ data, isSubmitted, onSubmit, savedAnswer, disabled = false }) => {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    
    // 如果有保存的答案，初始化选中项
    useEffect(() => {
        if (savedAnswer && savedAnswer.length > 0) {
            const selectedIndexes: number[] = [];
            
            savedAnswer.forEach(answer => {
                // 尝试将答案转换为选项索引
                const savedIndex = parseInt(answer);
                if (!isNaN(savedIndex)) {
                    selectedIndexes.push(savedIndex);
                } else if (data.options) {
                    // 如果答案是选项文本，查找对应的索引
                    const index = data.options.findIndex(option => option === answer);
                    if (index !== -1) {
                        selectedIndexes.push(index + 1);
                    }
                }
            });
            
            setSelectedOptions(selectedIndexes);
        }
    }, [savedAnswer, data.options]);

    const handleOptionSelect = (checkedValues: number[]) => {
        if (!isSubmitted && !disabled) {
            // 将选项索引转换为从1开始的索引
            setSelectedOptions(checkedValues.map(value => value + 1));
        }
    };

    const handleSubmit = () => {
        if (selectedOptions.length > 0) {
            // 判断答案是否正确
            // 检查选中的选项是否与正确答案数组完全匹配
            const isCorrect = Array.isArray(data.answer) && 
                data.answer.length === selectedOptions.length && 
                data.answer.every(ans => selectedOptions.includes(ans));
            
            // 传递选择的答案和是否正确
            const selectedTexts = selectedOptions.map(index => data.options![index - 1]);
            onSubmit(selectedTexts, isCorrect);
        }
    };

    return (
        <div>
            <Checkbox.Group onChange={handleOptionSelect} value={selectedOptions.map(opt => opt - 1)}
                         disabled={isSubmitted || disabled}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    {data.options?.map((option, index) => (
                        <Checkbox
                            key={index}
                            value={index}
                            style={{ fontSize: 16 }}
                        >
                            {option}
                        </Checkbox>
                    ))}
                </Space>
            </Checkbox.Group>

            {!isSubmitted && !disabled && selectedOptions.length > 0 && (
                <div style={{ marginTop: 16 }}><Button type="primary" onClick={handleSubmit}> 确认答案 </Button></div>
            )}
        </div>
    );
};

export default ChoiceInteraction;