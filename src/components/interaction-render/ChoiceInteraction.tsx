import { Radio, Space, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { Interaction } from '../../../types/db';

interface ChoiceInteractionProps {
    data: Interaction;
    isSubmitted: boolean;
    onSubmit: (answer: string, isCorrect: boolean) => void;
    savedAnswer?: string[];
    disabled?: boolean;
}

const ChoiceInteraction: React.FC<ChoiceInteractionProps> = ({ data, isSubmitted, onSubmit, savedAnswer, disabled = false }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    
    // 如果有保存的答案，初始化选中项
    useEffect(() => {
        if (savedAnswer && savedAnswer.length > 0) {
            // 尝试将答案转换为选项索引
            const savedIndex = parseInt(savedAnswer[0]);
            if (!isNaN(savedIndex)) {
                setSelectedOption(savedIndex);
            } else if (data.options) {
                // 如果答案是选项文本，查找对应的索引
                const index = data.options.findIndex(option => option === savedAnswer[0]);
                if (index !== -1) {
                    setSelectedOption(index + 1);
                }
            }
        }
    }, [savedAnswer, data.options]);

    const handleOptionSelect = (e: any) => {
        if (!isSubmitted && !disabled) {
            setSelectedOption(e.target.value + 1);
        }
    };

    const handleSubmit = () => {
        if (selectedOption !== null) {
            // 判断答案是否正确
            const isCorrect = selectedOption === data.answer;
            // 传递选择的答案和是否正确
            onSubmit(data.options![selectedOption - 1], isCorrect);
        }
    };

    return (
        <div>
            <Radio.Group onChange={handleOptionSelect} value={selectedOption && selectedOption - 1}
                         disabled={isSubmitted || disabled}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    {data.options?.map((option, index) => (
                        <Radio
                            key={index}
                            value={index}
                            style={{ fontSize: 16 }}
                        >
                            {option}
                        </Radio>
                    ))}
                </Space>
            </Radio.Group>

            {!isSubmitted && !disabled && selectedOption !== null && (
                <div style={{ marginTop: 16 }}><Button type="primary" onClick={handleSubmit}> 确认答案 </Button></div>
            )}
        </div>
    );
};

export default ChoiceInteraction;