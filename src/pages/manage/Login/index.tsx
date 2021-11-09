import React, { FC, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { manageLogon } from '@/service/api';
import Loading from '@/components/Loading';

const Login: FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  // const AppKey = 'dingdsldijwnccbqy4xj';


  const renderUsernamePassword = () => {
    const [form] = Form.useForm();
    const onFinish = async (values: any) => {
      console.log('user name password logon:', values);
      setLoading(true);
      const result = await manageLogon(values);
      setLoading(false);
      if (result.code === 200 && result?.data?.userName) {
          message.success('登录成功');
          history.push(`/manage/list`, {});
      } else {
          message.error(result.message || '请求错误');
      }
    };

    return (
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="userName"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          name="passWord"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            size="large"
            type="password"
            placeholder="请输入密码"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large" className="login-form-button">
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className={styles.login}>
      {/* <Loading show={showLoading} /> */}
      <div className={styles.header}>SDS智能收单柜</div>
      <div className={styles.body}>
        {renderUsernamePassword()}
      </div>
      <div className={styles.footer}>@纳铁福版权所有</div>
    </div>
  );
}

export default Login;
