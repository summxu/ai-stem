import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { Interaction } from '../../../types/db';

interface GapInteractionProps {
    data: Interaction;
    isSubmitted: boolean;
    onSubmit: (answers: string[], isCorrect: boolean) => void;
}

const GapInteraction: React.FC<GapInteractionProps> = ({ data, isSubmitted, onSubmit }) => {
    const [gapAnswers, setGapAnswers] = useState<string[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);

    // 解析填空题内容，提取出正确答案
    useEffect(() => {
        if (data.content) {
            parseGapContent(data.content);
        }
    }, [data.content]);

    const parseGapContent = (content: string) => {
        const regex = /\{\{([^}]*)\}\}/g;
        const answers: string[] = [];
        let match;

        // 提取所有答案
        while ((match = regex.exec(content)) !== null) {
            answers.push(match[1] || ''); // 如果括号内没有内容，则为空字符串
        }

        setCorrectAnswers(answers);
        setGapAnswers(new Array(answers.length).fill(''));
    };

    // 渲染填空题内容
    const renderGapContent = () => {
        if (!data?.content) return null;

        const regex = /\{\{([^}]*)\}\}/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        let index = 0;

        while ((match = regex.exec(data.content)) !== null) {
            // 添加填空前的文本
            if (match.index > lastIndex) {
                parts.push(
                    <span key={`text-${index}`}>
                        {data.content.substring(lastIndex, match.index)}
                    </span>,
                );
            }

            // 添加填空输入框
            parts.push(
                <Input
                    className="gap-input"
                    key={`gap-${index}`}
                    data-index={index}
                    disabled={isSubmitted}
                    value={gapAnswers[index]}
                    onChange={(e) => {
                        const dataIndex = Number(e.target.getAttribute('data-index'));
                        const newAnswers = [...gapAnswers];
                        newAnswers[dataIndex] = e.target.value;
                        setGapAnswers(newAnswers);
                    }}
                />,
            );

            lastIndex = match.index + match[0].length;
            index++;
        }

        // 添加最后一部分文本
        if (lastIndex < data.content.length) {
            parts.push(
                <span key={`text-${index}`}>
                    {data.content.substring(lastIndex)}
                </span>,
            );
        }

        return <div style={{ fontSize: 16, lineHeight: '32px' }}>{parts}</div>;
    };

    const handleSubmit = () => {
        // 判断填空题答案是否正确
        const allCorrect = gapAnswers.every((answer, index) =>
            answer.trim() === correctAnswers[index].trim(),
        );

        // 传递填空的答案和是否正确
        onSubmit(gapAnswers, allCorrect);
    };

    return (
        <div>
            {renderGapContent()}
            {!isSubmitted && gapAnswers.some(answer => answer.trim() !== '') && (
                <div style={{ marginTop: 16 }}><Button type="primary" onClick={handleSubmit}> 确认答案 </Button></div>
            )}
        </div>
    );
};

export default GapInteraction;