import React, { FC } from 'react';
import { Table, Button } from 'antd';
// import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import styles from './index.less';

const List: FC = () => {
  const history = useHistory();
  const dataSource = [
    { id: 'DJ111111111', b: 200, c: '出差火车票', d: 200, e: '2021-11-01', f: 3 },
    { id: 'DJ111111112', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ111111113', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ111111114', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ111111115', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ111111116', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ111111117', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ111111118', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ111111119', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ111111110', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ1111111111', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ1111111112', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ1111111113', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ1111111114', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111215', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111216', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111217', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111217', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111219', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111220', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111221', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111222', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111223', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111224', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111225', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111226', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111227', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111228', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111229', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111230', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111231', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111232', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111233', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },
    { id: 'DJ11111111234', b: 300, c: '出差飞机票', d: 300, e: '2021-11-02', f: 2 },

  ];

  const columns = [
    {
      title: '单据号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '报销金额',
      dataIndex: 'b',
      key: 'b',
    },
    {
      title: '名称',
      width: 250,
      dataIndex: 'c',
      key: 'c',
    },
    {
      title: '发票金额',
      dataIndex: 'd',
      key: 'd',
    },
    {
      title: '申请日期',
      dataIndex: 'e',
      key: 'e',
    },
    {
      title: '发票数量',
      dataIndex: 'f',
      key: 'f',
    },
    {
      title: '操作',
      width: 100,
      key: 'id',
      render: (text: any, record: any, index: number) => {
        return (
          <Button type="primary" onClick={() => { handleTableRowClick(record); }} size="middle" className="login-form-button">
            投递单据
          </Button>
        );
      }
    },
  ];
  const handleTableRowClick = (record: any) => {
    console.log('row click: ', record);
    history.push('/detail', { record });
  };
  const renderTable = () => {
    return (
      <Table rowKey={(record) => record.id} dataSource={dataSource} columns={columns} pagination={false} scroll={{ x: 'max-content', y: 650 }} />
    );
  };

  return (
    <div className={styles.list}>
      <div className={styles.header}>纳铁福只能收单柜</div>
      <div className={styles.body}>
        <div className={styles.userInfo}>
          <div className={styles.infoItem}>姓名：<span className={styles.infoVal}>张三</span></div>
          <div className={styles.infoItem}>工号：<span className={styles.infoVal}>123456789</span></div>
        </div>
        <div className={styles.table}>
          {renderTable()}
        </div>
      </div>
      <div className={styles.footer}>@纳铁福版权所有</div>
    </div>
  );
}

export default List;
