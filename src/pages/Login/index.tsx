import React, { FC, useEffect, useState } from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import classnames from 'classnames';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { openAndReadResult, testOpenAndReadResult } from '@/components/boCard';

// import { Link } from "react-router-dom";

const { TabPane } = Tabs;

const Login: FC = () => {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState<string>('1');
  // const AppKey = 'dingdsldijwnccbqy4xj';
  const AppSecret = 'jS93tWpbVnGqjxJ8YgI5P4whqbL5iuoY2GBMXAHTUA-UUJ1DAq-XdwpWWSHXvQPH';

  const handleReadResultMsg = async (result: any) => {
    // 读卡成功，将信息发送给后端；
    console.log('将读卡信息发送给后端', result);
    //登录成功跳转页面
    message.success('登录成功');
    setTimeout(() => {
      history.push(`/list`, {});
    }, 1000)
  };

  const handleTabChange = async (tab: string) => {
    setCurrentTab(tab);
    if (tab === '3') {
      const pidc = new BOCardReader({ "device": 'PIDC' });
      console.log('开始读卡');
      const readResult: any = await openAndReadResult(pidc);
      console.log('读卡器result', readResult);
      if (readResult && readResult.result === 0) {
        message.success('读卡成功');
        handleReadResultMsg(readResult);
      } else {
        message.error('读卡错误，请重试！');
      }
      // openPIDC(pidc);
      console.log(testOpenAndReadResult);
    }
  };

  var handleMessage = function (event: any) {
    var origin = event.origin;
    console.log("origin", event.origin);
    if (origin == "https://login.dingtalk.com") { //判断是否来自ddLogin扫码事件。
      const loginTmpCode = event.data;
      //获取到loginTmpCode后就可以在这里构造跳转链接进行跳转了
      console.log("loginTmpCode", loginTmpCode);
      window.location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${AppSecret}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=REDIRECT_URI&loginTmpCode=${loginTmpCode}`;
    }
  };

  useEffect(() => {
    const dingdingEle = document.querySelector('#dingdingCode');
    if (dingdingEle) {
      const url = encodeURIComponent('http://localhost:8080/index?test=1&aa=2');
      const goto = encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${AppSecret}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}`)
      window.DDLogin({
        id: "dingdingCode",//这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
        goto: goto, //请参考注释里的方式
        style: "border:none;background-color:#FFFFFF;",
        width: "365",
        height: "320"
      });

      if (typeof window.addEventListener != 'undefined') {
        window.addEventListener('message', handleMessage, false);
      } else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('onmessage', handleMessage);
      }
    }
    // 取消注册的事件
    return () => {
      window.removeEventListener && window.removeEventListener('message', handleMessage, false);
      window.detachEvent && window.detachEvent('message');
    };
  }, [currentTab]);

  // const renderUsernamePassword = () => {
  //   const [form] = Form.useForm();
  //   const onFinish = (values: any) => {
  //     console.log('user name password logon:', values);
  //     history.push(`/list`, {});
  //   };

  //   return (
  //     <Form
  //       form={form}
  //       name="normal_login"
  //       className="login-form"
  //       initialValues={{ remember: true }}
  //       onFinish={onFinish}
  //     >
  //       <Form.Item
  //         name="username"
  //         rules={[{ required: true, message: '请输入用户名!' }]}
  //       >
  //         <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
  //       </Form.Item>
  //       <Form.Item
  //         name="password"
  //         rules={[{ required: true, message: '请输入密码!' }]}
  //       >
  //         <Input
  //           prefix={<LockOutlined className="site-form-item-icon" />}
  //           size="large"
  //           type="password"
  //           placeholder="请输入密码"
  //         />
  //       </Form.Item>
  //       <Form.Item>
  //         <Button type="primary" htmlType="submit" size="large" className="login-form-button">
  //           登录
  //         </Button>
  //       </Form.Item>
  //     </Form>
  //   );
  // };

  const renderPhoneMsg = () => {
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
      console.log('Received values of form: ', values);
      history.push(`/list`, {});
    };

    const getPhoneMsg = async () => {
      // form.validateFields(['phoneNumber']);
      // const values = form.getFieldValue('phoneNumber');
      // console.log(values);
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
          name="phoneNumber"
          rules={[{ required: true, pattern: new RegExp(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/), message: '请输入正确手机号码!' }]}
        >
          <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入手机号码" />
        </Form.Item>
        <Form.Item
          name="phoneMsg"
          rules={[{ required: true, message: '请输入手机验证码!' }]}
        >
          <Row gutter={24}>
            <Col span={15}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                size="large"
                type="text"
                placeholder="请输入手机验证码"
              />
            </Col>
            <Col span={9}>
              <Button type="default" onClick={getPhoneMsg} size="large" className="login-form-button">
                获取验证码
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" className="login-form-button">
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className={styles.login}>
      <div className={styles.header}>SDS智能收单柜</div>
      <div className={styles.body}>
        <Tabs className={styles.tabContainer} defaultActiveKey={currentTab} onChange={handleTabChange}>
          <TabPane className={classnames(styles.panel, styles.dingdingPanel)} tab="钉钉登录" key="1">
            <div className={styles.dingdingCode} id="dingdingCode" />
          </TabPane>
          {/* <TabPane className={classnames(styles.panel, styles.usernamePanel)} tab="用户名密码登录" key="2">
            {renderUsernamePassword()}
          </TabPane> */}
          <TabPane className={classnames(styles.panel, styles.phoneMsgPanel)} tab="手机验证码登录" key="2">
            {renderPhoneMsg()}
          </TabPane>
          <TabPane className={classnames(styles.panel, styles.cardPanel)} tab="刷卡登录" key="3">
            请刷卡
          </TabPane>
        </Tabs>
      </div>
      <div className={styles.footer}>@纳铁福版权所有</div>
    </div>
  );
}

export default Login;
