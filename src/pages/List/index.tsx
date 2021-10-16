import React, { FC, useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
// import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { getList } from '@/service/api';
import styles from './index.less';

const List: FC = () => {
  const history = useHistory();
  const dataSource: any[] = [
    // {
    //   "billno": "TEP202109140002",
    //   "col1": "",
    //   "col2": "",
    //   "col3": "",
    //   "col4": "",
    //   "col5": "",
    //   "expman": "A2219-吴向前",
    //   "expmoney": 2459.0,
    //   "invmoney": 2459.0,
    //   "invnums": 3,
    //   "reqdate": "2021-10-09",
    //   "sid": "402847407be1c41e017be2b0e62c0075"
    // }
  ];
  const [dataList, setDataList] = useState(dataSource);

  const getDataList = async () => {
    const res = await getList('A2219');
    if (res && res.code === 200) {
      setDataList(res.data.atreturn || []);
    } else {
      message.error('列表请求错误!');
    }
  }
  useEffect(() => {
    getDataList();
  }, []);

  const columns = [
    {
      title: '单据号',
      dataIndex: 'billno',
      key: 'billno',
      width: 120,
    },
    {
      title: '报销金额',
      dataIndex: 'expmoney',
      key: 'expmoney',
    },
    {
      title: '名称',
      width: 250,
      dataIndex: 'c',
      key: 'c',
    },
    {
      title: '发票金额',
      dataIndex: 'invmoney',
      key: 'invmoney',
    },
    {
      title: '申请日期',
      dataIndex: 'reqdate',
      key: 'reqdate',
    },
    {
      title: '发票数量',
      dataIndex: 'invnums',
      key: 'invnums',
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
      <Table rowKey={(record) => record.billno} dataSource={dataList} columns={columns} pagination={false} scroll={{ x: 'max-content', y: 650 }} />
    );
  };

  const [emplyeeId = '', emplyeeName = ''] = dataList[0] && dataList[0].expman.split('-') || [];
  return (
    <div className={styles.list}>
      <div className={styles.header}>纳铁福只能收单柜</div>
      <div className={styles.body}>
        <div className={styles.userInfo}>
          <div className={styles.infoItem}>姓名：<span className={styles.infoVal}>{emplyeeName}</span></div>
          <div className={styles.infoItem}>工号：<span className={styles.infoVal}>{emplyeeId}</span></div>
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
