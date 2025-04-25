import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Collapse, Empty, Input, Row, Select, Spin, Tag, message } from 'antd';
import { Query } from 'appwrite';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Active, Chapter, Course } from '../../../types/db';
import { CollectionName, DatabaseName, SubjectType } from '../../../types/enums';
import { useLoginModal } from '../../hooks/useLogin';
import { useUser } from '../../hooks/user';
import { account, databases, teams } from '../../utils/appwrite';
import './index.scss';

const { Panel } = Collapse;
const { Option } = Select;

function CourseList() {
    const [searchText, setSearchText] = useState('');
    const [subject, setSubject] = useState('S');
    const [activeKey, setActiveKey] = useState<string[]>([]);
    const [activities, setActivities] = useState<Active[]>([]);
    const [loading, setLoading] = useState(false);
    const [filteredActivities, setFilteredActivities] = useState<Active[]>([]);
    const navigate = useNavigate();
    const { userInfo } = useUser()
    const { showLoginModal } = useLoginModal()

    // 获取活动和课程数据
    useEffect(() => {
        fetchActivities();
    }, []);

    // 获取所有活动
    const fetchActivities = async () => {
        setLoading(true);
        try {
            const response = await databases.listDocuments<Active>(
                DatabaseName.ai_stem,
                CollectionName.active,
                [
                    Query.orderDesc('$createdAt'),
                    Query.limit(1000),
                    Query.offset(0)
                ]
            );

            setActivities(response.documents);
            setFilteredActivities(response.documents);
            // 默认展开第一个活动
            if (response.documents.length > 0) {
                setActiveKey([response.documents[0].$id]);
            }
        } catch (error) {
            message.error((error as Error).message);
            console.error('获取活动和课程失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 过滤活动和课程
    const filterActivities = () => {
        let filtered = [...activities];

        // 按学科筛选
        if (subject) {
            filtered = filtered.filter(activity => activity.subject === subject);
        }

        // 按课程名称搜索
        if (searchText) {
            filtered = filtered.map(activity => {
                const filteredcourse = activity.course.filter(course =>
                    course.name.toLowerCase().includes(searchText.toLowerCase())
                );
                return { ...activity, course: filteredcourse };
            }).filter(activity => activity.course.length > 0);
        }

        setFilteredActivities(filtered);
    };

    // 处理搜索
    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    // 处理学科选择
    const handleSubjectChange = (value: string) => {
        setSubject(value);
    };

    // 处理课程点击，跳转到课程学习页面
    const handleCourseClick = async (courseId: string) => {
        if (!userInfo) {
            showLoginModal()
            return
        }
        const { total } = await databases.listDocuments<Chapter>(
            DatabaseName.ai_stem,
            CollectionName.chapter,
            [
                Query.equal('course', courseId),
                Query.limit(1),
                Query.offset(0)
            ]
        )
        if (!total) {
            message.warning('你没有权限学习该课程')
            return
        }
        navigate(`/course-preview/course-learning/${courseId}`);
    };

    // 渲染课程卡片
    const renderCourseCard = (course: Course) => (
        <Col xs={24} sm={12} md={8} lg={6} key={course.$id} className="course-card-col">
            <Card
                hoverable
                cover={
                    <img alt={course.name} src={course.attachment} />
                }
                className="course-card"
                onClick={() => handleCourseClick(course.$id)}
            >
                <Card.Meta
                    title={course.name}
                    description={
                        <div className="course-code">时长: {course.duration}</div>
                    }
                />
            </Card>
        </Col>
    );

    return (
        <div className="istem-course-list-box">
            <div className="istem-course-list-inner">
                {/* 顶部提示条 */}
                {/* <Alert
                    message="探索各年级的STEM课程建议，或搜索满足您需求的特定课程"
                    type="warning"
                    showIcon
                    icon={<AlertOutlined />}
                    className="top-alert"
                /> */}

                {/* 搜索筛选区域 */}
                <div className="search-filter-container">
                    <Input
                        placeholder="搜索课程"
                        prefix={<SearchOutlined />}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="search-input"
                    />
                    <Select
                        defaultValue="S"
                        style={{ width: 120 }}
                        onChange={handleSubjectChange}
                        className="type-select"
                    >
                        <Option value="S">{SubjectType.S}</Option>
                        <Option value="T">{SubjectType.T}</Option>
                        <Option value="A">{SubjectType.E}</Option>
                        <Option value="M">{SubjectType.M}</Option>
                    </Select>
                    <Button type="primary" onClick={() => filterActivities()}>查询</Button>
                </div>

                {/* 课程列表区域 */}
                <div className="course-list-container">
                    <Spin spinning={loading}>
                        {filteredActivities.length > 0 ? (
                            <Collapse
                                activeKey={activeKey}
                                onChange={(key) => setActiveKey(key as string[])}
                                className="activity-collapse"
                            >
                                {filteredActivities.map((activity) => (
                                    <Panel
                                        header={
                                            <div className="activity-header">
                                                <div className='flex-rwo align-center'>
                                                    <span style={{ marginRight: 12 }}>{activity.name}</span>
                                                    {!activeKey.includes(activity.$id) && <div className='flex-row image-box'>
                                                        {activity.course.map(course => <img className='image-item' src={course.attachment} alt={course.name} key={course.$id} />)}
                                                    </div>}
                                                </div>
                                                <div>
                                                    {activity.grade && <Tag color="green">{activity.grade}</Tag>}
                                                    <Tag color="blue">{SubjectType[activity.subject]}</Tag>
                                                    <Tag color="purple">{activity.course.length}个课程</Tag>
                                                </div>
                                            </div>
                                        }
                                        key={activity.$id}
                                        className="activity-panel"
                                    >
                                        {activity.course.length > 0 ? (
                                            <Row gutter={[16, 16]} className="course-grid">
                                                {activity.course.map(course => renderCourseCard(course))}
                                            </Row>
                                        ) : (
                                            <Empty description="暂无课程" />
                                        )}
                                    </Panel>
                                ))}
                            </Collapse>
                        ) : (
                            <Empty description="暂无符合条件的活动或课程" />
                        )}
                    </Spin>
                </div>
            </div>
        </div>
    );
}

export default CourseList;