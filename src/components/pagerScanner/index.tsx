import { message, Result } from 'antd';

export const openDevice: any = async (scr: any, maxTimes: number | undefined = 10) => {
  var result = await scr.openDevice({
    scanner: true,
    ist: true,
  });
  if (result.result == 0) {
    console.log("打开设备成功");
    return result;
  } else if (maxTimes <= 0 && result.result === -1) {
    message.error('打开扫描仪错误，已尝试10次！请联系管理员');
    return result;
  } else {
    console.log("openScanner发生错误:", result.message, `正在第${11 - maxTimes}次重新打开`);
    return await openDevice(scr, maxTimes - 1);
  }
}

export const resetDevice: any = async (scr: any, maxTimes: number | undefined = 10) => {
  var result = await scr.resetDevice();
  if (result.result === 0) {
    console.log("重置设备成功");
    return result;
  } else if (maxTimes < 0 && result.result !== 0) {
    message.error('重置扫描发生错误，以尝试10次！');
    return result;
  } else {
    console.log("重置设备发生错误，正在重新尝试:" + result.message);
    return await resetDevice(scr, maxTimes - 1);
  }
}

export const scan: any = async (scr: any, maxTimes: number | undefined = 10) => {
  var param = {
    image_base64: true,
  };
  var result = await scr.scan(param);
  if (result.result == 0) {
    console.log("扫描完成");
    return result;
  } else if (result.result === 5) {
    message.error('卷纸异常');
    return result;
  } else if (result.result === 20) {
    message.error('卡纸, 请解决卡纸');
    await unlock(scr);
    return result;
  } else if (result.result === 29) {
    message.error('无纸, 请放入纸张');
    return result;
  } else if (result.result === -1 && maxTimes <= 0) {
    message.error('扫描发生错误，以尝试10次！');
    return result;
  } else {
    console.log("扫描发生错误:", result.message, `正在第${11 - maxTimes}次重新打开`);
    return await scan(scr, maxTimes - 1);
  }
}

export const unlock = async (scr: any) => {
  var result = await scr.call("unlock");
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("弹出扫描仪成功");
    message.success('弹出扫描仪成功');
  } else {
    console.log("unlock()发生错误:" + result.message);
    message.success('弹出扫描仪发生错误');
  }
}

export const retain = async (scr: any) => {
  var result = await scr.call("retain");
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("存入文件成功");
    message.success('存入文件成功');
  } else {
    console.log("retain()发生错误:" + result.message);
    message.success('存入文件发生错误');
  }
}

export const trayUp = async (scr: any) => {
  var result = await scr.call("tray_up");
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("升降台上升成功");
  } else {
    console.log("trayUp()发生错误:" + result.message);
  }
}

export const trayDown = async (scr: any) => {
  var result = await scr.call("tray_down");
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("升降台下降成功");
  } else {
    console.log("trayDown()发生错误:" + result.message);
  }
}

export const closeDevice = async (scr: any) => {
  var result = await scr.closeDevice();
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("关闭设备成功");
  } else {
    console.log("closeDevice()发生错误:" + result.message);
  }
}

export const getStatus: any = async (scr: any, maxTimes: number | undefined = 10) => {
  var result = await scr.getStatus();
  if (result.result == 0) {
    console.log("获取状态成功");
    return result;
  } else if (maxTimes < 0 && result.result !== 0) {
    console.log('获取状态发生错误，请联系管理员');
    message.error('获取状态发生错误，请联系管理员');
  } else {
    console.log("获取状态发生错误, 正在重新尝试:" + result.message);
    return await getStatus(scr, maxTimes - 1);
  }
}

export const getSensorStatus: any = async (scr: any, maxTimes: number | undefined = 50) => {
  var result = await scr.call("get_sensor_status");
  console.log('获取获取传感器状态成功：', result);
  if (result.result == 0) {
    return result;
  } else if (maxTimes < 0 && result.result !== 0) {
    message.error('获取传感器错误，请退出重试！');
    console.log('获取传感器错误，请退出重试！');
    return result;
  } else {
    console.log("getSensorStatus()发生错误:" + result.message);
    return await getSensorStatus(scr, maxTimes - 1);
  }
}

export const getStatusAndScan: any = async (scr: any, maxTimes: number | undefined = 1) => {
  const status = await getStatus(scr);
  console.log('getStatusAndScan status', status);
  // 状态正常或者前盖打开， 并且扫描口有纸
  if ((status?.status === 0 || status?.status === -20) && status?.feeder) {
    // 状态正常，可以读卡
    return await scan(scr);
  } else if (maxTimes <= 0 && status?.status !== 0 && status?.status !== -20) {
    console.log('getStatusAndRead error, 超时, status.status:', status?.status, 'status.feeder:', status?.feeder);
    if (status?.status > 0) {
      console.log('扫描设备警告');
    }
    message.error('扫描超时，请退出重试');
  } else {
    await openDevice(scr);
    await resetDevice(scr);
    return await getStatusAndScan(scr, maxTimes - 1);
  }
};

// 2.retain就是存入。 也会触发托盘弹出
// 3.eject是打开闸门然后托盘出去,退票。
// 4.restore是关闸门,把托盘收回来。
// 还有个unlock,这个是卡纸之后调用这个扫描仪会弹出来,可以处理卡纸。

export const eject: any = async (scr: any) => {
  var result = await scr.call("eject");
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("退出文件成功");
    return result;
  } else {
    console.log("eject()发生错误:" + result.message);
    return result;
  }
}

export const restore: any = async (scr: any) => {
  var result = await scr.call("restore");
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("收回托盘成功");
    return result;
  } else {
    console.log("restore()发生错误:" + result.message);
    return await restore(scr);
  }
}

export const outAndResore: any = async (scr: any, maxTimes: number | undefined = 50) => {
  const ejectResult = await eject(scr);
  // 退出成功
  if (ejectResult.result === 0) {
    // 监测是否取走纸张
    const getSensorStatusResult = await getSensorStatus(scr);
    if (getSensorStatusResult.result === 0 && getSensorStatusResult?.sensor?.sensor1 === 0) {
      return await restore(scr);
    }
  } else if (maxTimes < 0) {
    console.log('退出文件失败，已经尝试50次，请联系管理员');
    return ejectResult;
  } else {
    return await outAndResore(scr, maxTimes - 1);
  }
};