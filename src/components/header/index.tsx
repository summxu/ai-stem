import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space } from 'antd';
import { NavLink } from 'react-router';
import { useLanguage } from '../../hooks/useLanguage';
import { useLoginModal } from '../../hooks/useLogin.tsx';
import { useUser } from '../../hooks/user.tsx';
import LogoImage from '../../assets/logo.png';
import './index.scss';

function Header() {
    const { showLoginModal } = useLoginModal();
    const { userInfo, logout } = useUser();
    const { langType, toggleLanguage } = useLanguage();

    const handleLogout = async () => {
        await logout();
    };

    const userMenuItems = [
        {
            key: 'logout',
            label: '退出登录',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];
    return (
        <div className="istem-header-box">
            <div className="header-container flex-row justify-between align-center">
                {/* 左侧Logo区域 */}
                <div className="logo-container flex-row align-center">
                    <img
                        className="logo-image"
                        src={LogoImage}
                        alt="AI-STEM Logo"
                    />
                    <span className="logo-text">I-STEM</span>
                </div>

                {/* 右侧导航菜单 */}
                <div className="nav-container flex-row align-center">
                    <Space size="large" className="nav-items">
                        <NavLink className={({ isActive }) =>
                            isActive ? 'nav-item active' : 'nav-item'
                        } to="/">首页</NavLink>
                        <NavLink className={({ isActive }) =>
                            isActive ? 'nav-item active' : 'nav-item'
                        } to="/introduce">功能介绍</NavLink>
                        <NavLink className={({ isActive }) =>
                            isActive ? 'nav-item active' : 'nav-item'
                        } to="/course-preview">课程</NavLink>
                        <span className="nav-item">学习记录</span>
                        <span className="nav-item">账号管理</span>
                        <NavLink className={({ isActive }) =>
                            isActive ? 'nav-item active' : 'nav-item'
                        } to="/about">关于我们</NavLink>
                        {userInfo ? (
                            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                                <div className="user-avatar flex align-center">
                                    <Avatar
                                        size={28}
                                        icon={<UserOutlined />}
                                        style={{ backgroundColor: '#FF5F2F', marginRight: '8px' }}
                                    />
                                    <span>{userInfo.name}</span>
                                </div>
                            </Dropdown>
                        ) : (
                            <span className="nav-item" onClick={showLoginModal}>登录</span>
                        )}
                    </Space>

                    {/* 语言切换 */}
                    <div className="language-selector flex-row align-center">
                        <img
                            className="language-icon"
                            src={
                                'https://lanhu-oss-2537-2.lanhuapp.com/SketchPngdc90e1abd80337692577fa18f0203de9dc8e27f273c997596e7a5ab00175de62'
                            }
                            alt="Language"
                        />
                        <div className="language-options">
                            <span
                                className={`language-option ${langType === 'simplified' ? 'active' : ''}`}
                                onClick={() => toggleLanguage('simplified')}
                            >
                                简
                            </span>
                            <span className="language-separator">&nbsp;|&nbsp;</span>
                            <span
                                className={`language-option ${langType === 'traditional' ? 'active' : ''}`}
                                onClick={() => toggleLanguage('traditional')}
                            >
                                繁
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;