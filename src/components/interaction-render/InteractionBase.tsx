import { Alert, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Interaction } from '../../../types/db';
import { CollectionName, DatabaseName } from '../../../types/enums';
import { databases } from '../../utils/appwrite';
import FlowInteraction from './FlowInteraction';
import FileInteraction from './FileInteraction';
import ChoiceInteraction from './ChoiceInteraction.tsx';
import GapInteraction from './GapInteraction.tsx';

interface InteractionBaseProps {
    id: string;
    onAnswer?: (answer: string) => void;
    savedAnswer?: string[];
    disabled?: boolean;
}

const InteractionBase: React.FC<InteractionBaseProps> = ({ id, onAnswer, savedAnswer, disabled = false }) => {
    const [isSubmitted, setIsSubmitted] = useState(!!savedAnswer);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [data, setData] = useState<Interaction>();
    useEffect(() => {
        const getData = async () => {
            console.log(123)
            try {
                const interactionData = await databases.getDocument<Interaction>(
                    DatabaseName.ai_stem,
                    CollectionName.interaction,
                    id
                );
                setData(interactionData);
            } catch (e) {
                message.error((e as Error).message);
            }
        };
        getData();
    }, [id]);

    useEffect(() => {
        // 如果有保存的答案，检查是否正确
        if (savedAnswer && savedAnswer.length > 0 && data) {
            checkAnswerCorrect(savedAnswer, data);
        }
    }, [savedAnswer])

    // 检查答案是否正确
    const checkAnswerCorrect = (answer: string[], interactionData: Interaction) => {
        let isAnswerCorrect = false;

        if (interactionData.type === 'choice') {
            // 选择题判断
            const selectedIndex = parseInt(answer[0]) - 1;
            isAnswerCorrect = selectedIndex === interactionData.answer! - 1;
        } else if (interactionData.type === 'gap' && interactionData.content) {
            // 填空题判断
            const correctAnswers = interactionData.content
                .match(/\{\{([^}]*)\}\}/g)
                ?.map(match => match.slice(2, -2)) || [];
            isAnswerCorrect = correctAnswers.every((correct, index) =>
                answer[index] && answer[index].trim().toLowerCase() === correct.trim().toLowerCase());
        }

        setIsCorrect(isAnswerCorrect);
    };

    // 处理加载状态和不支持的类型
    if (!data) {
        return <div>加载中...</div>;
    }

    if (data.type !== 'choice' && data.type !== 'gap' && data.type !== 'flow' && data.type !== 'file') {
        return <div>暂不支持的互动类型</div>;
    }

    if ((data.type === 'choice' || data.type === 'flow') && (!data.options || data.options.length === 0)) {
        return <div>选项数据不完整</div>;
    }

    if (data.type === 'gap' && !data.content) {
        return <div>填空题数据不完整</div>;
    }

    const handleSubmit = (answer: string | string[], isAnswerCorrect: boolean) => {
        setIsSubmitted(true);
        setIsCorrect(isAnswerCorrect);

        // 如果有回调函数，传递答案
        if (onAnswer) {
            if (Array.isArray(answer)) {
                onAnswer(answer.join(','));
            } else {
                onAnswer(answer);
            }
        }
    };

    // 根据题目类型渲染不同的组件
    const renderInteractionByType = () => {
        switch (data.type) {
            case 'choice':
                return (
                    <ChoiceInteraction
                        data={data}
                        isSubmitted={isSubmitted}
                        onSubmit={handleSubmit}
                        savedAnswer={savedAnswer}
                        disabled={disabled}
                    />
                );
            case 'gap':
                return (
                    <GapInteraction
                        data={data}
                        isSubmitted={isSubmitted}
                        onSubmit={handleSubmit}
                        savedAnswer={savedAnswer}
                        disabled={disabled}
                    />
                );
            case 'flow':
                return (
                    <FlowInteraction
                        data={data}
                        isSubmitted={isSubmitted}
                        onSubmit={handleSubmit}
                        savedAnswer={savedAnswer}
                        disabled={disabled}
                    />
                );
            case 'file':
                return (
                    <FileInteraction
                        data={data}
                        isSubmitted={isSubmitted}
                        onSubmit={handleSubmit}
                        savedAnswer={savedAnswer}
                        disabled={disabled}
                    />
                );
            default:
                return <div>暂不支持的互动类型</div>;
        }
    };

    return (
        <div className="interaction-render">
            {data?.title && <div className="interaction-title">
                <p>{data?.title}</p>
            </div>}

            <div className="interaction-content" style={{ margin: '16px 0' }}>
                {renderInteractionByType()}
            </div>

            {isSubmitted && data?.explain && (
                <Alert
                    style={{ padding: '8px 12px' }}
                    message={
                        isCorrect ? '恭喜你回答正确🎉' :
                            data.type === 'choice' ?
                                `正确答案是：${data?.options![data.answer! - 1]}` :
                                data.type === 'gap' && data.content ?
                                    `正确答案是：${data.content.match(/\{\{([^}]*)\}\}/g)?.map(match => match.slice(2, -2)).join(', ')}` :
                                    '答案不正确'
                    }
                    description={`答案解析：${data?.explain}`}
                    type={isCorrect ? 'success' : 'error'}
                    showIcon
                />
            )}
        </div>
    );
};

export default InteractionBase;