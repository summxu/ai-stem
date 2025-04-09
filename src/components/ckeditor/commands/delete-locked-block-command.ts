import { Command } from 'ckeditor5';

export class DeleteLockedBlockCommand extends Command {
    execute() {
        const editor = this.editor;
        const selection = editor.model.document.selection;
        const selectedElement = selection.getSelectedElement();

        if (selectedElement && selectedElement.name === 'lockedBlock') {
            editor.model.change(writer => {
                // 获取锁定区块的位置
                const position = writer.createPositionBefore(selectedElement);
                // 删除锁定区块
                writer.remove(selectedElement);
                // 将光标移动到删除后的位置
                writer.setSelection(position);
            });
        }
    }

    refresh() {
        const selection = this.editor.model.document.selection;
        const selectedElement = selection.getSelectedElement();
        this.isEnabled = Boolean(selectedElement && selectedElement.name === 'lockedBlock');
    }
} 