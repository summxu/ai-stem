import './index.scss';

function CoursePreview() {
    return (
        <div className="istem-course-preview-box">
            <div className="group_2 flex-col">
                <div className="group_4 flex-col">
                    <div className="group_5 flex-col">
                        <div className="group_6 flex-row justify-between">
                            <div className="box_1 flex-row">
                                <span className="text_5">修改</span>
                                <img
                                    className="thumbnail_5"
                                    src={
                                        'https://lanhu-oss.lanhuapp.com/SketchPng37287cf95f9c4c3ff74f1775bd183ab85b0506bb10ef5e0daa7433a9a84dbee0'
                                    }
                                />
                            </div>
                            <div className="box_2 flex-row">
                                <span className="text_6">添加课程</span>
                                <img
                                    className="thumbnail_6"
                                    src={
                                        'https://lanhu-oss.lanhuapp.com/SketchPng35f5a321ca03b58056e019b423beeed0db4060941c0c3c192538f9ddc65d0e57'
                                    }
                                />
                            </div>
                        </div>
                        <div className="group_7 flex-row">
                            <div className="text-wrapper_2">
                                <span className="text_7">AI-STEM</span>
                                <span className="text_8">课程</span>
                            </div>
                        </div>
                        <div className="group_8 flex-row">
                            <img
                                className="image_1"
                                src={
                                    'https://lanhu-oss.lanhuapp.com/SketchPngc86fdc64218d7aeb5f870708f833eb0fa6d1ae84611a79cba2a2c480cb4b4df2'
                                }
                            />
                            <div className="image-wrapper_1 flex-row">
                                <img
                                    className="image_2-0"
                                    src={
                                        'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/5612642c77374cb485d9d50914b7ac26_mergeImage.png'
                                    }
                                />
                                <img
                                    className="image_2-1"
                                    src={
                                        'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/55d6dd40f3f64da0bd347458a322df0f_mergeImage.png'
                                    }
                                />
                                <img
                                    className="image_2-2"
                                    src={
                                        'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/be28215276424d5ea93e3bbdc32e7b57_mergeImage.png'
                                    }
                                />
                            </div>
                            <img
                                className="image_3"
                                src={
                                    'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/913760b73e3c4268b7bd61e711a35db9_mergeImage.png'
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="group_9 flex-row">
                    <div className="image-text_1 flex-col justify-between">
                        <img
                            className="image_4"
                            src={
                                'https://lanhu-oss.lanhuapp.com/SketchPng39b9b32f0d7b37ee9ff91777a9fdd9f98167c52294e827c4575130ed427f9ca1'
                            }
                        />
                        <div className="text-group_1 flex-col justify-between">
                            <span className="text_9">科学</span>
                            <span className="text_10">
                    通过实验和观察来探索自然现象，培养学生的科学思维、探究能力和批判性思维。
                  </span>
                        </div>
                    </div>
                </div>
                <div className="group_10 flex-row">
                    <div className="image-text_2 flex-col justify-between">
                        <img
                            className="image_5"
                            src={
                                'https://lanhu-oss.lanhuapp.com/SketchPngc045dbb430cbbb9e7cede59069e33eb1e20c955b2e7870cf8ea372085d23f7cb'
                            }
                        />
                        <div className="text-group_2 flex-col justify-between">
                            <span className="text_11">工程</span>
                            <span className="text_12">
                    设计、建造和测试结构、机器和系统的过程，旨在解决复杂问题并优化资源利用。
                  </span>
                        </div>
                    </div>
                </div>
                <div className="group_11 flex-row">
                    <div className="image-text_3 flex-col justify-between">
                        <img
                            className="image_6"
                            src={
                                'https://lanhu-oss.lanhuapp.com/SketchPngfdcb5ecbebeaf026c781f7f77a4056a517d8f9d275793ad081d198003e1c2175'
                            }
                        />
                        <div className="text-group_3 flex-col justify-between">
                            <span className="text_13">数学</span>
                            <span
                                className="text_14">提供了解决问题所需的逻辑基础和分析工具，支持其他学科的学习和发展。</span>
                        </div>
                    </div>
                </div>
                <div className="group_12 flex-row">
                    <div className="image-text_4 flex-col justify-between">
                        <img
                            className="image_7"
                            src={
                                'https://lanhu-oss.lanhuapp.com/SketchPng73adbfd5212087e5aec45195ec66e76b6e4cc66ad91aa29aa62e4209353aed49'
                            }
                        />
                        <div className="text-group_4 flex-col justify-between">
                            <span className="text_15">技术</span>
                            <span
                                className="text_16">应用科学知识来创造工具、设备和系统，以解决实际问题并提高生活质量。</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoursePreview;