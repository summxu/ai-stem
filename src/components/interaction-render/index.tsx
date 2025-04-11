import { Alert, Button, message, Radio, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Interaction } from '../../../types/db';
import { CollectionName, DatabaseName } from '../../../types/enums';
import { databases } from '../../utils/appwrite';

interface InteractionRenderProps {
    id: string;
    onAnswer?: (answer: string) => void;
}

const InteractionRender: React.FC<InteractionRenderProps> = ({ id, onAnswer }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [data, setData] = useState<Interaction>()

    useEffect(() => {
        const getData = async () => {
            try {
                const interactionData = await databases.getDocument<Interaction>(DatabaseName.ai_stem, CollectionName.interaction, id);
                setData(interactionData)
            } catch (e) {
                message.error((e as Error).message);
            }
        };
        getData()
    }, [])

    // 只处理选择题类型
    if (data?.type !== 'choice' || !data?.options || data?.options.length === 0) {
        return <div>暂不支持的互动类型或数据不完整</div>;
    }

    const handleOptionSelect = (e: any) => {
        if (!isSubmitted) {
            setSelectedOption(e.target.value);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);

        // 如果有answer字段，判断答案是否正确
        if (data?.answer !== undefined) {
            setIsCorrect(selectedOption === data?.answer);
        }

        // 如果有回调函数，传递选择的答案
        if (onAnswer && selectedOption !== null) {
            onAnswer(data?.options![selectedOption]);
        }
    };

    return (
        <div className="interaction-render">
            <div className="interaction-title">
                <p>{data?.title}</p>
            </div>

            <div className="interaction-content" style={{ margin: '16px 0' }}>
                <Radio.Group onChange={handleOptionSelect} value={selectedOption} disabled={isSubmitted}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {data?.options.map((option, index) => (
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
            </div>

            {!isSubmitted && selectedOption !== null && (
                <Button type="primary" onClick={handleSubmit}>
                    确认答案
                </Button>
            )}

            {isSubmitted && data?.explain && (
                <Alert
                    style={{ padding: '8px 12px' }}
                    message={isCorrect ? '恭喜你回答正确🎉' : '回答错误再接再厉'}
                    description={`答案解析：${data?.explain}`}
                    type={isCorrect ? 'success' : 'error'}
                    showIcon
                />
            )}
        </div>
    );
};

export default InteractionRender;