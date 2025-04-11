import { Radio, Space, Button } from 'antd';
import React, { useState } from 'react';
import { Interaction } from '../../../types/db';

interface ChoiceInteractionProps {
    data: Interaction;
    isSubmitted: boolean;
    onSubmit: (answer: string, isCorrect: boolean) => void;
}

const ChoiceInteraction: React.FC<ChoiceInteractionProps> = ({ data, isSubmitted, onSubmit }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const handleOptionSelect = (e: any) => {
        if (!isSubmitted) {
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
                         disabled={isSubmitted}>
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

            {!isSubmitted && selectedOption !== null && (
                <div style={{ marginTop: 16 }}><Button type="primary" onClick={handleSubmit}> 确认答案 </Button></div>
            )}
        </div>
    );
};

export default ChoiceInteraction;