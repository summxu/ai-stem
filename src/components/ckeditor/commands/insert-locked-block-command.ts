import { Command } from 'ckeditor5';
import { InteractionTypeName } from '../../../../types/enums.ts';
import { InteractionType } from '../../../../types/db.ts';

export class InsertLockedBlockCommand extends Command {
    execute(type: InteractionType, id: string, title: string) {
        const editor = this.editor;

        editor.model.change(writer => {
            // 创建元素（不包含初始属性）
            const block = writer.createElement('lockedBlock');

            // 设置属性
            writer.setAttribute('class', 'locked-block', block);
            writer.setAttribute('type', type || 'default', block);
            writer.setAttribute('id', id, block);

            // 添加文本内容
            const text = writer.createText(`${InteractionTypeName[type]}：${title}`);
            writer.append(text, block);

            // 创建空段落
            const emptyParagraphBefore = writer.createElement('paragraph');
            const emptyParagraphAfter = writer.createElement('paragraph');

            // 创建文档片段，包含空段落和锁定区块
            const documentFragment = writer.createDocumentFragment();
            writer.append(emptyParagraphBefore, documentFragment);
            writer.append(block, documentFragment);
            writer.append(emptyParagraphAfter, documentFragment);

            // 插入到编辑器
            editor.model.insertContent(documentFragment);
        });

        // 使用最简单的方法：延迟执行后，创建新的选区
        setTimeout(() => {
            // 使用编辑器API直接创建一个新的段落并将焦点放在那里
            // 尝试插入一个空格并选中它（这样将使光标移到内容末尾）
            editor.execute('input', { text: ' ' });
            // 然后删除空格
            editor.execute('delete');
        }, 100);
    }

    refresh() {
        this.isEnabled = true;
    }
} 