import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // ⬅️ state loading

  const onFinish = () => {
    setLoading(true); // ⬅️ mulai loading

    const credentials = {
      username: 'mor_2314',
      password: '83r5^_',
    };

    fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          message.success('Login successful!');
          setLoggedIn(true);
          navigate('/dashboard');
        } else {
          message.error('Login failed!');
        }
      })
      .catch(() => message.error('An error occurred'))
      .finally(() => setLoading(false));
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#1C6EA4',
      }}
    >
      <Card title="Login" bordered={false} style={{ width: 350 }}>
        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{
            username: 'mor_2314',
            password: '83r5^_',
          }}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
