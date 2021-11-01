import { message } from 'antd';
import axios from 'axios';

// 请求路径
// const BaseUrl = 'http://localhost:8080'; // 主机及端口
const BaseUrl = 'http://kobezhang.natapp1.cc';

//axios默认配置请求的api基础地址
axios.defaults.baseURL = BaseUrl;
axios.defaults.timeout = 120000; // 超时设置,超时进入错误回调，进行相关操作
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'; // post 内容类型
// axios.defaults.headers.get['Content-Type'] = 'application/json;charset=utf-8'; // get 内容类型
// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'; // post 内容类型 formData 类型
// axios.defaults.withCredentials = true; // 是否支持跨域cookie

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

function checkStatus(response: any) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // 提示框
  message.info(`请求错误 ${response.status}: ${response.url}`, 1)
  const error: any = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}


/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url: string, options: any) {
  const defaultOptions = {
    // credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    console.log('request type:', !(newOptions.body instanceof FormData));
    if (newOptions.body instanceof FormData) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        ...newOptions.headers,
      };
      newOptions.data = newOptions.body;
      newOptions.body = newOptions.body;
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }
  return axios(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      // 成功的回调
      console.log('axios success:', response);
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.data;
    })
    .catch((e) => {
      // 失败的回调
      console.log(`请求错误，错误码：${e}`);
      return {};
    });
}