import { Command } from 'ckeditor5';
import { Interaction } from '../../../../types/db.ts';
import { InteractionTypeName } from '../../../../types/enums.ts';

export class UpdateLockedBlockCommand extends Command {
    async execute(interactionData: Interaction) {
        const editor = this.editor;
        const selection = editor.model.document.selection;
        const selectedElement = selection.getSelectedElement();
        const { type, title } = interactionData;
        if (selectedElement && selectedElement.name === 'lockedBlock') {
            // 获取模型写入器
            editor.model.change(writer => {
                // 获取第一个子节点
                const firstChild = selectedElement.getChild(0)!;
                // 删除原有内容
                writer.remove(firstChild);
                // 创建新文本节点并插入
                const text = writer.createText(`${InteractionTypeName[type]}：${title}`);
                writer.insert(text, selectedElement, 0);
                return writer;
            });
        }
    }

    refresh() {
        const selection = this.editor.model.document.selection;
        const selectedElement = selection.getSelectedElement();
        this.isEnabled = Boolean(selectedElement && selectedElement.name === 'lockedBlock');
    }
} 