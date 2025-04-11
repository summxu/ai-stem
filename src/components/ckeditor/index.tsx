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
import { useEffect, useMemo, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import translations from 'ckeditor5/translations/zh.js';
import './index.css';
import { UploadAdapter } from './upload-adapter.ts';
import {
    LockedBlockBasePlugin,
    ChecksBlockPlugin,
    FileBlockPlugin,
    FlowBlockPlugin,
    GapFillingBlockPlugin,
} from './plugins';
import InteractionModal from '../interaction-modal';
import { Interaction, InteractionType } from '../../../types/db.ts';

const LICENSE_KEY = 'GPL'; // or <YOUR_LICENSE_KEY>.

interface CKeditorProps {
    initialData: string;
    onChange: (data: EventInfo<string, unknown>, editor: ClassicEditor) => void;
    onButtonExecuted?: (event: { command: string; blockType?: string; buttonName: string }) => void;
}

function CKeditor({ initialData, onChange }: CKeditorProps) {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<ClassicEditor | null>(null);
    const [eventParams, setEventParams] = useState({
        command: '',
        blockType: 'choice' as InteractionType,
        id: '',
    });
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
    }, []);

    useEffect(() => {
        const handleButtonExecuted = (event: Event) => {
            if (event instanceof CustomEvent) {
                setIsModalOpen(true);
                setEventParams(event.detail);
            }
        };

        const editorElement = editorContainerRef.current;
        if (editorElement) {
            editorElement.addEventListener('ckeditor:buttonExecuted', handleButtonExecuted);
        }

        return () => {
            if (editorElement) {
                editorElement.removeEventListener('ckeditor:buttonExecuted', handleButtonExecuted);
            }
        };
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
                        '|',
                        'insertChecksBlock',
                        'insertFileBlock',
                        'insertFlowBlock',
                        'insertGapFillingBlock',
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
                    LockedBlockBasePlugin,
                    ChecksBlockPlugin,
                    FileBlockPlugin,
                    FlowBlockPlugin,
                    GapFillingBlockPlugin,
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
    }, [isLayoutReady, initialData]) as { editorConfig: EditorConfig };

    const handleReady = (editor: ClassicEditor) => {
        editorRef.current = editor;

        editor.plugins.get('FileRepository').createUploadAdapter = (loader: FileLoader) => {
            return new UploadAdapter(loader);
        };
    };

    const handleModalOk = (interactionData: Interaction, type: 'insert' | 'update') => {
        if (type === 'insert') {
            editorRef.current?.execute(eventParams.command, eventParams.blockType, interactionData.$id, interactionData.title);
        } else {
            editorRef.current?.execute('uploadLockedBlock', interactionData);
        }

        setIsModalOpen(false);
    };

    return (
        <div className="main-container">
            <InteractionModal
                id={eventParams.id}
                type={eventParams.blockType}
                open={isModalOpen}
                onSuccess={handleModalOk}
                onCancel={() => setIsModalOpen(false)}
            />
            <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                <div className="editor-container__editor">
                    <div>
                        {editorConfig && (
                            <CKEditor onChange={onChange} editor={ClassicEditor} config={editorConfig}
                                      onReady={handleReady} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CKeditor;
