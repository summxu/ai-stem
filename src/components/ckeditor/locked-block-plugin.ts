import { ButtonView, Plugin, Command } from 'ckeditor5';

// 定义命令
class InsertLockedBlockCommand extends Command {
    execute() {
        const editor = this.editor;
        
        editor.model.change(writer => {
            const block = writer.createElement('lockedBlock', { class: 'locked-block' });
            // 使用createText创建不可编辑的文本
            const text = writer.createText('不可编辑内容');
            writer.append(text, block);
            editor.model.insertContent(block);
        });
    }

    refresh() {
        this.isEnabled = true;
    }
}

// 删除锁定区块命令
class DeleteLockedBlockCommand extends Command {
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

// 编辑锁定区块命令
class EditLockedBlockCommand extends Command {
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

export class LockedBlockPlugin extends Plugin {
    init() {
        const editor = this.editor;

        // 注册模型元素
        editor.model.schema.register('lockedBlock', {
            allowWhere: '$block',
            isBlock: true,
            allowContentOf: '$text',
            isLimit: true, // 标记为限制性元素
            isObject: true, // 将锁定区块设置为对象，防止被其他功能影响
            isSelectable: true, // 可整体选择
        });

        // 限制编辑和删除
        editor.model.schema.addAttributeCheck((context) => {
            if (context.endsWith('lockedBlock')) {
                return false; // 阻止对锁定区块的属性修改
            }
        });

        // 定义命令
        editor.commands.add('insertLockedBlock', new InsertLockedBlockCommand(editor));
        editor.commands.add('deleteLockedBlock', new DeleteLockedBlockCommand(editor));
        editor.commands.add('editLockedBlock', new EditLockedBlockCommand(editor));

        // 创建按钮
        editor.ui.componentFactory.add('insertLockedBlock', locale => {
            const button = new ButtonView(locale);
            button.set({
                label: '插入锁定区块',
                icon: '',
                tooltip: true,
                isToggleable: false
            });
            button.on('execute', () => editor.execute('insertLockedBlock'));
            return button;
        });

        // 添加转换规则（view层不可编辑）
        editor.conversion.for('downcast').elementToElement({
            model: 'lockedBlock',
            view: (modelElement, { writer }) => {
                const div = writer.createContainerElement('div', {
                    class: 'locked-block',
                    'contenteditable': 'false',
                    'data-locked': 'true',
                });
                
                // 创建操作按钮容器
                const actionsDiv = writer.createContainerElement('div', {
                    class: 'block-actions'
                });
                
                // 创建编辑按钮
                const editButton = writer.createContainerElement('button', {
                    class: 'edit-btn',
                    'data-command': 'editLockedBlock',
                    'title': '编辑内容'
                });
                
                // 创建删除按钮
                const deleteButton = writer.createContainerElement('button', {
                    class: 'delete-btn',
                    'data-command': 'deleteLockedBlock',
                    'title': '删除区块'
                });
                
                // 将按钮添加到操作容器
                writer.insert(writer.createPositionAt(actionsDiv, 0), editButton);
                writer.insert(writer.createPositionAt(actionsDiv, 1), deleteButton);
                
                // 将操作容器添加到主div
                writer.insert(writer.createPositionAt(div, 0), actionsDiv);
                
                // 将模型中的文本转换为视图中的文本
                const firstChild = modelElement.getChild(0);
                if (firstChild && firstChild.is('$text')) {
                    const text = writer.createText(firstChild.data);
                    writer.insert(writer.createPositionAt(div, 1), text);
                }
                
                return div;
            },
        });

        // 转换规则 (upcast)
        editor.conversion.for('upcast').elementToElement({
            view: {
                name: 'div',
                classes: 'locked-block'
            },
            model: 'lockedBlock'
        });

        // 处理按钮点击事件
        editor.editing.view.document.on('click', (evt, data) => {
            const target = data.target;
            let buttonElement = null;
            
            // 查找最近的按钮元素
            let currentElement = target;
            while (currentElement) {
                if (currentElement.hasClass('edit-btn') || currentElement.hasClass('delete-btn')) {
                    buttonElement = currentElement;
                    break;
                }
                currentElement = currentElement.parent;
            }
            
            if (buttonElement) {
                const command = buttonElement.getAttribute('data-command');
                if (command) {
                    // 找到对应的锁定区块
                    let blockElement = buttonElement.parent;
                    while (blockElement && !blockElement.hasClass('locked-block')) {
                        blockElement = blockElement.parent;
                    }
                    
                    if (blockElement) {
                        // 选择整个锁定区块
                        editor.model.change(writer => {
                            const modelElement = editor.editing.mapper.toModelElement(blockElement);
                            if (modelElement) {
                                const range = writer.createRangeOn(modelElement);
                                writer.setSelection(range);
                            }
                        });
                        
                        // 执行命令
                        editor.execute(command);
                        evt.stop();
                    }
                }
            }
        }, { priority: 'highest' });

        // 阻止对锁定区块的各种编辑操作
        editor.editing.view.document.on('keydown', (evt) => {
            const selection = editor.model.document.selection;
            const selectedElement = selection.getSelectedElement();
            
            if (selectedElement && selectedElement.name === 'lockedBlock') {
                evt.stop();
            }
        }, { priority: 'highest' });

        // 阻止剪切和复制锁定区块内容
        editor.editing.view.document.on('clipboardInput', (evt) => {
            const selection = editor.model.document.selection;
            const selectedElement = selection.getSelectedElement();
            
            if (selectedElement && selectedElement.name === 'lockedBlock') {
                evt.stop();
            }
        }, { priority: 'highest' });

        // 阻止拖动锁定区块
        editor.editing.view.document.on('dragstart', (evt, data) => {
            let targetElement = data.target;
            
            while (targetElement) {
                if ((targetElement.hasClass && targetElement.hasClass('locked-block')) || 
                    (targetElement.getAttribute && targetElement.getAttribute('data-locked') === 'true')) {
                    evt.stop();
                    break;
                }
                targetElement = targetElement.parent;
            }
        }, { priority: 'highest' });
    }
}