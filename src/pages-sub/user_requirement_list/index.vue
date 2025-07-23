<route lang="jsonc">
{
  "layout": "default",
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
    "navigationBarTitleText": "首页",
  },
}
</route>

<script lang="ts" setup>
import { imgRes } from "@/constants";
import {
  queryRequirementList,
  queryRequirementNotice,
} from "@/service/requirement";
import { useMutation } from "@/http/useMutation";
import { useNavTransparent } from "@/composables/useNavTransparent";

const requirementStatusList = [
  {
    label: "全部",
    value: null,
  },
  {
    label: "待接单",
    value: 1,
  },
  {
    label: "已接单",
    value: 2,
  },
  {
    label: "已完成",
    value: 3,
  },
  {
    label: "已取消",
    value: 4,
  },
];
const screenHeight = uni.getWindowInfo().windowHeight;
const currentSpecs = ref([]);
const { mutate: queryList, data: requirementList } = useMutation(
  queryRequirementList,
  {
    select(res) {
      publishRequirementCount.value = res?.sumcount || 0;
      return (
        res?.data?.map((item) => ({
          ...item,
          specs: item.specs?.startsWith("[") ? JSON.parse(item.specs) : [],
        })) || []
      );
    },
  },
);
const navTransparent = useNavTransparent();
const currentStatus = ref(null);
const publishRequirementCount = ref(0);
const noticeList = ref([]);

function redirectToPublish() {
  uni.reLaunch({
    url: "/pages/publish/index",
  });
}

function fetchData() {
  queryList({
    curPage: 1,
    number: 10,
    userId: 1,
    jobState: currentStatus.value,
  });
}

async function fetchNoticeList() {
  const { data } = await queryRequirementNotice({
    type: 1,
    userId: 1,
  });
  if (Array.isArray(data)) {
    noticeList.value = data;
  }
}

function changStatus(value: number | null) {
  currentStatus.value = value;
  fetchData();
}

function handleAddPrice(data: any) {
  specsEditDialogShow.value = true;
  currentSpecs.value = data.specs;
  console.log(data);
}

function handleAddPriceFinished() {
  specsEditDialogShow.value = false;
  console.log("加价完成");
}

onPageScroll((e) => {
  navTransparent.onScroll(e);
});
onShow(() => {
  fetchData();
  fetchNoticeList();
});
const specsEditDialogShow = ref(true);
</script>

<template>
  <nav-with-support
    :transparent="navTransparent.transparent.value"
    title="发布需求"
  />
  <specs-edit-dialog
    :show="specsEditDialogShow"
    :specs-list="currentSpecs"
    @close="handleAddPriceFinished"
  />
  <view
    :class="[specsEditDialogShow ? 'no-scroll' : '']"
    :style="`height: ${screenHeight}px`"
    class="common_bg"
  >
    <safe-area-layout>
      <view class="h-160px flex items-center pl-68px text-24px font-700">
        发布记录
      </view>
      <view class="relative w-full">
        <view
          class="relative z-9 h-60px w-80% flex items-center rounded-t-16px bg-primary-200 pl-68px text-16px text-primary-500"
          @click="redirectToPublish"
        >
          发布新需求
        </view>
        <view
          class="absolute right-0 top-0 z-10 h-60px w-180px flex items-center justify-center bg-primary-500"
          style="
            box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
            border-radius: 0px 30px 0px 16px;
          "
        >
          <view class="relative text-16px text-white">
            发布记录
            <view
              class="absolute h-18px w-18px center rounded-full bg-#F00 text-12px text-white -right-18px -top-6px"
            >
              {{ publishRequirementCount }}
            </view>
          </view>
        </view>
        <image
          :src="imgRes.squirrelFront"
          class="absolute right-20px z-7 h-150px w-100px -top-130px"
          mode="aspectFill"
        />
      </view>
      <!--    需求列表 -->
      <view class="relative mx-auto mt-28px w-90vw flex flex-col gap-y-18px">
        <view class="flex items-center gap-x-22px text-14px">
          <view
            v-for="(item, index) in requirementStatusList"
            :key="index"
            :class="[currentStatus === item.value ? '' : 'text-#979797']"
            @click="changStatus(item.value)"
          >
            {{ item.label }}
          </view>
        </view>
        <notice-tips :notice-list="noticeList" />
        <view
          v-for="(item, index) in requirementList"
          :key="index"
          class="pb-24px"
        >
          <requirement-card :requirement="item" @add-price="handleAddPrice" />
        </view>
      </view>
    </safe-area-layout>
  </view>
</template>

<style lang="scss" scoped>
.no-scroll {
  /* vh 是视窗高度单位，100vh = 视窗高度 */
  height: 100vh;
  overflow: hidden;
}
</style>
