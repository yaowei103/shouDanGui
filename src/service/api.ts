import request from './request';

export const getList = (empId: string) => {
  return request(`/expenses?empId=${empId}`, {
    method: 'GET',
  });
};

export const sendImage = (empId: string, orderId: string, orderNum: string) => {
  return request(`/ticket?empId=${empId}&orderId=${orderId}&orderNum=${orderNum}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });
};


// export const getDetail = (empId: string, orderId: string, orderNum: string) => {
//   return request(`/expense?empId=${empId}&orderId=${orderId}&orderNum=${orderNum}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     }
//   });
// };