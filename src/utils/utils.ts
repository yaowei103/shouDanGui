export const drag = (obj: any, sent: any) => {

  var dmW = document.documentElement.clientWidth || document.body.clientWidth;
  var dmH = document.documentElement.clientHeight || document.body.clientHeight;

  var sent = sent || {};
  var l = sent.l || 0;
  var r = sent.r || dmW - obj.offsetWidth;
  var t = sent.t || 0;
  var b = sent.b || dmH - obj.offsetHeight;
  // var n = sent.n || 10;

  obj.onmousedown = function (ev: any) {
    console.log('mousedown');
    var oEvent = ev || event;
    var sentX = oEvent.clientX - obj.offsetLeft;
    var sentY = oEvent.clientY - obj.offsetTop;

    document.onmousemove = function (ev) {
      var oEvent = ev || event;
      console.log('mousemove');
      var slideLeft = oEvent.clientX - sentX;
      var slideTop = oEvent.clientY - sentY;

      if (slideLeft <= l) {
        slideLeft = l;
      }
      if (slideLeft >= r) {
        slideLeft = r;
      }
      if (slideTop <= t) {
        slideTop = t;
      }
      if (slideTop >= b) {
        slideTop = b;
      }

      obj.style.left = slideLeft + 'px';
      obj.style.top = slideTop + 'px';

      // document.getElementById('posTop').innerHTML = slideTop;
      // document.getElementById('posLeft').innerHTML = slideLeft;

    };
    document.onmouseup = function () {
      console.log('mouseup');
      document.onmousemove = null;
      document.onmouseup = null;
    }

    return false;
  }
}

export const mergeDetailData = (data: any[], mergeFromIndex: number) => {
  const newData = [...data];
  let mergeToIndex = 0;
  // 修改的数据的 ocr数据
  const mergeFromItem = newData[mergeFromIndex];
  const changeItemOcrDetail = mergeFromItem.ocrDetail;

  // 循环数组，找到要 合并到 的item；
  const mergeToItem = newData?.find((item, index) => {
    const { expensesDetail } = item;
    // 核对发票号和代码号，相同的记录合并
    if (
      expensesDetail.invoicecode === changeItemOcrDetail?.code &&
      expensesDetail.invoicenumber === changeItemOcrDetail?.number
      // expensesDetail.amount === ocrDetail?.total &&
      // Object.keys(ocrDetail).length <= 0
    ) {
      mergeToIndex = index;
      item.remark = '已修改';
      return item;
    }
  });
  // 如果没找到就返回原来的数组
  if (Object.keys(mergeToItem || {}).length <= 0) {
    return newData;
  }
  if (Object.keys(mergeFromItem.expensesDetail || {}).length > 0) {
    return newData;
  }

  // 合并找到的数据
  newData[mergeToIndex].imagePath = newData[mergeFromIndex].imagePath;
  newData[mergeToIndex].ocrDetail = newData[mergeFromIndex].ocrDetail;
  // newData[mergeToIndex].ocrDetail['code'] = newData[mergeFromIndex].ocrDetail.code;
  // newData[mergeToIndex].ocrDetail['code'] = newData[mergeFromIndex].ocrDetail.code;
  // 删除 识别出来的数据
  newData?.splice(mergeFromIndex, 1);
  return newData;
};