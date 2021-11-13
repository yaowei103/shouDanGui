import React, { FC, useCallback, useEffect, useState, useRef } from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import classnames from 'classnames';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { cancelPIDC, getStatusAndRead, resetPIDC } from '@/components/boCard';
import icon from '@/assets/icon-card.png';
import { logon, getPhoneCode } from '@/service/api';
import Loading from '@/components/Loading';

// import { Link } from "react-router-dom";

const { TabPane } = Tabs;

const Login: FC = () => {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState<string>('1');
  const [showLoading, setShowLoading] = useState(false);
  const [getCodeBtnLoading, setGetCodeBtnLoading] = useState(0);
  // const AppKey = 'dingdsldijwnccbqy4xj';
  const AppSecret = 'jS93tWpbVnGqjxJ8YgI5P4whqbL5iuoY2GBMXAHTUA-UUJ1DAq-XdwpWWSHXvQPH';

  const kidc = window.kidc;

  const [phoneLogonState, setPhoneLogonState] = useState({
    phoneNumber: '',
    code: ''
  });

  const handleReadResultMsg = async (cardId: string) => {
    // 读卡成功，将信息发送给后端；
    console.log('将读卡信息发送给后端', cardId);
    //登录成功跳转页面
    const req = {
      type: 1,
      cardId: cardId
    }
    message.success('刷卡成功，正在登录');
    setShowLoading(true);
    const logonResult = await logon(req);
    console.log('登录结果', logonResult);
    const { code, data } = logonResult;
    setShowLoading(false);
    if (code === 200 && data?.empcode) {
      console.log('刷卡登录成功');
      message.success('登录成功');
      history.push(`/list`, {
        user: data
      });
    } else {
      resetPIDC(kidc);
      console.log('登录失败，请尝试其他方式登录');
      message.error('登录失败，请尝试其他方式登录');
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const payByCard = async () => {
    console.log('payCard');
    // await resetPIDC(kidc);
    console.log('开始读卡');
    const readResult = await getStatusAndRead(kidc);
    console.log('读卡结果', readResult);
    // kidc.on('statusChange', async () => {
    if (readResult.result === 0) {
      const cardId = readResult.id;
      console.log('读卡结果 cardId：', cardId);
      handleReadResultMsg(cardId);
    }
    // });
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

  // useEffect(() => {
  //   openPIDC(kidc);
  //   console.log('open ipdc');
  // }, []);

  useEffect(() => {
    if (currentTab === '1') {// card logon
      payByCard();
      clearInterval(timerRef.current);
      setGetCodeBtnLoading(0);
    } else if (currentTab === '3') { // dingding logon
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
      //其他情况，关闭设备
      cancelPIDC(kidc);
      clearInterval(timerRef.current);
      setGetCodeBtnLoading(0);
    } else if (currentTab === '2') {
      console.log('phone logon');
      //其他情况，关闭设备
      cancelPIDC(kidc);
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

  const handlePhoneLogonChange = (e: any, field: string) => {
    setPhoneLogonState({
      ...phoneLogonState,
      [field]: e.target.value
    });
  }

  const handlePhoneLogon = async () => {
    const req = { ...phoneLogonState, type: 2 };
    const result = await logon(req);
    const { code, data } = result;
    setShowLoading(false);
    if (code === 200 && data?.empcode) {
      console.log('刷卡登录成功');
      message.success('登录成功', result);
      history.push(`/list`, {
        user: data
      });
    } else {
      console.log('登录失败，请尝试其他方式登录');
      message.error('登录失败，请尝试其他方式登录');
    }
  }

  const timerRef:any = useRef();

  const getPhoneMsg = async () => {
    const { phoneNumber } = phoneLogonState;
    setGetCodeBtnLoading(59);
    timerRef.current = setInterval(() => {
      setGetCodeBtnLoading((getCodeBtnLoading) => {
        console.log('getCodeBtnLoading', getCodeBtnLoading);
        if (getCodeBtnLoading <= 0) {
          clearInterval(timerRef.current);
          return 0;
        } else {
          return getCodeBtnLoading - 1;
        }
      });
    }, 1000);
    const result = await getPhoneCode(name, phoneNumber);
    if (result?.code === 200) {
      message.success('短信验证码发送成功');
    } else {
      clearInterval(timerRef.current);
      setGetCodeBtnLoading(0);
      message.error(result?.data?.message || '短信验证码发送失败，请重试');
    }
  };

  const renderPhoneMsg = () => {
    const [form] = Form.useForm();
    console.log('form:', form);

    return (
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
      // onFinish={onFinish}
      >
        <Form.Item
          name="phoneNumber"
          rules={[{ required: true, pattern: new RegExp(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/), message: '请输入正确手机号码!' }]}
        >
          <Input
            size="large"
            value={phoneLogonState.phoneNumber}
            onChange={(e) => { handlePhoneLogonChange(e, 'phoneNumber') }}
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="请输入手机号码"
          />
        </Form.Item>
        <Form.Item
          name="phoneMsg"
          rules={[{ required: true, message: '请输入手机验证码!' }]}
        >
          <Row gutter={24}>
            <Col span={15}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                value={phoneLogonState.code}
                onChange={(e) => { handlePhoneLogonChange(e, 'code') }}
                size="large"
                type="text"
                placeholder="请输入手机验证码"
              />
            </Col>
            <Col span={9}>
              <Button
                type="primary"
                disabled={!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(phoneLogonState.phoneNumber)}
                onClick={getPhoneMsg}
                size="large"
                className="login-form-button"
                loading={getCodeBtnLoading !== 0}
              >
                {
                getCodeBtnLoading !== 0
                  ?<span>({getCodeBtnLoading}s)</span>
                  : '获取验证码'
                }
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item shouldUpdate>
          <Button
            type="primary"
            // htmlType="submit"
            onClick={handlePhoneLogon}
            size="large"
            className="login-form-button"
            disabled={!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(phoneLogonState.phoneNumber) || phoneLogonState.code === ''}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className={styles.login}>
      <Loading show={showLoading} />
      <div className={styles.header}>SDS智能收单柜</div>
      <div className={styles.body}>
        <Tabs className={styles.tabContainer} defaultActiveKey={currentTab} onChange={handleTabChange}>
          <TabPane className={classnames(styles.panel, styles.cardPanel)} tab="刷卡登录" key="1">
            <div className={styles.payByCard}>
              <img src={icon} />
              请刷卡
            </div>
          </TabPane>
          <TabPane className={classnames(styles.panel, styles.dingdingPanel)} tab="钉钉登录" key="3">
            <div className={styles.dingdingCode} id="dingdingCode" />
          </TabPane>
          {/* <TabPane className={classnames(styles.panel, styles.usernamePanel)} tab="用户名密码登录" key="2">
            {renderUsernamePassword()}
          </TabPane> */}
          <TabPane className={classnames(styles.panel, styles.phoneMsgPanel)} tab="手机验证码登录" key="2">
            {renderPhoneMsg()}
          </TabPane>
        </Tabs>
      </div>
      <div className={styles.footer}>@纳铁福版权所有</div>
    </div>
  );
}

export default Login;
