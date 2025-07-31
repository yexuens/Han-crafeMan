<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="jsonc">
{
  "layout": "customBar",
  "needLogin": true,
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
  },
}
</route>

<script lang="ts" setup>
import { queryCraftsAuthInfo } from "@/service/crafts";
import { isNotEmpty } from "@/utils";
import { updateUserProfile } from "@/service/user";
import { useUserStore } from "@/store";
import { toast } from "@/utils/toast";

const { screenHeight } = uni.getWindowInfo();
const stepList = [
  {
    title: "第一步 确认合同",
  },
  {
    title: "第二步 身份认证",
  },
];
const step = ref(0);
const form = reactive({
  district: "",
  name: "",
  city: "",
});
const menuButtonArea = uni.getMenuButtonBoundingClientRect();
const user = useUserStore();
const contractImages = ref([]);
const formValidation = computed(
  () => !(form.name && form.city && form.district),
);
usePageAuth();

async function fetchContractImages() {
  const { data } = await queryCraftsAuthInfo({
    type: 3,
  });
  if (isNotEmpty(data)) {
    contractImages.value = (data as any[])
      .filter((item) => !!item?.contractImage)
      .map((item) => item.contractImage);
  }
}

function previewImg(url: string) {
  uni.previewImage({
    urls: [url],
  });
}

async function handleSubmit() {
  const { code } = await updateUserProfile({
    ...form,
    userId: user.userInfo.id,
  });
  if (code !== 1) {
    toast.info("认证失败");

    return;
  }
  toast.info("认证成功");
  await user.updateUser();
  uni.reLaunch({
    url: "/pages/index/index",
  });
}

onLoad(() => {
  fetchContractImages();
});
</script>

<template>
  <view
    :style="`min-height: ${screenHeight}px;padding-top: ${menuButtonArea.top + menuButtonArea.height}px;`"
    class="bg relative flex flex-col"
  >
    <view class="relative pt-40px pl-40px text-18px font-bold leading-7">
      {{ stepList[step].title }}
    </view>
    <template v-if="step === 0">
      <view
        class="relative flex-1 mx-auto mt-18px w-90vw gap-y-20px rounded-12px bg-[#f6f6f6] px-18px py-35px"
      >
        <image
          v-for="(url, index) in contractImages"
          :key="index"
          :src="url"
          class="w-80vw rounded-12px"
          mode="widthFix"
          @click="previewImg(url)"
        />
        <sar-button block root-class="!mt-40px" @click="step += 1"
          >确认并进行下一步填写信息
        </sar-button>
      </view>
    </template>
    <template v-if="step === 1">
      <view
        class="relative flex-1 mx-auto mt-18px w-90vw flex flex-col items-center gap-y-20px rounded-12px bg-[#f6f6f6] px-18px py-35px"
      >
        <view class="flex flex-col items-center gap-y-20px">
          <view class="flex items-center gap-x-4px">
            <text class="w-80px text-left text-14px text-[#000] opacity-60">
              姓名：
            </text>
            <sar-input
              v-model="form.name"
              root-class="h-40px !w-200px rounded-6px bg-white"
            />
          </view>
          <view class="flex items-center gap-x-4px">
            <text class="w-80px text-left text-14px text-[#000] opacity-60">
              电话：
            </text>
            <sar-input
              v-model="form.district"
              root-class="h-40px !w-200px rounded-6px bg-white"
            />
          </view>
          <view class="flex items-center gap-x-4px">
            <text class="w-80px text-left text-14px text-[#000] opacity-60">
              服务城市：
            </text>
            <sar-input
              v-model="form.city"
              root-class="h-40px !w-200px rounded-6px bg-white"
            />
          </view>
          <sar-button
            :disabled="formValidation"
            root-class="!w-full !mt-30px"
            @click="handleSubmit"
          >
            确认信息完成工匠注册
          </sar-button>
        </view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.bg {
  background: linear-gradient(
    180deg,
    #fc7c44 10.05%,
    #f7ded2 24.44%,
    #f6f6f6 100.12%
  );
}
</style>
