import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import { StepType } from '../../../types/enums';
import InteractionRender from '../../components/interaction-render';
import './index.scss'

function CourseLearning() {
    const transform = (node: any, index: number) => {
        if (node.type === 'tag' && node.name === 'div' && node.attribs['data-locked'] === 'true') {
            // 转换自定义解析题
            const dataId: string = node.attribs['data-id'];
            return <InteractionRender key={index} id={dataId} />;
        }
        return convertNodeToElement(node, index, transform);
    };

    const richText = ""

    return (
        <div className="istem-course-learning-box">
            <div className="learning-left-box">
                <p className='learning-left-title'>设计思维的五个步骤</p>
                <p className='learning-left-item'>{StepType.empathize}</p>
                <p className='learning-left-item'>{StepType.define}</p>
                <p className='learning-left-item'>{StepType.ideate}</p>
                <p className='learning-left-item'>{StepType.prototype}</p>
                <p className='learning-left-item'>{StepType.test}</p>
            </div>
            <div className="learning-center-box">
                <div className="learning-center-left">
                    {ReactHtmlParser(richText, { transform })}
                </div>
                <div className="learning-right-chat"></div>
            </div>
        </div>
    );
}

export default CourseLearning;