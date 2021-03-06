import React, { FC, useEffect, useState } from 'react';
import { Table, Button, message, Modal } from 'antd';
// import { Link } from 'react-router-dom';
import Loading from '@/components/Loading';
import { useHistory } from 'react-router-dom';
import { getList } from '@/service/api';
import styles from './index.less';

const List: FC = () => {
  const history: any = useHistory();
  const dataSource: any[] = [];
  const [dataList, setDataList] = useState(dataSource);
  const [showLoading, setShowLoading] = useState(true);
  const [tipVisible, setTipVisible] = useState(false);
  const [tipMsg, setTipMsg] = useState('');

  const user = history.location.state?.user;

  const getDataList = async () => {
    const res = await getList(user?.empcode);
    if (res?.code === 200) {
      if (res?.data?.atreturn?.length) {
        setDataList(res.data.atreturn);
      } else if (res?.data?.atreturn?.length === 0) {
        setTipVisible(true);
        setTipMsg('该用户无可报销单据，请重新登录！');
      } else if (res.data.code === 502) {
        setTipVisible(true);
        setTipMsg('OA服务异常，请联系管理员！');
      } else {
        setTipVisible(true);
        setTipMsg(res?.data?.message || '获取报销列表失败，请重新登录！');
        message.error('列表请求错误!');
      }
    } else {
      setTipVisible(true);
      setTipMsg('获取报销列表失败，请重新登录！');
      message.error('列表请求错误!');
    }
    setShowLoading(false);
  }
  useEffect(() => {
    getDataList();
  }, []);

  const columns = [
    {
      title: '单据号',
      dataIndex: 'billno',
      key: 'billno',
      width: 240,
    },
    {
      title: '报销金额',
      dataIndex: 'expmoney',
      key: 'expmoney',
      width: 150,
    },
    {
      title: '名称',
      dataIndex: 'col1',
      key: 'col1',
      ellipsis: true,
    },
    {
      title: '发票金额',
      dataIndex: 'invmoney',
      width: 150,
      key: 'invmoney',
    },
    {
      title: '申请日期',
      width: 170,
      dataIndex: 'reqdate',
      key: 'reqdate',
    },
    {
      title: '发票数量',
      dataIndex: 'invnums',
      width: 150,
      key: 'invnums',
    },
    {
      title: '操作',
      width: 150,
      key: 'id',
      render: (text: any, record: any, index: number) => {
        return (
          <Button type="primary" onClick={() => { handleTableRowClick(record); }} size="large" className="login-form-button">
            投递单据
          </Button>
        );
      }
    },
  ];
  const handleTableRowClick = (record: any) => {
    console.log('row click: ', record);
    history.push('/detail', { record, user: history.location.state.user });
  };
  const renderTable = () => {
    return (
      <Table
        rowKey={(record) => record.billno}
        dataSource={dataList}
        bordered
        columns={columns}
        pagination={false}
        scroll={{ x: 'max-content', y: 765 }} />
    );
  };

  const handleGoToLononpage = () => {
    setTipVisible(false);
    window.location.href = process.env.NODE_ENV === 'development' ? '/' : '/shouDanGui/';
  };

  const [emplyeeId = '', emplyeeName = ''] = dataList[0] && dataList[0].expman.split('-') || [];
  return (
    <>
      <Loading show={showLoading} />
      <div className={styles.list}>
        <div className={styles.header}>纳铁福智能收单柜</div>
        <div className={styles.body}>
          <div className={styles.userInfo}>
            <div className={styles.infoItem}>姓名：<span className={styles.infoVal}>{user?.cnname || '-'}</span></div>
            <div className={styles.infoItem}>工号：<span className={styles.infoVal}>{user?.empcode || '-'}</span></div>
          </div>
          <div className={styles.table}>
            {renderTable()}
          </div>
          <div className={styles.bottomBtn}>
            <Button type="primary" className={styles.btn} onClick={handleGoToLononpage} size="large">退出登录</Button>
          </div>
        </div>
        <div className={styles.footer}>@纳铁福版权所有</div>
      </div>
      <Modal
        className={styles.modalBody}
        title="提示"
        width={720}
        visible={tipVisible}
        // onOk={handleGoToLononpage}
        // confirmLoading={confirmLoading}
        // onCancel={handleModalCancel}
        closable={false} // 右上角关闭按钮
        // okText="确定，退出登录"
        // cancelText={''}
        maskClosable={false} // 点击蒙层关闭
        footer={false}
        centered // 垂直居中
      >
        <p className={styles.imageModalContainer} id="modalImgContainerId">
          {tipMsg}
        </p>
        <div className={styles.imgModalBtnContainer}>
          <Button type="primary" className={styles.btn} onClick={handleGoToLononpage} size="large">确定，退出登录</Button>
        </div>
      </Modal>
    </>
  );
}

export default List;
