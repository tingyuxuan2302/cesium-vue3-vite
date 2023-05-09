/*
 * @Descripttion:
 * @Author: 笙痞
 * @Date: 2022-10-17 09:43:04
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-05-08 11:24:07
 */
import axios from "axios";
import { ElMessage } from "element-plus";
import { BASE_URL } from "@/common/constant"

const METHOD_TYPE = ["post", "put", "patch"];
const ERR_TYPE = {
  400: "错误的请求",
  401: "未授权，请重新登录",
  403: "拒绝访问",
  404: "请求错误,未找到该资源",
  405: "请求方法未允许",
  408: "请求超时",
  500: "服务器端出错",
  501: "网络未实现",
  502: "网络错误",
  503: "服务不可用",
  504: "网络超时",
  505: "http版本不支持该请求",
};

// 创建 axios 实例
const axiosInstance = axios.create({
  timeout: 10000, // 请求超时时间
  // baseURL: BASE_URL, // API 请求的默认前缀
});

const handleNetworkError = (errStatus) => {
  let errMes = "";
  if (!ERR_TYPE.errStatus) {
    errMes = `其他连接错误 --${errStatus}`;
  } else {
    errMes = ERR_TYPE.errStatus;
  }
  ElMessage.error(errMes);
};

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      return Promise.reject(response.data);
    }
    return response;
  },
  (err) => {
    handleNetworkError(err.response.status);
    return Promise.reject(err.response);
  }
);
/**
 *
 * @{query} Object	 统一get，post的传参键
 */
const request = (url, method, query, config = {}) => {
  const isPost = METHOD_TYPE.indexOf(method) > -1;
  return new Promise((resolve) => {
    axiosInstance({
      url,
      method,
      params: isPost ? config.params : query,
      data: isPost ? query : undefined,
      ...config,
    })
      .then((result) => {
        const res = result.data;
        resolve({ res });
      })
      .catch((err) => {
        resolve({ err });
      });
  });
};

export default request;
