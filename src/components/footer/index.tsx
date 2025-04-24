import './index.scss';
import LogoImage from '../../assets/logo.png';
import { useLocation } from 'react-router';

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
                            src={
                                'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng80889ad0117f3c8d49390d3d0b790100a779ecc32065b4dd013d0352cac235c4'
                            }
                            alt="Middle logo right"
                        />
                        <img
                            className="middle-logo-left"
                            src={
                                'https://lanhu-oss-2537-2.lanhuapp.com/SketchPngbaa1fc61e6b8ef3443862360739e62c7e27cddabe3a0c67af6c37910d8ab5739'
                            }
                            alt="Middle logo left"
                        />
                        <img
                            className="right-logo"
                            src={
                                'https://lanhu-oss-2537-2.lanhuapp.com/SketchPnge5d2f6b3ddcb0d989bcadd509d8236bd3e00e1db274b2628890cb0ab6cf6f3a4'
                            }
                            alt="Right logo"
                        />
                    </div>
                    <div className="social-icons">
                        <img
                            className="social-icon"
                            src={
                                'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng0ff1441627a0307911c907301eadd615ca8cf5b2b6c6d08c81b1cc38ece90846'
                            }
                            alt="Social icon 1"
                        />
                        <img
                            className="social-icon"
                            src={
                                'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng8e44864ba8cd4ee83c8092fa6d3a7d58af50dcbcc1882a00297d80eb526a7472'
                            }
                            alt="Social icon 2"
                        />
                        <img
                            className="social-icon"
                            src={
                                'https://lanhu-oss-2537-2.lanhuapp.com/SketchPng5bdf5d543d72c3b40875898e2cee4b22b148304b280011a236bfb3af960d6f30'
                            }
                            alt="Social icon 3"
                        />
                        <img
                            className="social-icon"
                            src={
                                'https://lanhu-oss-2537-2.lanhuapp.com/SketchPngb8283331461c6d412e9e6f49d564705bad9a835c6053911253957218f4cd12df'
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