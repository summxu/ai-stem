import { Command } from 'ckeditor5';

export class EditLockedBlockCommand extends Command {
    async execute() {
        const editor = this.editor;
        const selection = editor.model.document.selection;
        const selectedElement = selection.getSelectedElement();

        if (selectedElement && selectedElement.name === 'lockedBlock') {
            const id = selectedElement.getAttribute('id') as string;
            const command = selectedElement.getAttribute('command') as string;
            const type = selectedElement.getAttribute('type') as string;
            // 触发自定义事件，将命令和类型发送到外部
            const customEvent = new CustomEvent('ckeditor:buttonExecuted', {
                detail: {
                    command,
                    blockType: type,
                    id,
                    buttonName: selectedElement.name,
                },
                bubbles: true,
                cancelable: true,
            });
            // 获取编辑器DOM元素并分发事件
            const editorElement = editor.ui.view.element;
            if (editorElement) {
                editorElement.dispatchEvent(customEvent);
            }
        }
    }

    refresh() {
        const selection = this.editor.model.document.selection;
        const selectedElement = selection.getSelectedElement();
        this.isEnabled = Boolean(selectedElement && selectedElement.name === 'lockedBlock');
    }
} 