import './index.scss';

function Home() {
    return (
        <div className="istem-home-box">
            <div className="box_3 flex-row">
                <div className="left-content flex-col ">
                    <div className="icon-container flex-row">
                        {[
                            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng38bfaab46ef266215435154939bcc4954ea33140615d170c21d9d50b6462a45f',
                            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPnge3c2630441884399a4ca08f7393e9644114a7d8caa4abbd300ad19a70293fff7',
                            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng3e63f9722194c47ddab53d191f51afbd4388c7a3763d156d22c1e4cd68cebd50',
                            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng4b849f1dfc2d388bceafbea3244efee33bc9027bc6b2cc080fa339015b7e08ca',
                        ].map((src, index) => (
                            <img
                                key={index}
                                className={`icon-image icon-${index + 1}`}
                                src={src}
                                alt={`STEM icon ${index + 1}`}
                            />
                        ))}
                    </div>
                    <h2 className="platform-title">面向小学生的AI辅助STEM学习平台</h2>
                </div>
                <div className="right-content flex-row">
                    <div className="orange-bar" />
                    <div className="course-card flex-col">
                        <div className="card-header flex-row align-center">
                            <img
                                className="course-icon"
                                src="https://lanhu-oss-2537-2.lanhuapp.com/SketchPng9035c16f67a81de08001031f8aacd9f84f0fc2cd7c0b53d74ed86db4213f34e7"
                                alt="Course icon"
                            />
                            <span className="header-text">新的课程</span>
                        </div>
                        <div className="card-content flex-row justify-between">
                            <div className="bullet-points flex-col justify-between">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="bullet-point" />
                                ))}
                            </div>
                            <div className="content-text">
                                Impact of an adaptime dialog to default students' ideas and guide knowl-
                                <br />
                                New Feature Uint Tags
                                <br />
                                Technology Update April 17.2024
                            </div>
                        </div>
                        <div className="card-footer">
                            <span className="view-more">查看更多</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section_12_box">

                <div className="section_12 flex-row">
                    <div className="box_16 flex-col" />
                    <div className="image-text_7 flex-row justify-between">
                        <div className="group_12 flex-col" />
                        <span className="text-group_1">系统简介</span>
                    </div>
                    <img
                        className="label_10"
                        src={
                            'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng49d9f79d747221f0730f71f02b94b8d083838de53c95205a46b8b024cd6ab4eb'
                        }
                    />
                </div>
                <div className="box_5 flex-row">
                    <div className="box_6 flex-col" />
                    <div className="block_10 flex-col justify-between">
                <span className="text_14">
                  本研究旨在开发一款&nbsp;i-STEM&nbsp;智能辅导系统,该系统致力于通过&nbsp;A1与个性化的学习体验来提升学生的问题解决能力。我们结合了设计思维方法与人工智能技术，为小学阶段的学生提供了一个独特且高效的&nbsp;STEM&nbsp;学习平台。
                </span>
                        <div className="section_7 flex-row align-center justify-center">
                            <div className="image-text_8 flex-row justify-between">
                                <span className="text-group_2">了解更多</span>
                                <img
                                    className="thumbnail_3"
                                    src={
                                        'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng2f778b48edfea95a1cfe0b95aeda5941cc22ab7c0e61b78e66448eff9968c618'
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="section_13">
                    <div className="section_12 flex-row">
                        <div className="box_16 flex-col" />
                        <div className="image-text_7 flex-row justify-between">
                            <div className="group_12 flex-col" />
                            <span className="text-group_1">主要功能</span>
                        </div>
                        <img
                            className="label_10"
                            src={
                                'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng49d9f79d747221f0730f71f02b94b8d083838de53c95205a46b8b024cd6ab4eb'
                            }
                        />
                    </div>
                    <div className="list_2 flex-row">
                        <div className="image-text_4-0 flex-col">
                            <div className="group_4-0 flex-col" />
                            <div className="text-group_7-0 flex-col justify-between">
                                <span className="text_15-0">个性化学习资源</span>
                                <span className="text_16-0">
                    利用&nbsp;AI&nbsp;技术，系统能够根据每位学生的不同学习偏好和风格，提供多样化的学习材料，包括文本、图片和视频等
                    <br />
                  </span>
                            </div>
                        </div>
                        <div className="image-text_4-1 flex-col">
                            <div className="group_4-1 flex-col" />
                            <div className="text-group_7-1 flex-col justify-between">
                                <span className="text_15-1">动态适应性内容</span>
                                <span className="text_16-1">
                    导师能够根据学生的学习表现、参与度和支持需求，动态调整学习内容，并推荐最适合的学习资料。
                    <br />
                  </span>
                            </div>
                        </div>
                        <div className="image-text_4-2 flex-col">
                            <div className="group_4-2 flex-col" />
                            <div className="text-group_7-2 flex-col justify-between">
                                <span className="text_15-2">设计思维融入</span>
                                <span className="text_16-2">
                    本项目的一大创新点在于将设计思维的五个核心步骤-共情、定义创意、原型制作和测试-融入到系统的开发过程中，以确保系统不仅高效而且具有高度的用户友好性。
                    <br />
                  </span>
                            </div>
                        </div>
                        <div className="image-text_4-3 flex-col">
                            <div className="group_4-3 flex-col" />
                            <div className="text-group_7-3 flex-col justify-between">
                                <span className="text_15-3">互动式问题解决练习</span>
                                <span className="text_16-3">
                    学生将获得量身定制的问题解决练习，以及对其进情况的注细反馈，这有助干提高他们的参与度和技能发展。
                  </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <div className="box_10 flex-col">
                <div className="box_10_bg_masker"></div>
                <div className="box_10_inner flex-col">
                    <div className="section_14 flex-row justify-between">
                        <div className="image-text_10 flex-row justify-between">
                            <img
                                className="label_6"
                                src={
                                    'https://lanhu-oss-2537-2.lanhuapp.com/SketchPnge38198944e505058469925c297d8cafba446a89410716b9a3a7e906ef8ef8eee'
                                }
                            />
                            <span className="text-group_5">应用理论</span>
                        </div>
                        <img
                            className="label_7"
                            src={
                                'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng118b3c38b18c856a6ca99e381afbc5634bd853dec731a97955a7b9568c2b3ffc'
                            }
                        />
                    </div>
                    <span className="paragraph_2">
                本系统基于最新的教育技术和心理学理论构建，特别关注于改善小学生的科学知识、方法及高级认知技能。通过将A驱动的个性化学习与设计思维框架结合，我们力求创造一个既新颖又有效的&nbsp;STEM&nbsp;学习环境，激发孩子们对科学、技术、工程和数学的兴趣，培养他们成为未来社会的创新者和领导者。
                <br />
                感谢您的访问，如果您有任何疑问或建议，欢迎随时联系我们!
              </span>
                </div>
            </div>


        </div>
    );
}

export default Home;