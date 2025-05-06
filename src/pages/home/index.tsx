import { useEffect, useState } from 'react';
import './index.scss';
import { databases } from '../../utils/appwrite';
import { Course } from '../../../types/db';
import { CollectionName, DatabaseName } from '../../../types/enums';
import { Query } from 'appwrite';
import { useNavigate } from 'react-router';

function Home() {
    const [course, setCourse] = useState<Course[]>([])
    const navigate = useNavigate()
    useEffect(() => {
        const getData = async () => {
            const { documents } = await databases.listDocuments<Course>(
                DatabaseName.ai_stem,
                CollectionName.course,
                [
                    Query.orderDesc('$createdAt'),
                    Query.limit(3),
                    Query.offset(0)
                ]
            );
            setCourse(documents);
        }
        getData();
    }, [])
    return (
        <div className="istem-home-box">
            <div className="box_3 flex-row">
                <div className="left-content flex-col ">
                    <div className="icon-container flex-row">
                        {[
                            '../../assets/images/4e019138b457a2a68131a880b77b60de.png',
                            '../../assets/images/385e44a2fbf23a2b0a8368f56094f2ce.png',
                            '../../assets/images/cb360ad69e4ac3c828af04cb749261ed.png',
                            '../../assets/images/157886ccdce7676aa694046e3150f520.png',
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
                                src="../../assets/images/3d26b9c4313810b3fd9e74706e948585.png"
                                alt="Course icon"
                            />
                            <span className="header-text">新的课程</span>
                        </div>
                        <div className="card-content flex-row justify-between">
                            <div className="bullet-points flex-col justify-between">
                                {course.map((item) => (
                                    <div className='flex-row'>
                                        <div key={item.$id} className="bullet-point" ></div>
                                        <span className='bullet-text'>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card-footer">
                            <span onClick={() => navigate('/course-preview/course-list')} className="view-more">查看更多</span>
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
                            '../../assets/images/32a2fd4893ce00a5012d7f32c793234c.png'
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
                                        '../../assets/images/e6971251659565ac4321132c304d21b0.png'
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
                                '../../assets/images/32a2fd4893ce00a5012d7f32c793234c.png'
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
                                    '../../assets/images/6ec2c30c6b396cef8175ba6590c47f07.png'
                                }
                            />
                            <span className="text-group_5">应用理论</span>
                        </div>
                        <img
                            className="label_7"
                            src={
                                '../../assets/images/2f6f6b05e1bf29806c0cf0ba80a8badc.png'
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