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

  const getDataList = async () => {
    const res = await getList(history.location.state?.user?.empcode);
    if (res?.code === 200) {
      setDataList(res.data.atreturn.length ? res.data.atreturn : dataSource);
    } else {
      setTipVisible(true);
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
      dataIndex: 'name',
      key: 'name',
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
      width: 150,
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
    history.push('/detail', { record, user: history.location.state.user });
  };
  const renderTable = () => {
    return (
      <Table
        rowKey={(record) => record.billno}
        dataSource={dataList}
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
            <div className={styles.infoItem}>姓名：<span className={styles.infoVal}>{emplyeeName}</span></div>
            <div className={styles.infoItem}>工号：<span className={styles.infoVal}>{emplyeeId}</span></div>
          </div>
          <div className={styles.table}>
            {renderTable()}
          </div>
        </div>
        <div className={styles.footer}>@纳铁福版权所有</div>
      </div>
      <Modal
        className={styles.modalBody}
        title="提示"
        width={720}
        visible={tipVisible}
        onOk={handleGoToLononpage}
        // confirmLoading={confirmLoading}
        // onCancel={handleModalCancel}
        closable={false} // 右上角关闭按钮
        okText="确定，退出登录"
        cancelText={''}
        maskClosable={false} // 点击蒙层关闭
        footer={false}
        centered // 垂直居中
      >
        <p className={styles.imageModalContainer} id="modalImgContainerId">
          获取报销列表失败，请重新登录！
        </p>
        <div className={styles.imgModalBtnContainer}>
          <Button type="primary" className={styles.btn} onClick={handleGoToLononpage} size="middle">确定，退出登录</Button>
        </div>
      </Modal>
    </>
  );
}

export default List;
