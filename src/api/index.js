import axios from "axios";

const request = axios.create({
  // 配置接口请求的基准路径
  baseURL: "http://api.cpengx.cn/metashop/api",
});
// 响应拦截器
request.interceptors.response.use(
  (response) => {
    if (response.status == 200) {
      return response.data;
    } else {
      return response;
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const getHomepage = (params) => {
  return request({
    method: "GET",
    url: "/homepage",
    // params选项用来配置QUERY的参数 ?query=xxxx
    params,
  });
};

export const getProducts = () => {
  return request({
    method: "GET",
    url: "/products",
  });
};
