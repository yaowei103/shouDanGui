

export const openPIDC = async (pidc: any) => {
  var result = await pidc.openDevice();
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("打开读卡器成功");
    return result;
  } else {
    console.log("openPIDC()发生错误:", result.message, '正在重新打开');
    openPIDC(pidc);
  }
}

export const getStatusPIDC = async (pidc: any) => {
  var result = await pidc.getStatus();
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("获取状态成功");
    return result;
  } else {
    console.log("getStatusPIDC()发生错误:" + result.message);
  }
}

export const readPIDC = async (pidc: any) => {
  var param = {
    action: "pid",
    fingerprint_base64: true,
    photo_base64: true
  };

  var result = await pidc.read(param);
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("读卡成功");
    return result;
  } else if (result.result == -4) {
    console.log("取消读卡动作");
    readPIDC(pidc);
  } else {
    console.log("readPIDC()发生错误:" + result.message);
    readPIDC(pidc);
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
}

export const closePIDC = async (pidc: any) => {
  var result = await pidc.closeDevice();
  console.log(JSON.stringify(result));
  if (result.result == 0) {
    console.log("关闭读卡器成功");
  } else {
    console.log("closePIDC()发生错误:" + result.message);
  }
}

export const openAndReadResult = async (pidc: any) => {
  const openResult = await openPIDC(pidc);
  if (openResult.result == 0) {
    const readResult = await readPIDC(pidc);
    return readResult;
  }
}

export const test = async () => {
  return new Promise((resolve: any, reject: any) => {
    setTimeout(() => {
      resolve({ result: 0 });
    }, 3000);
  })
}

export default {};