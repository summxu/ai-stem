import { useEffect, useMemo, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    Autoformat,
    AutoImage,
    Autosave,
    BlockQuote,
    Bold,
    ClassicEditor,
    EditorConfig,
    Essentials,
    EventInfo,
    FileLoader,
    Heading,
    Highlight,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Italic,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    Strikethrough,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Underline,
} from 'ckeditor5';

import translations from 'ckeditor5/translations/zh.js';
import './index.css';
import { UploadAdapter } from './upload-adapter.ts';

const LICENSE_KEY = 'GPL'; // or <YOUR_LICENSE_KEY>.

interface CKeditorProps {
    initialData: string;
    onChange: (data: EventInfo<string, unknown>, editor: ClassicEditor) => void;
}

function CKeditor({ initialData, onChange }: CKeditorProps) {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
    }, []);

    const { editorConfig } = useMemo(() => {
        if (!isLayoutReady) {
            return {};
        }
        return {
            editorConfig: {
                toolbar: {
                    items: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        '|',
                        'link',
                        'insertImage',
                        'mediaEmbed',
                        'insertTable',
                        'highlight',
                        'blockQuote',
                        'htmlEmbed',
                        '|',
                        'bulletedList',
                        'numberedList',
                    ],
                    shouldNotGroupWhenFull: false,
                },
                plugins: [
                    Autoformat,
                    AutoImage,
                    Autosave,
                    HtmlEmbed,
                    BlockQuote,
                    Bold,
                    Essentials,
                    Heading,
                    Highlight,
                    ImageBlock,
                    ImageCaption,
                    ImageInline,
                    ImageInsert,
                    ImageInsertViaUrl,
                    ImageResize,
                    ImageStyle,
                    ImageToolbar,
                    ImageUpload,
                    Italic,
                    Link,
                    List,
                    MediaEmbed,
                    Paragraph,
                    Strikethrough,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    TextTransformation,
                    Underline,
                ],
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph',
                        },
                        {
                            model: 'heading1',
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1',
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2',
                        },
                        {
                            model: 'heading3',
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3',
                        },
                        {
                            model: 'heading4',
                            view: 'h4',
                            title: 'Heading 4',
                            class: 'ck-heading_heading4',
                        },
                        {
                            model: 'heading5',
                            view: 'h5',
                            title: 'Heading 5',
                            class: 'ck-heading_heading5',
                        },
                        {
                            model: 'heading6',
                            view: 'h6',
                            title: 'Heading 6',
                            class: 'ck-heading_heading6',
                        },
                    ],
                },
                image: {
                    toolbar: [
                        'toggleImageCaption',
                        'imageTextAlternative',
                        '|',
                        'imageStyle:inline',
                        'imageStyle:wrapText',
                        'imageStyle:breakText',
                        '|',
                        'resizeImage',
                    ],
                },
                initialData: initialData,
                language: 'zh',
                licenseKey: LICENSE_KEY,
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    decorators: {
                        toggleDownloadable: {
                            mode: 'manual',
                            label: 'Downloadable',
                            attributes: {
                                download: 'file',
                            },
                        },
                    },
                },
                placeholder: 'Type or paste your content here!',
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
                },
                translations: [translations],
            },
        };
    }, [isLayoutReady]) as { editorConfig: EditorConfig };

    // 配置上传loader
    const handleReady = (editor: ClassicEditor) => {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader: FileLoader) => {
            return new UploadAdapter(loader);
        };
    };

    // 修改CKEditor组件渲染逻辑
    return (
        <div className="main-container">
            <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                <div className="editor-container__editor">
                    <div ref={editorRef}>{editorConfig &&
                      <CKEditor
                        onChange={onChange}
                        editor={ClassicEditor}
                        config={editorConfig}
                        onReady={handleReady}
                      />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CKeditor;
