import { StepType } from '../../../types/enums';
import './index.scss'

function CourseLearning() {
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
                </div>
                <div className="learning-right-chat"></div>
            </div>
        </div>
    );
}

export default CourseLearning;