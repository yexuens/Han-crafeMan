import { env } from "@/constants";
import { http } from "@/http/http";

export function uploadImage(tempFilePath: string) {
  uni.showLoading({
    title: "上传中",
  });
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      filePath: tempFilePath,
      unit: "file",
      url: env.baseUrl + "/uploadCloud",
      success: (res) => {
        if (res?.data) resolve(JSON.parse(res?.data as any)?.yunUrl);
      },
      fail: (err) => {
        reject(err);
      },
      complete() {
        uni.hideLoading();
      },
    });
  });
}
export function queryCraftManCount() {
  return http.get("/oe_QueryTotalNum_.csp", {
    flag: "workman",
  });
}
