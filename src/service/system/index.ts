import { env } from "@/constants";

export function uploadImage(tempFilePath: string) {
  uni.showLoading({
    title: "上传中",
  });
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      filePath: tempFilePath,
      name: "file",
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
