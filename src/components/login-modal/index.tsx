import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.scss';
import { useUser } from '../../hooks/user';

interface LoginModalProps {
    visible: boolean;
    onClose: () => void;
}

interface LoginFormValues {
    email: string;
    password: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { login } = useUser();

    const handleSubmit = async (values: LoginFormValues) => {
        try {
            setLoading(true);
            await login(values.email, values.password);
            message.success('登录成功');
            form.resetFields();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="账号登录"
            open={visible}
            onCancel={handleCancel}
            footer={null}
            maskClosable={false}
            className="login-modal"
        >
            <Form
                form={form}
                name="login"
                onFinish={handleSubmit}
                layout="vertical"
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: '请输入账号' }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="请输入账号"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="请输入密码"
                        size="large"
                    />
                </Form.Item>

                <Form.Item className="login-form-button">
                    <Button type="primary" htmlType="submit" loading={loading} block size="large">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default LoginModal;