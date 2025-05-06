import { message } from 'antd';
import { useUser } from '../../hooks/user';
import './index.scss';
import { useNavigate } from 'react-router';

function CoursePreview() {
    const navigate = useNavigate();
    const { userInfo } = useUser();
    return (
        <div className="istem-course-preview-box">
            {/* 顶部区域 */}
            <div className="course-header flex-col">
                <div className="banner-container flex-col">
                    {/* 操作按钮区域 */}
                    <div className="action-buttons flex-row justify-between">
                        {/* <div className="edit-button flex-row align-center">
                            <span>修改</span>
                            <img
                                src={
                                    '../../assets/images/5c08eba371591f00b3d417737a03001b.png'
                                }
                                alt="编辑图标"
                            />
                        </div>
                        <div onClick={() => {
                            navigate('/course-preview/active-admin');
                        }} className="add-button flex-row align-center">
                            <span>添加课程</span>
                            <img
                                src={
                                    '../../assets/images/18210ec7d59fed7d48074693ec2a7abd.png'
                                }
                                alt="添加图标"
                            />
                        </div> */}
                        {userInfo?.labels.includes('admin') && <div onClick={() => {
                            navigate('/course-preview/active-admin');
                        }} className="add-button flex-row align-center">
                            <span>管理课程</span>
                            <img
                                src={
                                    '../../assets/images/18210ec7d59fed7d48074693ec2a7abd.png'
                                }
                                alt="添加图标"
                            />
                        </div>}
                    </div>

                    {/* 标题区域 */}
                    <div className="title-container flex-row justify-center">
                        <div className="title-wrapper">
                            <span className="title-ai">i-STEM</span>
                            <span className="title-course">课程</span>
                        </div>
                    </div>

                    {/* STEM图标区域 */}
                    <div className="stem-icons flex-row justify-center align-center">
                        <img
                            className="icon-left"
                            src={
                                '../../assets/images/a2fe4037e642edd0b39d2e3f33d86a75.png'
                            }
                            alt="STEM图标"
                        />
                        <div className="icons-middle flex-row">
                            <img
                                src={
                                    '../../assets/images/1889a996c67d7a946187cbbd85de3c6b.png'
                                }
                                alt="S图标"
                            />
                            <img
                                src={
                                    '../../assets/images/c1b4aa1165c9ae212d97a265f5da5c46.png'
                                }
                                alt="T图标"
                            />
                            <img
                                src={
                                    '../../assets/images/56dcd260ef2b0b7085847ce7ab7bebf8.png'
                                }
                                alt="E图标"
                            />
                            <img
                                style={{ width: 160 }}
                                src={
                                    '../../assets/images/3f837e2a86f951683f81321844103b25.png'
                                }
                                alt="M图标"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 学科卡片区域 */}
            <div className="subject-cards flex-row justify-center">
                {/* 科学卡片 */}
                <div onClick={() => navigate('/course-preview/course-list')} className="subject-card science-card">
                    <div className="card-content flex-col">
                        <img
                            className="card-image"
                            src={
                                '../../assets/images/a8b6479420972c4630813d8297f350ba.png'
                            }
                            alt="科学图标"
                        />
                        <div className="card-text flex-col">
                            <span className="card-title">科学</span>
                            <span className="card-description">
                                通过实验和观察来探索自然现象，培养学生的科学思维、探究能力和批判性思维。
                            </span>
                        </div>
                    </div>
                </div>

                {/* 技术卡片 */}
                <div onClick={() => message.info('课程暂未开通，敬请期待！')} className="subject-card technology-card">
                    <div className="card-content flex-col">
                        <img
                            className="card-image"
                            src={
                                '../../assets/images/54c93e4ab957c5cc240ae35a8410b2f4.png'
                            }
                            alt="技术图标"
                        />
                        <div className="card-text flex-col">
                            <span className="card-title">技术</span>
                            <span className="card-description">
                                应用科学知识来创造工具、设备和系统，以解决实际问题并提高生活质量。
                            </span>
                        </div>
                    </div>
                </div>

                {/* 工程卡片 */}
                <div onClick={() => message.info('课程暂未开通，敬请期待！')} className="subject-card engineering-card">
                    <div className="card-content flex-col">
                        <img
                            className="card-image"
                            src={
                                '../../assets/images/40618f7deb5cdaf1fa3d4b1647a0bea1.png'
                            }
                            alt="工程图标"
                        />
                        <div className="card-text flex-col">
                            <span className="card-title">工程</span>
                            <span className="card-description">
                                设计、建造和测试结构、机器和系统的过程，旨在解决复杂问题并优化资源利用。
                            </span>
                        </div>
                    </div>
                </div>

                {/* 数学卡片 */}
                <div onClick={() => message.info('课程暂未开通，敬请期待！')} className="subject-card math-card">
                    <div className="card-content flex-col">
                        <img
                            className="card-image"
                            src={
                                '../../assets/images/1a9d0f3e05008a1822c09facdd429c3b.png'
                            }
                            alt="数学图标"
                        />
                        <div className="card-text flex-col">
                            <span className="card-title">数学</span>
                            <span className="card-description">
                                提供了解决问题所需的逻辑基础和分析工具，支持其他学科的学习和发展。
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default CoursePreview;