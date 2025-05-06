import './index.scss';
import LogoImage from '../../assets/logo.png';
import { useLocation } from 'react-router';
import _3db4ae0853ee1a1b31e2d54eb44ca689 from '../../assets/images/3db4ae0853ee1a1b31e2d54eb44ca689.png';
import _08424ed46f9a944081489b814d12abb7 from '../../assets/images/08424ed46f9a944081489b814d12abb7.png';
import _603bf0ab5e5f51ce5c9f86cdb66817a3 from '../../assets/images/603bf0ab5e5f51ce5c9f86cdb66817a3.png';
import _1b731373fbb5d07019ab8209d0cf698a from '../../assets/images/1b731373fbb5d07019ab8209d0cf698a.png';
import c3e08a254fa0c339955669f62fe5a3ac from '../../assets/images/c3e08a254fa0c339955669f62fe5a3ac.png';
import _2e01cefbba197fa9c5a24bf77dadcf71 from '../../assets/images/2e01cefbba197fa9c5a24bf77dadcf71.png';
import _5cab39dc0d92b1b88767a761a3e11cbe from '../../assets/images/5cab39dc0d92b1b88767a761a3e11cbe.png';

function Footer() {
    const location = useLocation();
    const path = location.pathname;
    const background = (() => {
        if (path === '/course-preview/active-admin') {
            return '#F4F7FA';
        }
        if (path.includes('/course-preview/course-admin')) {
            return '#F4F7FA';
        }
        if (path === '/') {
            return 'transparent';
        }
        if (path === '/introduce') {
            return 'transparent';
        }
        if (path === '/course-preview/course-list') {
            return '#F5F5F5';
        }
        if (path === '/teams') {
            return '#F5F5F5';
        }
        if (path.includes('/teams/teams-member')) {
            return '#F5F5F5';
        }
    })();
    const marginTop = (() => {
        if (path === '/') {
            return '-60px';
        }
        if (path === '/introduce') {
            return '-60px';
        }
    })();
    const display = (() => {
        if (path.includes('/course-preview/course-learning')) {
            return 'none';
        }
    })();
    return (
        <div style={{ background, marginTop, display }} className="istem-footer-box">
            <div className="footer-container">
                <div className="footer-left">
                    <div className="logo-wrapper">
                        <div className="logo-content">
                            <img
                                className="logo-icon"
                                src={LogoImage}
                                alt="i-STEM Logo"
                            />
                            <span className="logo-text">i-STEM</span>
                        </div>
                        <div className="green-circle" />
                    </div>
                    <div className="disclaimer-wrapper">
                        <span className="disclaimer-text">Powered by Dr. Sun Daner Team；由 Sun Daner 博士团队提供</span>
                    </div>
                </div>

                <div className="footer-right">
                    <div className="footer-middle">
                        <img
                            className="middle-logo-right"
                            src={_3db4ae0853ee1a1b31e2d54eb44ca689}
                            alt="Middle logo right"
                        />
                        <img
                            className="middle-logo-left"
                            src={
                                _08424ed46f9a944081489b814d12abb7
                            }
                            alt="Middle logo left"
                        />
                        <img
                            className="right-logo"
                            src={
                                _603bf0ab5e5f51ce5c9f86cdb66817a3
                            }
                            alt="Right logo"
                        />
                    </div>
                    <div className="social-icons">
                        <img
                            className="social-icon"
                            src={
                                _1b731373fbb5d07019ab8209d0cf698a
                            }
                            alt="Social icon 1"
                        />
                        <img
                            className="social-icon"
                            src={
                                 c3e08a254fa0c339955669f62fe5a3ac 
                            }
                            alt="Social icon 2"
                        />
                        <img
                            className="social-icon"
                            src={
                                _2e01cefbba197fa9c5a24bf77dadcf71
                            }
                            alt="Social icon 3"
                        />
                        <img
                            className="social-icon"
                            src={
                                _5cab39dc0d92b1b88767a761a3e11cbe
                            }
                            alt="Social icon 4"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;