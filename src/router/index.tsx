// import loadable from '@loadable/component';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from '../pages/Login';
import List from '../pages/List';
import Detail from '../pages/Detail';

import ManageLogon from '../pages/manage/Login';
import ManageList from '../pages/manage/List';

// 页面异步chunk优化

// const Login = loadable(() => import('../pages/Login'));
// const List = loadable(() => import('../pages/List'));
// const Detail = loadable(() => import('../pages/Detail'));
// const processEnv: any = process;

const Root = () => {
  return (
    <BrowserRouter basename={process.env.NODE_ENV === 'development' ? '/' : '/shouDanGui/'}>
      <Route path="/" exact component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/list" component={List} />
      <Route path="/detail" component={Detail} />
      <Route path="/manage/logon" component={ManageLogon} />
      <Route path="/manage/list" component={ManageList} />
    </BrowserRouter>
  );
};

export default Root;
