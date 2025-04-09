import CKeditor from '../../components/ckeditor';
import { ClassicEditor } from 'ckeditor5';

function CourseAdmin() {
    const handleChange = (_: any, editor: ClassicEditor) => {
        console.log(editor.data.get());
    };
    return (
        <CKeditor onChange={handleChange} initialData={'<p>Hello World!</p>'} />
    );
}

export default CourseAdmin;