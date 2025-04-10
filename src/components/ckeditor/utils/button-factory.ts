import { ButtonView, Editor } from 'ckeditor5';
import { InteractionType } from '../../../../types/db.ts';

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
            
            // 触发自定义事件，将命令和类型发送到外部
            const customEvent = new CustomEvent('ckeditor:buttonExecuted', {
                detail: {
                    command,
                    blockType,
                    buttonName: name
                },
                bubbles: true,
                cancelable: true
            });
            
            // 获取编辑器DOM元素并分发事件
            const editorElement = editor.ui.view.element;
            if (editorElement) {
                editorElement.dispatchEvent(customEvent);
            }
        });

        return button;
    });
} 