import './index.scss';
import { useNavigate } from 'react-router';

function CoursePreview() {
    const navigate = useNavigate();
    return (
        <div className="istem-course-preview-box">
            {/* 顶部区域 */}
            <div className="course-header flex-col">
                <div className="banner-container flex-col">
                    {/* 操作按钮区域 */}
                    <div className="action-buttons flex-row justify-between">
                        <div className="edit-button flex-row align-center">
                            <span>修改</span>
                            <img
                                src={
                                    'https://lanhu-oss.lanhuapp.com/SketchPng37287cf95f9c4c3ff74f1775bd183ab85b0506bb10ef5e0daa7433a9a84dbee0'
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
                                    'https://lanhu-oss.lanhuapp.com/SketchPng35f5a321ca03b58056e019b423beeed0db4060941c0c3c192538f9ddc65d0e57'
                                }
                                alt="添加图标"
                            />
                        </div>
                    </div>

                    {/* 标题区域 */}
                    <div className="title-container flex-row justify-center">
                        <div className="title-wrapper">
                            <span className="title-ai">AI-STEM</span>
                            <span className="title-course">课程</span>
                        </div>
                    </div>

                    {/* STEM图标区域 */}
                    <div className="stem-icons flex-row justify-center align-center">
                        <img
                            className="icon-left"
                            src={
                                'https://lanhu-oss.lanhuapp.com/SketchPngc86fdc64218d7aeb5f870708f833eb0fa6d1ae84611a79cba2a2c480cb4b4df2'
                            }
                            alt="STEM图标"
                        />
                        <div className="icons-middle flex-row">
                            <img
                                src={
                                    'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/5612642c77374cb485d9d50914b7ac26_mergeImage.png'
                                }
                                alt="S图标"
                            />
                            <img
                                src={
                                    'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/55d6dd40f3f64da0bd347458a322df0f_mergeImage.png'
                                }
                                alt="T图标"
                            />
                            <img
                                src={
                                    'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/be28215276424d5ea93e3bbdc32e7b57_mergeImage.png'
                                }
                                alt="E图标"
                            />
                            <img
                                src={
                                    'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/913760b73e3c4268b7bd61e711a35db9_mergeImage.png'
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
                <div className="subject-card science-card">
                    <div className="card-content flex-col">
                        <img
                            className="card-image"
                            src={
                                'https://lanhu-oss.lanhuapp.com/SketchPng39b9b32f0d7b37ee9ff91777a9fdd9f98167c52294e827c4575130ed427f9ca1'
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
                <div className="subject-card technology-card">
                    <div className="card-content flex-col">
                        <img
                            className="card-image"
                            src={
                                'https://lanhu-oss.lanhuapp.com/SketchPng73adbfd5212087e5aec45195ec66e76b6e4cc66ad91aa29aa62e4209353aed49'
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
                <div className="subject-card engineering-card">
                    <div className="card-content flex-col">
                        <img
                            className="card-image"
                            src={
                                'https://lanhu-oss.lanhuapp.com/SketchPngc045dbb430cbbb9e7cede59069e33eb1e20c955b2e7870cf8ea372085d23f7cb'
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
                <div className="subject-card math-card">
                    <div className="card-content flex-col">
                        <img
                            className="card-image"
                            src={
                                'https://lanhu-oss.lanhuapp.com/SketchPngfdcb5ecbebeaf026c781f7f77a4056a517d8f9d275793ad081d198003e1c2175'
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
        </div>
    );
}

export default CoursePreview;