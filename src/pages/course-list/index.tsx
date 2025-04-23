import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Collapse, Input, Row, Select, Tag } from 'antd';
import { useState } from 'react';
import './index.scss';

const { Panel } = Collapse;
const { Option } = Select;

// 模拟数据
const mockActivities = [
    {
        id: 1,
        title: 'xx领学习课程',
        courses: [
            {
                id: 101,
                title: '【太空学】：了解宇宙中的各个星球',
                image: 'https://via.placeholder.com/250x150',
                code: '编号:40938'
            },
            {
                id: 102,
                title: '【太空学】：了解宇宙中的各个星球',
                image: 'https://via.placeholder.com/250x150',
                code: '编号:40938'
            },
            {
                id: 103,
                title: '【太空学】：了解宇宙中的各个星球',
                image: 'https://via.placeholder.com/250x150',
                code: '编号:40938'
            },
            {
                id: 104,
                title: '【太空学】：了解宇宙中的各个星球',
                image: 'https://via.placeholder.com/250x150',
                code: '编号:40938'
            }
        ]
    },
    {
        id: 2,
        title: 'xx领学习课程',
        courses: [
            {
                id: 201,
                title: '【太空学】：了解宇宙中的各个星球',
                image: 'https://via.placeholder.com/250x150',
                code: '编号:40938'
            },
            {
                id: 202,
                title: '【太空学】：了解宇宙中的各个星球',
                image: 'https://via.placeholder.com/250x150',
                code: '编号:40938'
            }
        ]
    },
    {
        id: 3,
        title: 'xx领学习课程',
        courses: [
            {
                id: 301,
                title: '【太空学】：了解宇宙中的各个星球',
                image: 'https://via.placeholder.com/250x150',
                code: '编号:40938'
            },
            {
                id: 302,
                title: '【太空学】：了解宇宙中的各个星球',
                image: 'https://via.placeholder.com/250x150',
                code: '编号:40938'
            },
            {
                id: 303,
                title: '【太空学】：了解宇宙中的各个星球',
                image: 'https://via.placeholder.com/250x150',
                code: '编号:40938'
            }
        ]
    }
];

function CourseList() {
    const [searchText, setSearchText] = useState('');
    const [courseType, setCourseType] = useState('s');
    const [activeKey, setActiveKey] = useState(['1']);

    // 处理搜索
    const handleSearch = (value) => {
        setSearchText(value);
    };

    // 处理类型选择
    const handleTypeChange = (value) => {
        setCourseType(value);
    };

    // 渲染课程卡片
    const renderCourseCard = (course) => (
        <Col xs={24} sm={12} md={8} lg={6} key={course.id} className="course-card-col">
            <Card
                hoverable
                cover={
                    <img alt={course.title} src={course.image} />
                }
                className="course-card"
            >
                <Card.Meta
                    title={course.title}
                    description={
                        <div className="course-code">{course.code}</div>
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
                    message="保持各年级的STEM课程建设，选择学生应该学习的特色课程"
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
                        defaultValue="s"
                        style={{ width: 120 }}
                        onChange={handleTypeChange}
                        className="type-select"
                    >
                        <Option value="s">科学</Option>
                    </Select>
                    <Button type="primary">搜索</Button>
                </div>

                {/* 课程列表区域 */}
                <div className="course-list-container">
                    <Collapse
                        accordion
                        activeKey={activeKey}
                        onChange={(key) => setActiveKey(key)}
                        className="activity-collapse"
                    >
                        {mockActivities.map((activity,index) => (
                            <Panel
                                header={
                                    <div className="activity-header">
                                        <div className='flex-rwo align-center'>
                                            <span style={{ marginRight: 12 }}>{activity.title}</span>
                                            {!activeKey.includes(`${index + 1}`) && <div className='flex-row image-box'>
                                                <img className='image-item' src='https://placehold.co/105x78/EEE/31343C' alt='icon' />
                                            </div>}
                                        </div>
                                        <Tag color="blue">{activity.courses.length}个课程</Tag>
                                    </div>
                                }
                                key={activity.id}
                                className="activity-panel"
                            >
                                <Row gutter={[16, 16]} className="course-grid">
                                    {activity.courses.map(course => renderCourseCard(course))}
                                </Row>
                            </Panel>
                        ))}
                    </Collapse>
                </div>
            </div>
        </div>
    );
}

export default CourseList;