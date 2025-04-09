import { Plugin } from 'ckeditor5';
import { InsertLockedBlockCommand } from '../commands/insert-locked-block-command';
import { DeleteLockedBlockCommand } from '../commands/delete-locked-block-command';
import { EditLockedBlockCommand } from '../commands/edit-locked-block-command';

// 锁定块基础插件
export class LockedBlockBasePlugin extends Plugin {
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
            allowAttributes: ['class', 'type', 'id'],
        });

        // 定义命令
        editor.commands.add('insertLockedBlock', new InsertLockedBlockCommand(editor));
        editor.commands.add('deleteLockedBlock', new DeleteLockedBlockCommand(editor));
        editor.commands.add('editLockedBlock', new EditLockedBlockCommand(editor));

        // 为指定模型元素添加属性转换
        this._setupAttributeConversion(editor);

        // 添加转换规则（view层不可编辑）
        editor.conversion.for('downcast').elementToElement({
            model: 'lockedBlock',
            view: (modelElement, { writer }) => {
                // 获取属性
                const type = modelElement.getAttribute('type');
                const id = modelElement.getAttribute('id');
                const classAttr = modelElement.getAttribute('class');
                
                // 创建唯一标识，防止样式冲突
                const uniqueId = id || Date.now() + '-' + Math.floor(Math.random() * 10000);
                
                // 定义div的属性
                const attributes = {
                    class: 'locked-block' + (classAttr ? ` ${classAttr}` : '') + (type ? ` locked-block-${type}` : ''),
                    'contenteditable': 'false',
                    'data-locked': 'true',
                    'data-type': type || '',
                    'data-id': uniqueId
                };
                
                // 创建div元素
                const div = writer.createContainerElement('div', attributes);

                // 创建操作按钮容器
                const actionsDiv = writer.createContainerElement('div', {
                    class: 'block-actions',
                });

                // 创建编辑按钮
                const editButton = writer.createContainerElement('button', {
                    class: 'edit-btn',
                    'data-command': 'editLockedBlock',
                    'title': '编辑内容',
                });

                // 创建删除按钮
                const deleteButton = writer.createContainerElement('button', {
                    class: 'delete-btn',
                    'data-command': 'deleteLockedBlock',
                    'title': '删除区块',
                });

                // 将按钮添加到操作容器
                writer.insert(writer.createPositionAt(actionsDiv, 0), editButton);
                writer.insert(writer.createPositionAt(actionsDiv, 1), deleteButton);

                // 将操作容器添加到主div
                writer.insert(writer.createPositionAt(div, 0), actionsDiv);

                // 创建内容容器
                const contentDiv = writer.createContainerElement('div', {
                    class: 'locked-content',
                });

                // 将内容区域添加到主div
                writer.insert(writer.createPositionAt(div, 1), contentDiv);

                // 将模型中的文本转换为视图中的文本
                const textContent = Array.from(modelElement.getChildren())
                    .filter(node => node.is('$text'))
                    .map(node => node.data)
                    .join('');

                if (textContent) {
                    const text = writer.createText(textContent);
                    writer.insert(writer.createPositionAt(contentDiv, 0), text);
                }

                return div;
            },
        });

        // 添加上行转换规则（从视图到模型）
        editor.conversion.for('upcast').elementToElement({
            view: {
                name: 'div',
                classes: ['locked-block']
            },
            model: (viewElement, { writer }) => {
                // 从视图元素中提取属性
                const type = viewElement.getAttribute('data-type');
                const id = viewElement.getAttribute('data-id');
                const classes = viewElement.getAttribute('class');
                let blockClass = '';
                
                // 从class中提取除了locked-block以外的类名
                if (classes) {
                    blockClass = classes.split(' ')
                        .filter(cls => cls !== 'locked-block' && !cls.startsWith('locked-block-'))
                        .join(' ');
                }
                
                // 创建模型元素并设置属性
                const modelElement = writer.createElement('lockedBlock', {
                    type: type || '',
                    id: id || '',
                    class: blockClass
                });
                
                // 查找并转换内容
                const contentDiv = Array.from(viewElement.getChildren())
                    .find(child => {
                        if (!child.is('element')) return false;
                        const element = child as any;
                        return element.hasClass && element.hasClass('locked-content');
                    });
                
                if (contentDiv) {
                    // 获取内容区域中的所有文本
                    const contentElement = contentDiv as any;
                    const childNodes = Array.from(contentElement.getChildren());
                    
                    const textContent = childNodes
                        .filter((node: any) => node.is('$text'))
                        .map(node => (node as any).data)
                        .join('');
                    
                    if (textContent) {
                        writer.append(writer.createText(textContent), modelElement);
                    }
                } else {
                    // 直接从locked-block中找文本（向后兼容）
                    const textNodes = Array.from(viewElement.getChildren())
                        .filter(node => node.is('$text'));
                    
                    if (textNodes.length > 0) {
                        const text = textNodes.map(node => (node as any).data).join('');
                        writer.append(writer.createText(text), modelElement);
                    }
                }
                
                return modelElement;
            }
        });

        this._setupListeners();
    }

    _setupListeners() {
        const editor = this.editor;

        // 处理按钮点击事件
        editor.editing.view.document.on('click', (evt, data) => {
            const target = data.target;
            let buttonElement = null;

            // 查找最近的按钮元素
            let currentElement = target;
            while (currentElement) {
                if (currentElement.hasClass && (currentElement.hasClass('edit-btn') || currentElement.hasClass('delete-btn'))) {
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

    // 单独定义属性转换，避免类型错误
    _setupAttributeConversion(editor: any) {
        // 添加type属性转换
        editor.conversion.for('downcast').attributeToAttribute({
            model: {
                name: 'lockedBlock',
                key: 'type'
            },
            view: 'data-type'
        });

        // 添加id属性转换
        editor.conversion.for('downcast').attributeToAttribute({
            model: {
                name: 'lockedBlock',
                key: 'id'
            },
            view: 'data-id'
        });

        // 添加class属性转换
        editor.conversion.for('downcast').attributeToAttribute({
            model: {
                name: 'lockedBlock',
                key: 'class'
            },
            view: (value: string) => {
                return {
                    key: 'class',
                    value: value ? `locked-block ${value}` : 'locked-block'
                };
            }
        });
    }
} 