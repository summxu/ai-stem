import { Command } from 'ckeditor5';
import { databases } from '../../../utils/appwrite.ts';
import { CollectionName, DatabaseName } from '../../../../types/enums.ts';
import { message } from 'antd';

export class DeleteLockedBlockCommand extends Command {
    async execute() {
        const editor = this.editor;
        const selection = editor.model.document.selection;
        const selectedElement = selection.getSelectedElement();

        if (selectedElement && selectedElement.name === 'lockedBlock') {
            try {
                const id = selectedElement.getAttribute('id') as string;
                await databases.deleteDocument(DatabaseName.ai_stem, CollectionName.interaction, id);
                editor.model.change(writer => {
                    // 获取锁定区块的位置
                    const position = writer.createPositionBefore(selectedElement);
                    // 删除锁定区块
                    writer.remove(selectedElement);
                    // 将光标移动到删除后的位置
                    writer.setSelection(position);
                });
            } catch (e) {
                message.error((e as Error).message);
            }
        }
    }

    refresh() {
        const selection = this.editor.model.document.selection;
        const selectedElement = selection.getSelectedElement();
        this.isEnabled = Boolean(selectedElement && selectedElement.name === 'lockedBlock');
    }
}