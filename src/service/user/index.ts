import { http } from "@/http/http";

interface IGetPhoneNumberReq {
  js_code: string;
  encryptedData: string;
  iv: string;
}

export interface IWxLoginReq {
  phone: string;
  openId: string;
  sex?: number;
  wxName?: string;
  wxPhoto?: string;
}

export async function getWxInfo(data: { openid: string }) {
  return await http.get("/oe_wxInfoIt_.csp", data);
}

export const getPhone = async (data: IGetPhoneNumberReq) =>
  await http.get("/oe_getPhoneIt_.csp", data);

export async function wxLogin(data: IWxLoginReq) {
  const defaultLoginReq = {
    role: 0,
    storeId: 1,
    brandId: 2,
    token: "",
    number: "",
    address: "",
    userId: "",
    sex: data?.sex || 0,
    storeStatus: uni.getEnterOptionsSync().scene,
  };
  return await http.get("/oe_wxLoginIt_.csp", {
    ...data,
    ...defaultLoginReq,
  });
}
