import React, { FC, useState } from 'react';
import { Modal, Table, Button, Input } from 'antd';
import { useLocation } from 'react-router-dom';
import styles from './index.less';
// import EditTableTable from '../../components/EditableTable';

const { Column, ColumnGroup } = Table;

const Detail: FC = () => {
  const location = useLocation();
  console.log('statlocatione:', location);

  const [visible, setVisible] = React.useState(true);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const dataSource = [
    { id: 'DJ1111111122', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ1111111133', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ1111111144', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ1111111155', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ1111111166', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ1111111177', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ1111111188', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ1111111199', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ1111111101', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ1111111111', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ1111111112', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ1111111113', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ1111111114', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111215', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111216', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111217', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111218', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111219', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111220', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111221', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111222', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111223', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111224', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111225', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111226', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111227', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111228', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111229', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111230', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111231', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111232', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111233', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    { id: 'DJ11111111234', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
  ];

  const [state, setState] = useState({
    dataSource
  });

  // const columns = [
  //   {
  //     title: '图片',
  //     dataIndex: 'b',
  //     key: 'b',
  //     width: 120,
  //     render: (text: any, record: any, index: number) => {
  //       return <img src={record.b} />
  //     },
  //   },
  //   {
  //     title: '流水号',
  //     dataIndex: 'id',
  //     key: 'id',
  //   },
  //   {
  //     title: '发票号',
  //     width: 250,
  //     dataIndex: 'c',
  //     key: 'c',
  //   },
  //   {
  //     title: '代码',
  //     dataIndex: 'd',
  //     key: 'd',
  //   },
  //   {
  //     title: '金额',
  //     dataIndex: 'e',
  //     key: 'e',
  //   },
  //   {
  //     title: '发票号',
  //     width: 250,
  //     dataIndex: 'f',
  //     key: 'f',
  //     editable: true,
  //     // onCell: (record: any) => {
  //     //   debugger;
  //     //   return {
  //     //     record,
  //     //     editable: true,
  //     //     dataIndex: 'f',
  //     //     // title: col.,
  //     //     handleSave: handleSave,
  //     //   };
  //     // }
  //   },
  //   {
  //     title: '代码',
  //     dataIndex: 'g',
  //     key: 'g',
  //     editable: true,
  //   },
  //   {
  //     title: '金额',
  //     dataIndex: 'h',
  //     key: 'h',
  //     editable: true,
  //   },
  // ];

  // const handleSave = (row: any) => {
  //   const newData = [...state.dataSource];
  //   const index = newData.findIndex((item: any) => row.key === item.key);
  //   const item = newData[index];
  //   newData.splice(index, 1, {
  //     ...item,
  //     ...row,
  //   });
  //   setState({ dataSource: newData });
  // };

  const handleSubmit = () => {
    const submitData = state.dataSource;
    console.log('submitData:', submitData);
  };

  const handleModalOk = () => {
    setConfirmLoading(true);
    if (confirmLoading) {
      return;
    }
    setTimeout(() => {
      setConfirmLoading(false);
      setVisible(false);
    }, 2000);
  };

  const handleModalCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

  const handleCellChange = (val: string, field: string, i: number) => {
    console.log('val, field, i', val, field, i);
    const newDataSource = state.dataSource;
    newDataSource[i][field] = val;
    debugger;
    setState({
      dataSource: newDataSource
    })
  };

  const renderTable = () => {
    return (
      <Table
        rowKey={(record) => record.id}
        dataSource={state.dataSource}
        pagination={false}
        scroll={{ x: 'max-content', y: 510 }}
        rowClassName={() => 'editable-row'}
      >
        <ColumnGroup title="图片">
          <Column dataIndex="b" key="b" render={(text: any, record: any, index: number) => {
            return <img src={record.b} />
          }} />
        </ColumnGroup>
        <ColumnGroup title="流水号">
          <Column dataIndex="id" key="id" />
        </ColumnGroup>
        <ColumnGroup title="报销系统">
          <Column title="发票号" dataIndex="c" key="c" />
          <Column title="代码" dataIndex="d" key="d" />
          <Column title="金额" dataIndex="e" key="e" />
        </ColumnGroup>
        <ColumnGroup title="收单柜">
          <Column
            title="发票号"
            dataIndex="f"
            key="f"
            render={(text: any, record: any, index: number) => {
              return <Input size="middle" value={record.h} onChange={(e: any) => { handleCellChange(e.currentTarget.value, 'h', index); }} />;
            }}
          />
          <Column
            title="代码"
            dataIndex="g"
            key="g"
            render={(text: any, record: any, index: number) => {
              return <Input size="middle" value={record.h} onChange={(e: any) => { handleCellChange(e.currentTarget.value, 'h', index); }} />;
            }}
          />
          <Column
            title="金额"
            dataIndex="h"
            key="h"
            render={(text: any, record: any, index: number) => {
              return <Input size="middle" value={record.h} onChange={(e: any) => { handleCellChange(e.currentTarget.value, 'h', index); }} />;
            }}
          />
        </ColumnGroup>
      </Table>
    );
  };

  return (
    <div className={styles.detail}>
      <div className={styles.header}>纳铁福只能收单柜</div>
      <div className={styles.body}>
        <div className={styles.userInfo}>
          <div className={styles.infoItem}>姓名：<span className={styles.infoVal}>张三</span></div>
          <div className={styles.infoItem}>工号：<span className={styles.infoVal}>123456789</span></div>
          <div className={styles.infoItem}>单据号：<span className={styles.infoVal}>123456789</span></div>
          <div className={styles.infoItem}>报销人：<span className={styles.infoVal}>张三</span></div>
        </div>
        <div className={styles.table}>
          {renderTable()}
        </div>
        <div className={styles.btnContainer}>
          <Button type="primary" onClick={handleSubmit} size="large">
            确认无误，投递
          </Button>
        </div>
      </div>
      <div className={styles.footer}>@纳铁福版权所有</div>
      <Modal
        className={styles.modalBody}
        title="提示"
        visible={visible}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
        closable={false} // 右上角关闭按钮
        okText="确定，开始识别单据"
        cancelText="取消，退出登录"
        maskClosable={false} // 点击蒙层关闭
        centered // 垂直居中
      >
        <p className={styles.tipContent}>
          请将单据整理好，带有二维码的封面放在第一页，然后封面朝下放入收单柜。
        </p>
      </Modal>
    </div>
  );
}

export default Detail;
