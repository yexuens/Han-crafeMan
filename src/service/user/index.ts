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
export interface IUpdateUserProfileReq {
  sex?: number;
  wxName?: string;
  wxPhoto?: string;
  userId: string | number;
  district?: string | number;
  integral?: 1 | 0;
  role?: number;
  city?: string;
  name?: string;
  yuliuone?: string;
  yuliutwo?: string;
  number?: number;
  remark?: number;
  delFlag?: string;
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
export async function updateUserProfile(data: IUpdateUserProfileReq) {
  return http.get("/oe_updateUserData_.csp", data);
}
