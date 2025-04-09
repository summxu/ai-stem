import { Command } from 'ckeditor5';

export class EditLockedBlockCommand extends Command {
    execute() {
        const editor = this.editor;
        const selection = editor.model.document.selection;
        const selectedElement = selection.getSelectedElement();

        if (selectedElement && selectedElement.name === 'lockedBlock') {
            const firstChild = selectedElement.getChild(0);
            if (firstChild && firstChild.is('$text')) {
                const currentText = firstChild.data;
                const newText = window.prompt('编辑锁定区块内容:', currentText);
                
                if (newText !== null) {
                    editor.model.change(writer => {
                        writer.remove(firstChild);
                        writer.appendText(newText, selectedElement);
                    });
                }
            }
        }
    }

    refresh() {
        const selection = this.editor.model.document.selection;
        const selectedElement = selection.getSelectedElement();
        this.isEnabled = Boolean(selectedElement && selectedElement.name === 'lockedBlock');
    }
} 