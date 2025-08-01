import { defineStore } from "pinia";
import { ref } from "vue";
import { getWxInfo, IWxLoginReq, wxLogin } from "@/service/user";
import { currRoute } from "@/utils";

interface IUserInfo {
  address: string;
  brandId: number;
  createTime: string;
  id: number;
  integral: number;
  joinTime: string;
  openId: string;
  role: number;
  score: number;
  sex: number;
  storeId: number;
  storeStatus: number;
  token: string;
  updateTime: string;
  wxName: string;
  wxPhoto: string;
  yuliuone: string;
  district: string;
  yuliutwo: string;
  remark: number | null;
  number: number | null;
  name: string;
}

interface IWxLoginResp {
  code: number;
  user: IUserInfo;
}

const initUser: IUserInfo = {
  address: "",
  brandId: 0,
  createTime: "",
  id: 0,
  integral: 0,
  joinTime: "",
  openId: "",
  district: "",
  yuliuone: "",
  yuliutwo: "",
  role: -1,
  score: 0,
  sex: 0,
  storeId: 0,
  storeStatus: 1001,
  token: "",
  updateTime: "",
  wxName: "",
  wxPhoto: "",
  remark: null,
  number: null,
  name: "",
};

export const useUserStore = defineStore(
  "user",
  () => {
    // 定义用户信息
    const userInfo = ref<IUserInfo>(initUser);
    const isLogin = computed(() => !!userInfo.value.id);
    async function login(req: IWxLoginReq) {
      const { code, user } = await wxLogin({
        ...req,
      });
      if (code !== 1) {
        throw new Error("登录失败！");
      }
      userInfo.value = { ...user };
      await updateUser();
    }

    function checkLogin() {
      const curr = currRoute();
      if (!isLogin.value) {
        uni.showModal({
          title: "暂未登录，请登录后在访问",
          cancelText: "稍后登录",
          confirmText: "前往登录",
          success(res) {
            if (res.confirm)
              uni.redirectTo({
                url: "/pages/login?redirect=" + JSON.stringify(curr),
              });
          },
        });
        throw new Error("user Not Logged In");
      }
    }
    function updateUserLocal(_userInfo: Partial<IUserInfo>) {
      // userInfo.value = {
      //   ...userInfo.value,
      //   ..._userInfo,
      // };
    }

    async function updateUser() {
      if (!isLogin.value) return;
      const { record, msg } = await getWxInfo({
        openid: userInfo.value.openId,
      });
      if (msg === "成功") {
        userInfo.value = { ...(record as unknown as IUserInfo) };
      }
    }

    return {
      userInfo,
      login,
      isLogin,
      checkLogin,
      updateUser,
      updateUserLocal,
    };
  },
  {
    persist: true,
  },
);
