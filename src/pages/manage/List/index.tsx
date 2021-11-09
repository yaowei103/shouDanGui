import React, { FC, useEffect, useState } from 'react';
import { Table, Button, message, Modal, Input } from 'antd';
import classNames from 'classnames';
import Loading from '@/components/Loading';
import { useHistory } from 'react-router-dom';
import { getManageList } from '@/service/api';
import styles from './index.less';
import imgPlaceholder from '@/assets/placeholder-1.jpeg';
import { v4 as uuidv4 } from 'uuid';

const { Column, ColumnGroup } = Table;

const List: FC = () => {
  const history: any = useHistory();
  const dataSource: any[] = [
    {
      "orderNum": "OEP202110220012",
      "dataList": null
    },
    {
        "orderNum": "TEP202110190003",
        "dataList": null
    },
    {
        "orderNum": "TEP202110220006",
        "dataList": [
            {
                "expensesDetail": null,
                "ocrDetail": {
                    "filePath": null,
                    "tax": "6.96",
                    "code": "3700171320",
                    "number": "45485581",
                    "total": "239.00",
                    "title": "山东增值税普通发票",
                    "stamp_info": "江西市南中区西龙假林酒店,37040219650319012501",
                    "seat": null,
                    "name": null
                },
                "originalOCRDetail": {
                    "filePath": null,
                    "tax": "6.96",
                    "code": "3700171320",
                    "number": "45485581",
                    "total": "239.00",
                    "title": "山东增值税普通发票",
                    "stamp_info": "江西市南中区西龙假林酒店,37040219650319012501",
                    "seat": null,
                    "name": null
                },
                "equalInvoiceNum": false,
                "equalInvoiceCode": false,
                "equalInvoiceMon": false,
                "imagePath": null,
                "mark": false
            },
            {
                "expensesDetail": {
                    "amount": 40.0,
                    "col1": "",
                    "col2": "",
                    "col3": "",
                    "col4": "",
                    "col5": "",
                    "invoicecode": "150001973910",
                    "invoiceno": "202109140004",
                    "invoicenumber": "39854918",
                    "name": "",
                    "tax": 0.0,
                    "trainl": "",
                    "unitname": "",
                    "unittaxno": ""
                },
                "ocrDetail": null,
                "originalOCRDetail": null,
                "equalInvoiceNum": false,
                "equalInvoiceCode": false,
                "equalInvoiceMon": false,
                "imagePath": null,
                "mark": false
            },
            {
                "expensesDetail": {
                    "amount": 5.0,
                    "col1": "",
                    "col2": "",
                    "col3": "",
                    "col4": "",
                    "col5": "",
                    "invoicecode": "132021991013",
                    "invoiceno": "202109140005",
                    "invoicenumber": "01406132",
                    "name": "",
                    "tax": 0.0,
                    "trainl": "",
                    "unitname": "",
                    "unittaxno": ""
                },
                "ocrDetail": null,
                "originalOCRDetail": null,
                "equalInvoiceNum": false,
                "equalInvoiceCode": false,
                "equalInvoiceMon": false,
                "imagePath": null,
                "mark": false
            },
            {
                "expensesDetail": {
                    "amount": 2064.0,
                    "col1": "",
                    "col2": "",
                    "col3": "",
                    "col4": "",
                    "col5": "",
                    "invoicecode": "5000204130",
                    "invoiceno": "202109140003",
                    "invoicenumber": "02876587",
                    "name": "",
                    "tax": 116.83,
                    "trainl": "",
                    "unitname": "无锡协智网络科技有限公司",
                    "unittaxno": "91320206MA1NP5YE02"
                },
                "ocrDetail": null,
                "originalOCRDetail": null,
                "equalInvoiceNum": false,
                "equalInvoiceCode": false,
                "equalInvoiceMon": false,
                "imagePath": null,
                "mark": false
            }
        ]
    },
    {
        "orderNum": "TEP202110220008",
        "dataList": null
    },
    {
        "orderNum": "TEP202110220012",
        "dataList": null
    }
  ];
  const [dataList, setDataList] = useState(dataSource);
  const [showLoading, setShowLoading] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  //   image state
  const [currentImg, setCurrentImg] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(0);
  const [rotate, setRotate] = useState(0);

  const getDataList = async () => {
    setShowLoading(true);
    const res = await getManageList(searchStr);
    if (res?.code === 200) {
      setDataList(res.data.length ? res.data : dataSource);
    } else {
      setTipVisible(true);
      message.error('列表请求错误!');
    }
    setShowLoading(false);
  }
  useEffect(() => {
    getDataList();
  }, []);

  const handleImgClick = (img: string) => {
    console.log('handle img click', img);
    setCurrentImg(img);
    setImageModalVisible(true);
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
    return dataList.map((item) => {
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
    window.location.href = process.env.NODE_ENV === 'development' ? '/' : '/shouDanGui/';
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
                value={searchStr}
                onChange={(e: any) => { setSearchStr(e.currentTarget.value); }}
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
        <p className={styles.imageModalContainer} id="modalImgContainerId">
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
