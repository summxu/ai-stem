import { ClassicEditor } from 'ckeditor5';
import { useState } from 'react';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import CKeditor from '../../components/ckeditor';
import InteractionRender from '../../components/interaction-render/index.tsx';

function CourseAdmin() {
    const [richText, setRichText] = useState(`<p>&nbsp;</p><div class="locked-block locked-block-choice" contenteditable="false" data-locked="true" data-type="choice" data-id="67f778d6003e6f17e9ec">选择题：同学们，你认为哪些生活中的常见现象与空气的魔法相关呢？<div class="block-actions"><button class="edit-btn" data-command="editLockedBlock" title="编辑内容">&nbsp;</button><button class="delete-btn" data-command="deleteLockedBlock" title="删除区块">&nbsp;</button></div></div><p>&nbsp;</p><p>Hello World!222</p>`);
    const handleChange = (_: any, editor: ClassicEditor) => {
        setRichText(editor.data.get());
        console.log(editor.data.get());
    };

    const transform = (node: any, index: number) => {
        if (node.type === 'tag' && node.name === 'div' && node.attribs['data-locked'] === 'true') {
            // 转换自定义解析题
            const dataId: string = node.attribs['data-id'];
            return <InteractionRender key={index} id={dataId} />;
        }
        return convertNodeToElement(node, index, transform);
    };

    return (
        <div className="course-admin">
            <CKeditor onChange={handleChange} initialData={richText} />
            <br />
            {ReactHtmlParser(richText, { transform })}
        </div>
    );
}

export default CourseAdmin;