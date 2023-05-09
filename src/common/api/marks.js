import request from "@/common/api/request";

export const getMarksJson = (query) => {
  return request("/common/loadJson", "get", query);
};