import React from 'react';
import InteractionBase from './InteractionBase';
import './index.scss';

interface InteractionRenderProps {
    id: string;
    onAnswer?: (answer: string) => void;
}

const InteractionRender: React.FC<InteractionRenderProps> = ({ id, onAnswer }) => {
    return (
        <div className="interaction-render-box">
            <InteractionBase id={id} onAnswer={onAnswer} />
        </div>
    );
};

export default InteractionRender;