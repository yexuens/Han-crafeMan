<route lang="jsonc">
{
  "layout": "default",
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
  },
}
</route>
<script setup lang="ts">
import { imgRes } from "@/constants";
import { getPhoneNumber } from "@/utils/auth";
import { toast } from "@/utils/toast";
import { useUserStore } from "@/store";
const hasAccept = ref(false);
const user = useUserStore();
function navigateToPrivacy() {
  uni.navigateTo({
    url: "/pages-sub/privacy/index",
  });
}
async function getPhoneNumberAndLogin({ detail }) {
  try {
    const data = await getPhoneNumber(detail);
    const loginData = await user.login({
      phone: data.phoneNumber,
      openId: data.openid,
      wxName: "微信用户",
      wxPhoto: imgRes.defaultAvatar,
    });
  } catch (e) {
    toast.info(e.message || "获取手机号码失败");
  }
}
</script>

<template>
  <view>
    <image
      class="absolute left-0 top-0 h-screen w-screen -z-1"
      mode="aspectFill"
      :src="imgRes.loginBackground"
    />
    <view class="login_bg px-32px">
      <image
        :src="imgRes.hansCnTitleImg"
        mode="widthFix"
        class="w-225px h-64px mt-124px"
      />
      <view class="flex items-center mt-200px text-12px gap-x-4px">
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
      <sar-button
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumberAndLogin"
        :disabled="!hasAccept"
        root-class="!mt-12px !rounded-24px"
      >
        {{ hasAccept ? "立即登录" : "请同意隐私协议" }}
      </sar-button>
    </view>
    <image
      :src="imgRes.squirrelSide"
      mode="aspectFill"
      class="w-177px opacity-30 h-265px absolute z-16 bottom-0 -right-36px"
    />
    <image
      :src="imgRes.hansTitleImg"
      mode="widthFix"
      class="w-300px opacity-10 h-64px absolute z-11 bottom-12px left-0"
    />
  </view>
</template>
<style scoped>
.login_bg {
  width: 375px;
  height: 500px;
  flex-shrink: 0;

  background: linear-gradient(
    180deg,
    #fea073 0%,
    #f8e4db 25.07%,
    #ffffff 100.12%
  );
}
</style>
