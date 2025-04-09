import { ButtonView, Editor } from 'ckeditor5';
import { InteractionType } from '../../../../types/common.ts';

// 创建按钮的工厂方法
export function createButton(editor: Editor, name: string, label: string, icon: string, command: string, blockType?: InteractionType) {
    editor.ui.componentFactory.add(name, locale => {
        const button = new ButtonView(locale);

        button.set({
            label,
            icon,
            tooltip: true,
            isToggleable: false,
        });

        button.on('execute', () => {
            editor.execute(command, blockType);
        });

        return button;
    });
} 