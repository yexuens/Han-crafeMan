<route lang="jsonc">
{
  "layout": "default",
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
  },
}
</route>
<script lang="ts" setup>
import { toast } from "@/utils/toast";
import ButtonView from "@/components/buttonView.vue";
import { uploadImage } from "@/service/system";
import { getPhone, updateUserProfile, wxLogin } from "@/service/user";
import { useUserStore } from "@/store";
import { getPhoneNumber } from "@/utils/auth";

let initialForm: Partial<typeof form> | null = null;
const hasAccept = ref(false);
const { screenHeight } = uni.getWindowInfo();
const form = reactive({
  wxName: "",
  wxPhoto: "",
  openId: "",
  phone: null,
  sex: null,
});

enum EnterScene {
  REG = 1,
  EDIT = 2,
}

const user = useUserStore();
const currentScene = ref(EnterScene.REG);
const navBarTitle = computed(() =>
  currentScene.value === EnterScene.REG ? "用户入驻" : "我的资料",
);
const isFormChanged = computed(() => {
  if (currentScene.value !== EnterScene.EDIT || !initialForm) {
    return false;
  }
  return (
    form.wxName !== initialForm.wxName ||
    form.wxPhoto !== initialForm.wxPhoto ||
    form.sex !== initialForm.sex
  );
});

const onSubmit = async () => {
  const { wxName, wxPhoto, phone } = form;
  if (!wxName) {
    toast.info("请填写用户名称");
    return;
  }
  if (!phone) {
    toast.info("请获取电话号码");
    return;
  }
  switch (currentScene.value) {
    case EnterScene.REG:
      handleUserReg(form);
      break;
    case EnterScene.EDIT:
      handleUserUpdate(form);
      break;
  }
};

async function handleUserReg(_form: typeof form) {
  const res = await wxLogin({
    ..._form,
  });
  if (res.code == 1) {
    console.log(res);
  }
}

async function handleUserUpdate(_form: typeof form) {
  const res = await updateUserProfile({
    wxName: _form.wxName,
    wxPhoto: _form.wxPhoto,
    sex: _form.sex,
    userId: user.userInfo.id,
  });
  if (res.code == 1) {
    toast.info("更新成功");
  } else {
    toast.info("更新失败");
  }
}

function navigateToPrivacy() {
  uni.navigateTo({
    url: "/pages-sub/privacy/index",
  });
}

function getUserAvatar(e) {
  const { avatarUrl } = e.detail;
  if (!avatarUrl) return;
  uploadImage(avatarUrl).then((url: string) => {
    form.wxPhoto = url;
  });
}
usePageAuth();

async function getPhoneNumberAndSubmit({ detail }) {
  return getPhoneNumber(detail).then(({ phoneNumber, openid }) => {
    form.phone = phoneNumber;
    form.openId = openid;
    onSubmit();
  });
}

onLoad((opt) => {
  if (opt.scene) {
    currentScene.value = Number(opt.scene);
    if (Number(opt.scene) === EnterScene.EDIT) {
      form.sex = user.userInfo.sex;
      form.wxName = user.userInfo.wxName;
      form.wxPhoto = user.userInfo.wxPhoto;
      form.phone = user.userInfo.phone;
      initialForm = JSON.parse(JSON.stringify(form));
    }
  }
});
</script>

<template>
  <nav-with-support
    :title="navBarTitle"
    :transparent="true"
    :with-service-icon="false"
  />

  <view :style="`height:${screenHeight}px`" class="common_bg">
    <safe-area-layout>
      <view class="mt-24px w-90vw mx-auto">
        <sar-form
          :model="form"
          label-width="180rpx"
          root-class="!rounded-12px !text-14px"
        >
          <sar-form-item label="用户头像" required root-class="!py-14px">
            <button-view
              :choose-avatar="getUserAvatar"
              custom-class="text-14px"
              inline
              open-type="chooseAvatar"
            >
              <view v-if="!form.wxPhoto"> 点击获取头像</view>
              <sar-avatar
                v-else
                :src="form.wxPhoto"
                root-class="ml-auto"
                size="96rpx"
              />
            </button-view>
          </sar-form-item>
          <sar-form-item label="电话号码" required root-class="!py-14px">
            <sar-input
              v-model="form.phone"
              inlaid
              placeholder="系统自动获取"
              readonly
            />
          </sar-form-item>
          <sar-form-item label="用户名称" required root-class="!py-14px">
            <sar-input
              v-model="form.wxName"
              inlaid
              placeholder="请输入用户名称"
              type="nickname"
            />
          </sar-form-item>
          <sar-form-item label="性别" root-class="!py-14px">
            <sar-picker-input
              v-model="form.sex"
              :columns="[
                {
                  label: '男',
                  value: 0,
                },
                {
                  label: '女',
                  value: 1,
                },
              ]"
              placeholder="请选择"
              title="请选择您的性别"
            />
          </sar-form-item>
        </sar-form>
      </view>
      <view
        class="fixed bottom-0 px-5vw pt-8px pb-24px bg-white border-t-solid border-t-gray-200 border-t-1px w-full h-81px flex items-center gap-x-16px"
      >
        <sar-button
          v-if="currentScene === EnterScene.REG"
          :disabled="!hasAccept"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumberAndSubmit"
        >
          {{ hasAccept ? "完成入驻" : "请同意隐私协议" }}
        </sar-button>
        <sar-button v-else :disabled="!isFormChanged" @click="onSubmit">
          保存修改
        </sar-button>

        <view
          v-if="currentScene === EnterScene.REG"
          class="absolute w-full center -top-28px text-12px"
        >
          <view class="flex items-center gap-x-4px">
            <sar-checkbox
              v-model:checked="hasAccept"
              root-class="hover:none"
              size="32rpx"
              type="circle"
            >
            </sar-checkbox>
            <view class="opacity-60"
              >已阅读并同意
              <text class="font-bold" @click="navigateToPrivacy"
                >《用户协议及隐私协议》
              </text>
            </view>
          </view>
        </view>
      </view>
    </safe-area-layout>
  </view>
</template>

<style lang="scss" scoped></style>
