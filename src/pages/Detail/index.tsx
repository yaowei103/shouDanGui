import React, { FC, useEffect, useRef, useState } from 'react';
import { Modal, Table, Button, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import styles from './index.less';
import { resetDevice, getStatusAndScan, openDevice, outAndResore, unlock, retain } from '@/components/pagerScanner';
import { sendImage, submitData } from '@/service/api';
import { drag, mergeDetailData } from '@/utils/utils';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import icon from '@/assets/icon-down.png';
import imgPlaceholder from '@/assets/placeholder-1.jpeg';

const { Column, ColumnGroup } = Table;

const Detail: FC = () => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentImg, setCurrentImg] = useState('');
  const [rotate, setRotate] = useState(0);
  const [currentWidth, setCurrentWidth] = useState(0);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [submitDisable, setSubmitDisable] = useState(false);

  const history: any = useHistory();
  // 硬件对象
  const ist = window.ist;
  // dummy data
  const { empcode, cnname } = history.location.state?.user || {};
  const { sid, billno } = history.location.state?.record || {};
  console.log('statlocatione:', history.location);

  // const imgEle = useRef('modalImg');

  const modalMsgInit = '请将单据整理好，带有二维码的封面放在第一页，然后封面朝上放入收单柜。';
  const [modalMsg, setModalMsg] = useState(modalMsgInit)


  interface State {
    dataSource: any[];
    sendExpenseError: any;
  }

  const [state, setState] = useState<State>({
    dataSource: [],
    sendExpenseError: {},
  });

  // 图片预览
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

  // 打开扫描仪
  useEffect(() => {
    // 开启扫描仪
    const openResult = openDevice(ist);
    if (openResult.result !== 0) {
      resetDevice(ist);
    }
  }, []);

  const handleDetailData = (data: any) => {
    console.log('api resonse detail data: ', data);
    const formatResult = data.compareDataList.map((item: any) => {
      item.id = uuidv4();
      if (item.ocrDetail === null) {
        item.ocrDetail = {};
      }
      if (item.expensesDetail === null) {
        item.expensesDetail = {};
      }
      return item;
    });
    setState({
      ...state,
      dataSource: formatResult,
      sendExpenseError: data.sendExpenseError,
    })
  };

  const handleSubmit = async () => {
    const reqBody = {
      orderNum: billno,
      dataList: state.dataSource,
      sendExpenseError: state.sendExpenseError,
    };
    console.log('submitData:', reqBody);
    setSubmitDisable(true);
    const submitResult = await submitData(reqBody);
    setSubmitDisable(false);
    if (submitResult.code === 200) {
      if (submitResult.data) {
        const retainResult = await retain(ist);
        if (retainResult.result === 0) {
          message.success('提交成功');
          window.location.href = process.env.NODE_ENV === 'development' ? '/' : '/shouDanGui/';
        }
      } else {
        message.error('单据提交异常，正在退出单据，请收好单据并联系管理员！');
        handleCancelAndOutpaper();
      }
    } else {
      message.error('提交失败，请重新提交')
    }
  };

  const scanPapers: any = async () => {
    console.log('注册监听函数');
    ist.off('onScanPage');
    const imgList: any[] = [];
    ist.on('onScanPage', (res: any) => {
      const {
        // back_image_base64,
        front_image_base64,
      } = res;
      console.log('监听函数返回，正面图片', front_image_base64);
      if (front_image_base64) {
        imgList.push(`data:image/png;base64,${front_image_base64}`);
      }
      // setPaperBase64List(oldList);
    });
    console.log('开始获取状态并扫描');
    const getStatusAndScanResult = await getStatusAndScan(ist);
    console.log('扫描完成，结果：', getStatusAndScanResult);
    if (getStatusAndScanResult?.result === 0) {
      message.success('扫描完成，正在识别您的单据，请耐心等待！');
      setModalMsg('扫描完成，正在识别您的单据，请耐心等待！');
      console.log('扫描完成，正在识别您的单据，请耐心等待！');
      return imgList;
    } else if (getStatusAndScanResult?.result === -10) {
      // message.error('扫描过程卡纸，请解决卡纸');
      setModalMsg('扫描过程卡纸，请解决卡纸');
      return [];
    } else {
      message.error('扫描出错');
      resetDevice(ist);
      setModalMsg('扫描出错，请将单据整理好，重新放入扫描窗口，并点击确定重新扫描！');
      return [];
    }
    
  };

  const handleModalOk = async () => {
    if (confirmLoading) {
      return;
    }
    setConfirmLoading(true);
    // 扫描
    const scanPaperResult: any[] = await scanPapers();
    // 扫描成功
    if (scanPaperResult?.length > 0) {
      // 扫描成功，通过api获取识别结果
      const sendImageResult: any = await sendImage(empcode, sid, billno, scanPaperResult);
      console.log('识别图片完成：', sendImageResult);
      if (sendImageResult?.code === 200 && sendImageResult.data?.compareDataList.length > 0) {
        setConfirmLoading(false);
        setVisible(false);
        handleDetailData(sendImageResult.data);
      } else {
        setConfirmLoading(false);
        setModalMsg(`${sendImageResult?.message || '服务器内部错误'}，请将单据整理好，重新放入扫描窗口，并点击确定重新扫描！`);
      }
    } else {
      setConfirmLoading(false);
    }
  };

  const handleCancelAndOutpaper = async () => {
    console.log('Clicked cancel button');
    const outResult = await outAndResore(ist);
    if (outResult.result === 0) {
      setVisible(false);
      // history.push('/', {});
      const url = process.env.NODE_ENV === 'development' ? '/' : '/shouDanGui/';
      console.log('退出成功，跳转页面', url);
      window.location.href = url;
    } else {
      // message.error('退出文件失败，请重新退出');
      resetDevice(ist);
    }
  };

  // 修改数据
  const handleCellChange = (val: string, field: string, i: number) => {
    console.log('val, field, i', val, field, i);
    const newDataSource = [...state.dataSource];
    newDataSource[i].ocrDetail[field] = val;
    // 合并数据 并setState
    const mergeResult = mergeDetailData(newDataSource, i);
    setState({
      ...state,
      dataSource: mergeResult,
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
        rowKey={(record) => record?.id}
        dataSource={state.dataSource}
        pagination={false}
        scroll={{ x: 'max-content', y: 510 }}
        rowClassName={() => 'editable-row'}
      >
        <ColumnGroup title="图片">
          <Column width={120} dataIndex="imagePath" key="id" render={(text: any, record: any, index: number) => {
            if (
              record.expensesDetail?.invoicenumber === record.ocrDetail?.number &&
              record.expensesDetail?.invoicecode === record.ocrDetail?.code ||
              Object.keys(record.expensesDetail || {}).length <= 0
            ) {
              return <img
                onClick={() => { handleImgClick(record.imagePath || imgPlaceholder) }}
                src={record.imagePath || imgPlaceholder}
                title="图片"
              />
            } else {
              return '';
            }
          }} />
        </ColumnGroup>
        <ColumnGroup title="流水号">
          <Column
            key="id"
            render={(text: any, record: any, index: number) => {
              return record.expensesDetail?.invoiceno || '-';
            }}
          />
        </ColumnGroup>
        <ColumnGroup title="报销系统">
          <Column
            title="发票号"
            key="id"
            render={(text: any, record: any, index: number) => {
              return record.expensesDetail?.invoicenumber || '-';
            }}
          />
          <Column
            title="代码"
            key="id"
            render={(text: any, record: any, index: number) => {
              return record.expensesDetail?.invoicecode || '-';
            }}
          />
          <Column
            title="金额"
            key="id"
            render={(text: any, record: any, index: number) => record.expensesDetail?.amount || '-'}
          />
        </ColumnGroup>
        <ColumnGroup title="收单柜">
          <Column
            title="发票号"
            width={150}
            key="id"
            render={(text: any, record: any, index: number) => {
              const flag = record.expensesDetail.invoicenumber !== record.ocrDetail.number && Object.keys(record.expensesDetail || {}).length <= 0;
              return <div className={classNames(styles.inputDiv, flag ? styles.diffFlag : {})}>
                <Input
                  size="middle"
                  placeholder="-"
                  className={styles.input}
                  value={record.ocrDetail?.number}
                  disabled={Object.keys(record.expensesDetail || {}).length > 0}
                  onChange={(e: any) => { handleCellChange(e.currentTarget.value, 'number', index); }}
                />
              </div>;
            }}
          />
          <Column
            title="代码"
            width={150}
            key="id"
            render={(text: any, record: any, index: number) => {
              const flag = record.expensesDetail.invoicecode !== record.ocrDetail.code && Object.keys(record.expensesDetail || {}).length <= 0;
              return <div className={classNames(styles.inputDiv, flag ? styles.diffFlag : {})}>
                <Input
                  size="middle"
                  className={styles.input}
                  placeholder="-"
                  value={record.ocrDetail?.code}
                  disabled={Object.keys(record.expensesDetail || {}).length > 0}
                  onChange={(e: any) => { handleCellChange(e.currentTarget.value, 'code', index); }}
                />
              </div>;
            }}
          />
          <Column
            title="金额"
            width={150}
            key="id"
            render={(text: any, record: any, index: number) => {
              const flag = (record.expensesDetail.amount !== record.ocrDetail.total && Object.keys(record.expensesDetail || {}).length <= 0) || (record.expensesDetail.invoicenumber === record.ocrDetail.number && record.expensesDetail.invoicecode === record.ocrDetail.code && record.expensesDetail.amount !== Number(record.ocrDetail.total));
              return <div className={classNames(styles.inputDiv, flag ? styles.diffFlag : {})}>
                <Input
                  size="middle"
                  className={styles.input}
                  placeholder="-"
                  value={record.ocrDetail?.total}
                  // disabled={Object.keys(record.expensesDetail || {}).length > 0}
                  onChange={(e: any) => { handleCellChange(e.currentTarget.value, 'total', index); }}
                />
              </div>;
            }}
          />
          <Column
            title="备注"
            width={150}
            key="id"
            render={(text: any, record: any, index: number) => {
              return record?.remark || null;
            }}
          />
        </ColumnGroup>
      </Table>
    );
  };

  return (
    <div className={styles.detail}>
      <div className={styles.header}>纳铁福智能收单柜</div>
      <div className={styles.body}>
        <div className={styles.userInfo}>
          <div className={styles.infoItem}>姓名：<span className={styles.infoVal}>{cnname}</span></div>
          <div className={styles.infoItem}>工号：<span className={styles.infoVal}>{empcode}</span></div>
          <div className={styles.infoItem}>单据号：<span className={styles.infoVal}>{billno}</span></div>
          <div className={styles.infoItem}>报销人：<span className={styles.infoVal}>{cnname}</span></div>
        </div>
        <div className={styles.table}>
          {renderTable()}
        </div>
        <div className={styles.btnContainer}>
          <Button type="default" onClick={handleCancelAndOutpaper} size="large">
            取消并退出单据
          </Button>
          <Button className={styles.pageBtn} type="primary" disabled={submitDisable} onClick={handleSubmit} size="large">
            确认并投递
          </Button>
        </div>
      </div>
      <div className={styles.footer}>@纳铁福版权所有</div>
      <Modal
        className={styles.modalBody}
        title="提示"
        width={720}
        visible={visible}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancelAndOutpaper}
        closable={false} // 右上角关闭按钮
        okText="确定，开始识别单据"
        cancelText="取消，退出登录"
        maskClosable={false} // 点击蒙层关闭
        centered // 垂直居中
      >
        <p className={styles.tipContent}>
          <img src={icon} />
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
