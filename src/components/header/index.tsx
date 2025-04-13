import './index.scss'
import { Space } from 'antd';
import { NavLink } from 'react-router';

function Header() {
    return (
        <div className='istem-header-box'>
            <div className="header-container flex-row justify-between align-center">
                {/* 左侧Logo区域 */}
                <div className="logo-container flex-row align-center">
                    <img
                        className="logo-image"
                        src={
                            "https://lanhu-oss-2537-2.lanhuapp.com/SketchPng43fc4ea8997a0ebda5cead9dd0d4f835650b0ccb83407f320b6ef9a4d05e44dd"
                        }
                        alt="AI-STEM Logo"
                    />
                    <span className="logo-text">AI-STEM</span>
                </div>

                {/* 右侧导航菜单 */}
                <div className="nav-container flex-row align-center">
                    <Space size="large" className="nav-items">
                        <NavLink className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        } to="/">首页</NavLink>
                        <span className="nav-item">功能介绍</span>
                        <NavLink className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        } to="/course-preview">课程</NavLink>
                        <span className="nav-item">学习记录</span>
                        <span className="nav-item">账号管理</span>
                        <span className="nav-item">关于我们</span>
                        <span className="nav-item highlight">登录/注册</span>
                    </Space>

                    {/* 语言切换 */}
                    <div className="language-selector flex-row align-center">
                        <img
                            className="language-icon"
                            src={
                                "https://lanhu-oss-2537-2.lanhuapp.com/SketchPngdc90e1abd80337692577fa18f0203de9dc8e27f273c997596e7a5ab00175de62"
                            }
                            alt="Language"
                        />
                        <div className="language-options">
                            <span className="language-option">English</span>
                            <span className="language-separator">&nbsp;|&nbsp;</span>
                            <span className="language-option active">中文</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;