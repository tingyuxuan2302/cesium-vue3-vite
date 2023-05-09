/*
 * @Descripttion:
 * @Author: 笙痞
 * @Date: 2023-01-09 15:59:37
 * @LastEditors: 笙痞
 * @LastEditTime: 2023-01-09 16:14:26
 */
import request from "@/common/api/request";

export const getGeojson = (url) => {
  return request(url, "get");
};

export const getTest = url => {
  return request(url, "get")
}
