import { message } from 'antd';

export const openDevice: any = async (scr: any) => {
  var result = await scr.openDevice({
    scanner: true,
    ist: true,
  });
  if (result.result == 0) {
    console.log("打开设备成功");
  } else {
    console.log("openScanner发生错误:", result);
    message.error('打开扫描仪发生错误，请联系管理员')
  }
  return result;
}

export const resetDevice: any = async (scr: any) => {
  var result = await scr.resetDevice();
  if (result.result === 0) {
    console.log("重置设备成功");
    message.success('重置设备成功');
  } else {
    console.log("重置设备发生错误" + result);
    message.error('重置设备发生错误');
  }
  return result;
}

export const scan: any = async (scr: any) => {
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
  } else {
    return result;
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
  return result;
}

export const retain = async (scr: any) => {
  var result = await scr.call("retain");
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("存入文件成功");
    message.success('存入文件成功');
  } else {
    console.log("retain()发生错误:" + result.message);
    message.error('存入文件发生错误, 请联系管理员');
  }
  return result;
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

export const getStatus: any = async (scr: any) => {
  var result = await scr.getStatus();
  if (result.result == 0) {
    console.log("获取状态成功");
  }else {
    console.log("获取状态发生错误" + result.message);
  }
  return result;
}

export const getSensorStatus: any = async (scr: any) => {
  var result = await scr.call("get_sensor_status");
  console.log('获取获取传感器状态成功：', result);
  if (result.result == 0) {
    console.log('getSensorStatus()', result);
  } else {
    console.log("getSensorStatus()发生错误:" + result.message);
  }
  return result;
}

export const getStatusAndScan: any = async (scr: any) => {
  const status = await getStatus(scr);
  console.log('getStatusAndScan status', status);
  // 状态正常或者前盖打开， 并且扫描口有纸
  if (status?.result === 0 && status.status_code === 0 && status?.feeder) {
    // 状态正常，可以读卡
    return await scan(scr);
  } else if (status?.result === 0 && status?.status_code === -20) {
    message.error('设备前盖打开，请检查是否解决卡纸后未正确安装扫描仪！');
    return {
      ...status,
      result: -1
    };
  } else if (status?.result === 0 && !status?.feeder) {
    message.error('未放纸，请放置纸张');
    console.log('未放纸');
    return {
      ...status,
      result: -1
    };
  } else {
    message.error(status?.status_message || '获取扫描仪状态发生错误');
    return status;
  }
};

// 2.retain就是存入。 也会触发托盘弹出
// 3.eject是打开闸门然后托盘出去,退票。
// 4.restore是关闸门,把托盘收回来。
// 还有个unlock,这个是卡纸之后调用这个扫描仪会弹出来,可以处理卡纸。 

export const eject: any = async (scr: any) => {
  var result = await scr.call("eject");
  console.log("eject()结果:", result);
  return result;
}

export const restore: any = async (scr: any) => {
  var result = await scr.call("restore");
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("收回托盘成功", result);
    return result;
  } else {
    console.log("restore()发生错误:" + result.message);
    return await restore(scr);
  }
}

export const outAndResore: any = async (scr: any) => {
  const ejectResult = await eject(scr);
  console.log('call eject result: ', ejectResult);
  // 退出成功
  if (ejectResult.result === 0) {
    // 监测是否取走纸张
    message.success('请取走退出纸张');
    return new Promise((resolve, reject) => {
      const timer = setInterval(async () => {
        const getSensorStatusResult = await getSensorStatus(scr);
        console.log('getSensorStatusResult result: ', getSensorStatusResult);
        if (getSensorStatusResult.result === 0 && getSensorStatusResult?.sensor?.sensor1 === 1) {
          clearInterval(timer);
          resolve(restore(scr));
        } else if (getSensorStatusResult.result === 0 && getSensorStatusResult?.sensor?.sensor13 === 0) {
          // 排至单元卡纸
          message.error('排纸单元卡纸，请处理！');
          await unlock(scr);
        }
      }, 3000)
    })
  } else {
    console.log('退出文件失败，请重新尝试，或联系管理员');
    message.error('退出文件失败，请重新尝试，或联系管理员');
    return ejectResult;
  }
};