import { env } from "@/constants";
import { http } from "@/http/http";

export function uploadImage(tempFilePath: string): Promise<string> {
  uni.showLoading({
    title: "上传中",
  });
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      filePath: tempFilePath,
      name: "file",
      url: env.baseUrl + "/uploadCloud",
      success: (res) => {
        console.log(res);
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
export enum BannerModule {
  video = 1,
  contract = 2,
}
export async function getBanner(module: BannerModule) {
  return await http.get<any[]>("/oe_getBannerImages_.csp", { module: module });
}
export async function queryUnitList() {
  return await http.get<any[]>("/oe_productTypeList_.csp", {
    curPage: 1,
  });
}
