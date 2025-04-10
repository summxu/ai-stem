import CKeditor from '../../components/ckeditor';
import { ClassicEditor } from 'ckeditor5';
import { useState } from 'react';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import { InteractionType } from '../../../types/db.ts';

function CourseAdmin() {
    const [richText, setRichText] = useState('');
    const handleChange = (_: any, editor: ClassicEditor) => {
        setRichText(editor.data.get());
    };

    const transform = (node: any, index: number) => {
        if (node.type === 'tag' && node.name === 'div' && node.attribs['data-locked'] === 'true') {
            // 转换自定义解析题
            const dataType: InteractionType = node.attribs['data-type'];
            const dataId: string = node.attribs['data-id'];
            if (dataType === 'choice') {
                return <div key={index}>
                    <div>解析题</div>
                    <div>题目ID：{dataId}</div>
                    <div>题目类型：{dataType}</div>
                </div>;
            }
        }
        return convertNodeToElement(node, index, transform);
    };

    return (
        <div className="course-admin">
            <CKeditor onChange={handleChange} initialData={'<p>Hello World!</p>'} />
            <br />
            {ReactHtmlParser(richText, { transform })}
        </div>
    );
}

export default CourseAdmin;