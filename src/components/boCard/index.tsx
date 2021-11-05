
import { message } from 'antd';


export const openPIDC: any = async (pidc: any, maxTimes: any | undefined = 5) => {
  var result = await pidc.openDevice();
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("打开读卡器成功", result);
    return result;
  } else if (maxTimes <= 0 && result.result !== 0) {
    message.error('读卡设备打开错误，请联系管理员');
    return result;
  } else {
    console.log("openPIDC()发生错误:", result.message, `正在第${11 - maxTimes}次重新打开`);
    return await openPIDC(pidc, maxTimes - 1);
  }
}

export const getStatusPIDC: any = async (pidc: any, maxTimes: any | undefined = 5) => {
  var result = await pidc.getStatus();
  console.log('获取状态：', result);
  if (result.result == 0) {
    console.log("获取状态成功");
    return result;
  } else if (maxTimes <= 0 && result.result !== 0) {
    console.log('获取状态发生错误，已经尝试10次');
    return result;
  } else {
    console.log("getStatusPIDC()发生错误:" + result.message);
    return await getStatusPIDC(pidc, maxTimes - 1);
  }
}

export const readPIDC: any = async (pidc: any) => {
  const cardReaderParam = {
    action: 'track2break;ssictrack2',
  }
  var result = await pidc.read(cardReaderParam);
  console.log('读卡结果', JSON.stringify(result));
  if (result.result == 0) {
    console.log("读卡成功");
    return result;
  } else if (result.result == -4) {
    console.log("取消读卡动作", result);
    return result;
  } else {
    console.log('读卡错误', result);
    return result;
  }
}

export const cancelPIDC = async (pidc: any) => {
  var result = await pidc.cancel();
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("取消读卡成功");
  } else {
    console.log("cancelPIDC()发生错误:" + result.message);
  }
  return result;
}

export const resetPIDC: any = async (pidc: any) => {
  var result = await pidc.resetDevice();
  console.log('resetCard result:', result);
  if (result.result == 0) {
    return result;
  } else {
    console.log('重置读卡器错误');
    return result;
  }
}

export const closePIDC: any = async (pidc: any) => {
  var result = await pidc.closeDevice();
  if (result.result == 0) {
    console.log("关闭读卡器成功");
    return result;
  } else {
    console.log('关闭读卡器错误');
    return result;
  }
}

export const getStatusAndRead: any = async (pidc: any) => {
  const status = await getStatusPIDC(pidc);
  console.log('获取状态并读卡', status);
  if (status.status === 0) {
    // 状态正常，可以读卡
    return await readPIDC(pidc);
  } else {
    console.log('getStatusAndRead error', status);
    message.error('获取读卡器状态失败');
    return status;
  }
};

export const testOpenAndReadResult: any = async () => {
  const readResult: any = await test();
  if (readResult.result == 0) {
    console.log('识别正确：', readResult);
    return readResult;
  } else {
    console.log('识别错误，正在重新识别');
    return await testOpenAndReadResult();
  }
}

export const test = async () => {
  return new Promise((resolve: any, reject: any) => {
    setTimeout(() => {
      const redom = Math.random();
      if (redom > 0.5) {
        resolve({ result: 0 });
      } else {
        resolve({ result: 1 });
      }
    }, 3000);
  })
}

export default {};