import React, { FC, useEffect, useState } from 'react';
import { Modal, Table, Button, Input, message } from 'antd';
import { useLocation } from 'react-router-dom';
import styles from './index.less';
import { openAndScan } from '@/components/pagerScanner';
import { sendImage } from '@/service/api';
import { drag } from '@/utils/utils';

const { Column, ColumnGroup } = Table;

const Detail: FC = () => {
  const location: any = useLocation();
  const { empId, orderId, orderNum } = location.state;
  console.log('statlocatione:', location);

  const [visible, setVisible] = useState(true);

  // const imgEle = useRef('modalImg');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentImg, setCurrentImg] = useState('');
  const [rotate, setRotate] = useState(0);
  const [currentWidth, setCurrentWidth] = useState(0);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [paperUrls, setPaperUrls] = useState([]);

  const modalMsgInit = '请将单据整理好，带有二维码的封面放在第一页，然后封面朝下放入收单柜。';
  const [modalMsg, setModalMsg] = useState(modalMsgInit)

  const dataSource = [
    { id: 'DJ1111111122', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
    // { id: 'DJ1111111133', b: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0716%252F149a58c6p00qwbvjw0017c000gj008fm.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636038525&t=a1a04c7e827f4e2131d9ef0a30447fac', c: '1234567890', d: 1234567890, e: '200', f: 'BJ12345', g: 1234567, h: 200 },
  ];

  const [state, setState] = useState({
    dataSource
  });

  useEffect(() => {
    setTimeout(() => {
      const ele: any = document.getElementById('modalImgId');
      const width = ele && ele.width;
      const height = ele && ele.height;
      if (ele) {
        drag(ele, { l: -width * 0.8, r: width * 0.9, t: -height * 0.8, b: height * 1.4 });
      }
    }, 1000)
  }, [imageModalVisible, currentWidth]);

  const handleSubmit = () => {
    const submitData = state.dataSource;
    console.log('submitData:', submitData);
  };

  const scanPapers: any = async () => {
    const scr = new window.BOCardReader({ "device": 'SCR' });
    scr.on('onScanPage', (res: any) => {
      const {
        back_image,
        // back_image_height,
        // back_image_width, 
        // dpi, 
        front_image,
        // front_image_height, 
        // front_image_width, 
        // device = 'SCR'
      } = res;
      console.log('正面图片路径', front_image);
      console.log('反面图片路径', back_image);
      const oldUrls: any = [...paperUrls, back_image];
      setPaperUrls(oldUrls);
    });
    const openAndScanResult = await openAndScan(scr);
    if (openAndScanResult.result === 0) {
      message.success('扫描完成, 正在识别您的单据');
      return true;
    } else {
      message.error('扫描出错，请整理好单据，重新放入扫描窗口再次扫描');
      return false;
    }
  };

  const handleModalOk = async () => {
    setConfirmLoading(true);
    if (confirmLoading) {
      return;
    }
    // 扫描
    const scanPaperResult = await scanPapers();
    if (scanPaperResult) {
      // 扫描成功，通过api获取识别结果
      setModalMsg('扫描完成，正在识别您的单据，请耐心等待！');
      console.log('扫描完成，正在识别您的单据，请耐心等待！');
      const sendImageResult: any = sendImage(empId, orderId, orderNum);
      console.log('识别图片完成：', sendImageResult);
      if (sendImageResult.status === 200) {
        setConfirmLoading(false);
        setVisible(false);
      }
    } else {
      setModalMsg('扫描出错，请将单据整理好，重新放入扫描窗口，并点击确定重新扫描！');
      setConfirmLoading(false);
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
    setState({
      dataSource: newDataSource
    })
  };

  const handleImgClick = (img: string) => {
    console.log('handle img click', img);
    setCurrentImg(img);
    setImageModalVisible(true);
  }

  const handleImgModelHide = () => {
    console.log('handle img click');
    setCurrentImg('');
    setRotate(0);
    setCurrentWidth(0);
    setImageModalVisible(false);
    const ele = document.getElementById('modalImgId');
    if (ele) {
      ele.style.top = '0';
      ele.style.left = '0';
    }
  };

  // 放大按钮
  const handleBiggerClick = () => {
    const ele = document.getElementById('modalImgId');
    const width = ele && ele.clientWidth || 0;
    setCurrentWidth(width * 1.05);
  };

  // 缩小按钮
  const handleSmallerClick = () => {
    const ele = document.getElementById('modalImgId');
    const width = ele && ele.clientWidth || 0;
    setCurrentWidth(width * 0.95);
  };

  const handleRotateClick = () => {
    setRotate(rotate + 90);
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
            return <img onClick={() => { handleImgClick(record.b) }} src={record.b} />
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
          {modalMsg}
        </p>
      </Modal>
      <Modal
        className={styles.imageModal}
        title=""
        visible={imageModalVisible}
        width={800}
        // onOk={handleModalOk}
        // confirmLoading={confirmLoading}
        onCancel={handleImgModelHide}
        closable={true} // 右上角关闭按钮
        // okText="确定，开始识别单据"
        // cancelText="取消，退出登录"
        maskClosable={true} // 点击蒙层关闭
        centered // 垂直居中
        footer={false}
      >
        <p className={styles.imageModalContainer} id="modalImgContainerId">
          <img id="modalImgId" src={currentImg} className={styles.modalImg} style={{ transform: `rotate(${rotate}deg)`, width: `${currentWidth ? `${currentWidth}px` : 'auto'}` }} />
        </p>
        <div className={styles.imgModalBtnContainer}>
          <Button type="primary" className={styles.btn} onClick={handleBiggerClick} size="middle">放大</Button>
          <Button type="primary" className={styles.btn} onClick={handleSmallerClick} size="middle">缩小</Button>
          <Button type="primary" className={styles.btn} onClick={handleRotateClick} size="middle">旋转</Button>
        </div>
      </Modal>
    </div>
  );
}

export default Detail;
