import { Alert, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Interaction, Learning } from '../../../types/db';
import { CollectionName, DatabaseName } from '../../../types/enums';
import { databases } from '../../utils/appwrite';
import FlowInteraction from './FlowInteraction';
import FileInteraction from './FileInteraction';
import ChoiceInteraction from './ChoiceInteraction.tsx';
import GapInteraction from './GapInteraction.tsx';
import { Query } from 'appwrite';

interface InteractionBaseProps {
    id: string;
    onAnswer?: (answer: string[], isCorrect: boolean) => void;
    savedAnswer?: string[];
    disabled?: boolean;
}

const InteractionBase: React.FC<InteractionBaseProps> = ({ id, onAnswer, savedAnswer, disabled = false }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [data, setData] = useState<Interaction>();
    const [promptIndex, setPromptIndex] = useState<number>(0); // 当前显示的提示索引
    const [showPrompt, setShowPrompt] = useState<boolean>(false); // 是否显示提示
    useEffect(() => {
        const getData = async () => {
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
            // 选择题判断 - 支持多选
            if (Array.isArray(interactionData.answer)) {
                // 多选题判断
                if (answer.length === interactionData.answer.length) {
                    // 将用户答案转换为索引数组
                    const answerIndexes: number[] = [];

                    answer.forEach(ans => {
                        const index = parseInt(ans);
                        if (!isNaN(index)) {
                            answerIndexes.push(index);
                        } else if (interactionData.options) {
                            // 如果答案是选项文本，查找对应的索引
                            const optIndex = interactionData.options.findIndex(opt => opt === ans);
                            if (optIndex !== -1) {
                                answerIndexes.push(optIndex + 1);
                            }
                        }
                    });

                    // 检查所有答案是否匹配
                    isAnswerCorrect = interactionData.answer.every(ans =>
                        answerIndexes.includes(ans)
                    ) && answerIndexes.every(idx =>
                        interactionData.answer!.includes(idx)
                    );
                }
            } else {
                // 兼容旧的单选逻辑
                const selectedIndex = parseInt(answer[0]) - 1;
                isAnswerCorrect = selectedIndex === interactionData.answer! - 1;
            }
        } else if (interactionData.type === 'gap' && interactionData.content) {
            // 填空题判断
            const correctAnswers = interactionData.content
                .match(/\{\{([^}]*)\}\}/g)
                ?.map(match => match.slice(2, -2)) || [];
            isAnswerCorrect = correctAnswers.every((correct, index) =>
                answer[index] && answer[index].trim().toLowerCase() === correct.trim().toLowerCase());
        }
        setIsSubmitted(true);
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

    const handleSubmit = async (answer: string | string[], isAnswerCorrect?: boolean) => {
        const { documents } = await databases.listDocuments<Learning>(
            DatabaseName.ai_stem,
            CollectionName.leaning,
            [
                Query.equal('interaction', [id]),
                Query.orderDesc('$createdAt')
            ]
        );
        // 如果回答错误且有提示可用，显示提示而不是提交
        if (!isAnswerCorrect && data?.prompt && data.prompt.length > 0 && promptIndex < data.prompt.length) {
            setShowPrompt(true);
            setPromptIndex(documents.length + 1);
        } else {
            setIsSubmitted(true);
            // 如果回答正确，更新状态，如果
            setIsCorrect(isAnswerCorrect || false);
        }

        let isCompleted = false;
        if (promptIndex >= data.prompt.length) {
            isCompleted = true;
        }

        // 如果有回调函数，传递答案
        if (onAnswer) {
            if (Array.isArray(answer)) {
                onAnswer(answer, isCompleted || isCorrect!);
            } else {
                onAnswer([answer], isCompleted || isCorrect!);
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

            {showPrompt && !isSubmitted && data?.prompt && promptIndex > 0 && (
                <Alert
                    style={{ padding: '8px 12px', marginBottom: '16px' }}
                    message={`提示 ${promptIndex}/${data.prompt.length}`}
                    description={data.prompt[promptIndex - 1]}
                    type="warning"
                    showIcon
                />
            )}

            {isSubmitted && data?.explain && (
                <Alert
                    style={{ padding: '8px 12px' }}
                    message={
                        isCorrect ? '恭喜你回答正确🎉' :
                            data.type === 'choice' ?
                                Array.isArray(data.answer) ?
                                    `正确答案是：${data.answer.map(ans => data?.options![ans - 1]).join(', ')}` :
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