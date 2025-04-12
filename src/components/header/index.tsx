import './index.scss'
function Header() {
    return (
        <div className='istem-header-box'>
            <div className="section_9 flex-col justify-center">
                <div className="box_14 flex-row">
                    <img
                        className="label_9"
                        src={
                            "https://lanhu-oss-2537-2.lanhuapp.com/SketchPng43fc4ea8997a0ebda5cead9dd0d4f835650b0ccb83407f320b6ef9a4d05e44dd"
                        }
                    />
                    <span className="text_19">首页</span>
                    <span className="text_20">功能介绍</span>
                    <span className="text_21">课程</span>
                    <span className="text_22">学习记录</span>
                    <span className="text_23">账号管理</span>
                    <span className="text_24">关于我们</span>
                    <span className="text_25">登录/注册</span>
                    <img
                        className="thumbnail_4"
                        src={
                            "https://lanhu-oss-2537-2.lanhuapp.com/SketchPngdc90e1abd80337692577fa18f0203de9dc8e27f273c997596e7a5ab00175de62"
                        }
                    />
                    <div className="text-wrapper_3">
                        <span className="text_26">English</span>
                        <span className="text_27">&nbsp;&nbsp;|&nbsp;&nbsp;中文</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;