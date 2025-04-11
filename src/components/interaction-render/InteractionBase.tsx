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
}

const InteractionBase: React.FC<InteractionBaseProps> = ({ id, onAnswer }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [data, setData] = useState<Interaction>();

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
                    />
                );
            case 'gap':
                return (
                    <GapInteraction 
                        data={data} 
                        isSubmitted={isSubmitted} 
                        onSubmit={handleSubmit} 
                    />
                );
            case 'flow':
                return (
                    <FlowInteraction 
                        data={data} 
                        isSubmitted={isSubmitted} 
                        onSubmit={handleSubmit} 
                    />
                );
            case 'file':
                return (
                    <FileInteraction 
                        data={data} 
                        isSubmitted={isSubmitted} 
                        onSubmit={handleSubmit} 
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