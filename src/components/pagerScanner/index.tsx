export const openDevice: any = async (scr: any) => {
  var result = await scr.openDevice();
  if (result.result == 0) {
    console.log("打开设备成功");
    return result;
  } else {
    console.log("打开设备发生错误:" + result.message);
    return await openDevice(scr);
  }
}

export const resetDevice: any = async (scr: any) => {
  var result = await scr.resetDevice();
  if (result.result == 0) {
    console.log("重置设备成功");
    return result;
  } else {
    console.log("重置设备发生错误:" + result.message);
    return await resetDevice(scr);
  }
}

export const scan: any = async (scr: any) => {
  var url1 = ".\\scanPic\\" + "20210624" + '_' + "111" + ".jpg";
  var url2 = ".\\scanPic\\" + "20210624" + '_' + "222" + ".jpg";
  var param = {
    front_image: url1,
    back_image: url2,
    type: 'a4', // a4 扫描a4纸，invoice扫描抵扣联
  };
  var result = await scr.scan(param);
  if (result.result == 0) {
    console.log("扫描完成");
    return result;
  } else {
    console.log("扫描发生错误:" + result.message);
    return await scan(scr);
  }
}

export const openAndScan: any = async (scr: any) => {
  const openResult = await openDevice(scr);
  if (openResult.result === 0) {
    const scanResult = await scan(scr);
    if (scanResult.result === 0) {
      await closeDevice(scr);
      return scanResult;
    }
  }
};

export const closeDevice: any = async (scr: any) => {
  var result = await scr.closeDevice();
  if (result.result == 0) {
    console.log("关闭设备成功");
    return result;
  } else {
    console.log("发生错误:" + result.message);
    return await closeDevice(scr);
  }
}

export const getStatus: any = async (scr: any) => {
  var result = await scr.getStatus();
  if (result.result == 0) {
    console.log("获取状态成功");
    return result;
  } else {
    console.log("获取状态发生错误:" + result.message);
    return await getStatus(scr);
  }
}

