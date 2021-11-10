import React, { FC, useEffect, useState } from 'react';
import { Table, Button, message, Modal, Input } from 'antd';
import classNames from 'classnames';
import Loading from '@/components/Loading';
import { useHistory } from 'react-router-dom';
import { getManageList } from '@/service/api';
import { drag } from '@/utils/utils';
import styles from './index.less';
import imgPlaceholder from '@/assets/placeholder-1.jpeg';
import { v4 as uuidv4 } from 'uuid';

const { Column, ColumnGroup } = Table;

const List: FC = () => {
  const history: any = useHistory();
  const [dataList, setDataList] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const [text, setText] = useState('');
  //   image state
  const [currentImg, setCurrentImg] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(0);
  const [rotate, setRotate] = useState(0);

  const getDataList = async () => {
    setShowLoading(true);
    const res = await getManageList(text);
    if (res?.code === 200) {
      setDataList(res.data.length ? res.data : []);
    } else {
      setTipVisible(true);
      message.error('列表请求错误!');
    }
    setShowLoading(false);
  }
  useEffect(() => {
    getDataList();
  }, []);

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

  const handleImgClick = (img: string) => {
    console.log('handle img click', img);
    setImageModalVisible(true);
    setCurrentImg(img);
  }

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
  
  const renderTable = () => {
    return dataList.map((item: any) => {
      if (!item?.dataList?.length) {
        return null;
      }
      return (
        <div key={item.orderNum}>
          <h3 className={styles.tableTitle}>单据号：{item.orderNum}</h3>
          <Table
            rowKey={(record) => {
              return record?.originalOCRDetail?.code;
            }}
            dataSource={item?.dataList}
            pagination={false}
            scroll={{ x: 'max-content', y: 510 }}
            rowClassName={() => 'editable-row'}
          >
            <ColumnGroup title="图片">
              <Column width={100} dataIndex="imagePath" key={uuidv4()} render={(text: any, record: any, index: number) => {
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
                width={120}
                key={uuidv4()}
                render={(text: any, record: any, index: number) => {
                  return record.expensesDetail?.invoiceno || '-';
                }}
              />
            </ColumnGroup>
            <ColumnGroup title="报销系统">
              <Column
                title="发票号"
                width={120}
                key={uuidv4()}
                render={(text: any, record: any, index: number) => {
                return record.expensesDetail?.invoicenumber || '-';
                }}
              />
              <Column
                title="代码"
                width={120}
                key={uuidv4()}
                render={(text: any, record: any, index: number) => {
                return record.expensesDetail?.invoicecode || '-';
                }}
              />
              <Column
                title="金额"
                width={50}
                key={uuidv4()}
                render={(text: any, record: any, index: number) => record.expensesDetail?.amount || '-'}
              />
            </ColumnGroup>
            <ColumnGroup title="收单柜">
              <Column
                title="发票号"
                width={150}
                key={uuidv4()}
                render={(text: any, record: any, index: number) => {
                  return record.ocrDetail?.number || '-';
                }}
              />
              <Column
                title="代码"
                width={150}
                key={uuidv4()}
                render={(text: any, record: any, index: number) => {
                  return record.ocrDetail?.code || '-';
                }}
              />
              <Column
                title="金额"
                width={150}
                key={uuidv4()}
                render={(text: any, record: any, index: number) => {
                  return record.ocrDetail?.total || '-';
                }}
              />
              <Column
                title="备注"
                width={150}
                key={uuidv4()}
                render={(text: any, record: any, index: number) => {
                  return record?.remark || null;
                }}
              />
            </ColumnGroup>
          </Table>
        </div>
      );
    });
  };

  const handleGoToLononpage = () => {
    setTipVisible(false);
    window.location.href = process.env.NODE_ENV === 'development' ? '/manage/logon' : '/shouDanGui/manage/logon';
  };

  return (
    <>
      <Loading show={showLoading} />
      <div className={styles.detail}>
        <div className={styles.header}>纳铁福智能收单柜</div>
        <div className={styles.body}>
          <div className={styles.search}>
            <span className={styles.label}>单据号：</span>
            <Input
                size="middle"
                placeholder="请输入单据号"
                className={styles.input}
                value={text}
                onChange={(e: any) => {
                  setText(e?.currentTarget?.value);
                }}
              />
            <Button type="primary" className={styles.btn} onClick={getDataList} size="middle">搜索</Button>
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
        <p className={styles.tipText} id="modalImgContainerId">
          获取报销列表失败，请重新登录！
        </p>
        <div className={styles.imgModalBtnContainer}>
          <Button type="primary" className={styles.btn} onClick={handleGoToLononpage} size="middle">确定，退出登录</Button>
        </div>
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
    </>
  );
}

export default List;
