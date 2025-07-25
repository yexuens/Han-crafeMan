import type { CustomRequestOptions } from "@/http/interceptor";
import { env } from "@/constants";
import { IResData } from "@/typings";

export function http<T = any>(options: CustomRequestOptions) {
  if (options.query) {
    options.query["dbName"] = env.dbName;
  } else if (options.data) {
    options.data["dbName"] = env.dbName;
  }
  // 1. 返回 Promise 对象
  return new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: "json",
      // #ifndef MP-WEIXIN
      responseType: "json",
      // #endif
      // 响应成功
      success(res) {
        const data = res.data as IResData<T>;
        if (data.code && !isNaN(Number(data.code)))
          data.code = Number(data.code);
        resolve(data);
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: "none",
          title: "网络错误，换个网络试试",
        });
        reject(err);
      },
    });
  });
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @param header 请求头，默认为json格式
 * @returns
 */
export function httpGet<T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<CustomRequestOptions>,
) {
  return http<T>({
    url,
    query,
    method: "GET",
    header,
    ...options,
  });
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @param header 请求头，默认为json格式
 * @returns
 */
export function httpPost<T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<CustomRequestOptions>,
) {
  return http<T>({
    url,
    query,
    data,
    method: "POST",
    header,
    ...options,
  });
}
/**
 * PUT 请求
 */
export function httpPut<T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<CustomRequestOptions>,
) {
  return http<T>({
    url,
    data,
    query,
    method: "PUT",
    header,
    ...options,
  });
}

/**
 * DELETE 请求（无请求体，仅 query）
 */
export function httpDelete<T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<CustomRequestOptions>,
) {
  return http<T>({
    url,
    query,
    method: "DELETE",
    header,
    ...options,
  });
}

http.get = httpGet;
http.post = httpPost;
http.put = httpPut;
http.delete = httpDelete;

// 支持与 alovaJS 类似的API调用
http.Get = httpGet;
http.Post = httpPost;
http.Put = httpPut;
http.Delete = httpDelete;
