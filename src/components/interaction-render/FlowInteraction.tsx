import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { Interaction } from '../../../types/db';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuOutlined } from '@ant-design/icons';

interface FlowInteractionProps {
    data: Interaction;
    isSubmitted: boolean;
    onSubmit: (answers: string[], isCorrect: boolean) => void;
    savedAnswer?: string[];
    disabled?: boolean;
}

// 可排序的单个流程项组件
interface SortableItemProps {
    id: string;
    option: string;
    isSubmitted: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, option, isSubmitted }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const,
        zIndex: isDragging ? 1 : 0,
    };
    
    return (
        <div ref={setNodeRef} style={style} className="flow-node">
            <div className="flow-item">
                <div style={{ flex: 1, fontSize: 16 }}>{option}</div>
                {!isSubmitted && (
                    <div 
                        {...attributes} 
                        {...listeners}
                        style={{ cursor: 'grab', padding: '0 8px' }}
                    >
                        <MenuOutlined />
                    </div>
                )}
            </div>
        </div>
    );
};

const FlowInteraction: React.FC<FlowInteractionProps> = ({ data, isSubmitted, onSubmit, savedAnswer, disabled = false }) => {
    // 用户排序后的选项
    const [sortedOptions, setSortedOptions] = useState<string[]>([]);
    // 正确的选项顺序
    const [correctOrder, setCorrectOrder] = useState<string[]>([]);
    
    // 配置传感器
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (data.options && data.options.length > 0) {
            if (savedAnswer && savedAnswer.length > 0) {
                // 如果有保存的答案，使用保存的答案顺序
                setSortedOptions([...savedAnswer]);
            } else {
                // 初始化时随机打乱选项顺序
                const shuffled = [...data.options].sort(() => Math.random() - 0.5);
                setSortedOptions(shuffled);
            }
            // 保存正确顺序
            setCorrectOrder([...data.options]);
        }
    }, [data.options, savedAnswer]);
    
    // 处理拖拽结束事件
    const handleDragEnd = (event: DragEndEvent) => {
        if (isSubmitted || disabled) return;
        
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
            setSortedOptions((items) => {
                const oldIndex = items.findIndex(item => item === active.id);
                const newIndex = items.findIndex(item => item === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSubmit = () => {
        // 判断答案是否正确 - 流程题要求完全按顺序匹配
        const isCorrect = sortedOptions.every((option, index) => option === correctOrder[index]);
        // 传递排序后的答案和是否正确
        onSubmit(sortedOptions, isCorrect);
    };

    return (
        <div className="flow-interaction-container">
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flow-chart">
                    <SortableContext 
                        items={sortedOptions} 
                        strategy={verticalListSortingStrategy}
                    >
                        {sortedOptions.map((option, index) => (
                            <React.Fragment key={option}>
                                {index > 0 && (
                                    <div className="flow-connector">
                                        <div className="flow-arrow"></div>
                                    </div>
                                )}
                                <SortableItem 
                                    id={option} 
                                    option={option} 
                                    isSubmitted={isSubmitted || disabled} 
                                />
                            </React.Fragment>
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            {!isSubmitted && !disabled && (
                <div style={{ marginTop: 16 }}><Button type="primary" onClick={handleSubmit}> 确认答案 </Button></div>
            )}
        </div>
    );
};

export default FlowInteraction;