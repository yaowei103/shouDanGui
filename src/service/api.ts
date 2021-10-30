import request from './request';

export const getPhoneCode = (name: any, phoneNumber: any) => {
  return request(`/code?name=${name}&phoneNum=${phoneNumber}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const logon = (req: any) => {
  return request('/logon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: req,
    data: req
  });
};

export const getList = (empId: string) => {
  return request(`/expenses?empId=${empId}`, {
    method: 'GET',
  });
};

export const sendImage = (empId: string, orderId: string, orderNum: string, base64FileList: string[]) => {
  const reqBody = {
    files: [],
  }
  base64FileList.forEach((file, index) => {
    reqBody.files.push(file as never);
  })
  return request(`/ticket?empId=${empId}&orderId=${orderId}&orderNum=${orderNum}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: reqBody,
    data: reqBody,
  });
};

export const submitData = (data: any) => {
  return request('/saveTicket', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
    data: data
  });
}


// export const getDetail = (empId: string, orderId: string, orderNum: string) => {
//   return request(`/expense?empId=${empId}&orderId=${orderId}&orderNum=${orderNum}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     }
//   });
// };