import { getPhone } from "@/service/user";

export function getPhoneNumber(detail: {
  encryptedData: string;
  iv: string;
}): Promise<{
  phoneNumber: string;
  openid: string;
}> {
  return new Promise((resolve) => {
    uni.login({
      success: async (res) => {
        const { code, phoneNumber, openid } = await getPhone({
          js_code: res.code,
          iv: detail.iv,
          encryptedData: detail.encryptedData!,
        });
        if (code == 1) {
          resolve({
            phoneNumber,
            openid,
          });
        } else {
          throw new Error("获取手机号失败");
        }
      },
    });
  });
}
