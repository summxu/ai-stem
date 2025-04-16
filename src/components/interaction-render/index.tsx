import React from 'react';
import InteractionBase from './InteractionBase';
import './index.scss';

interface InteractionRenderProps {
    id: string;
    onAnswer?: (answer: string) => void;
    savedAnswer?: string[];
    disabled?: boolean;
}

const InteractionRender: React.FC<InteractionRenderProps> = ({ id, onAnswer, savedAnswer, disabled = false }) => {
    return (
        <div className="interaction-render-box">
            <InteractionBase id={id} onAnswer={onAnswer} savedAnswer={savedAnswer} disabled={disabled} />
        </div>
    );
};

export default InteractionRender;