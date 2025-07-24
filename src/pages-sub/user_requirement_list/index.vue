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
  addOrEditRequirement,
  queryRequirementList,
  queryRequirementNotice,
} from "@/service/requirement";
import { useMutation } from "@/http/useMutation";
import { useNavTransparent } from "@/composables/useNavTransparent";
import { isNotEmpty } from "@/utils";
import { toast } from "@/utils/toast";
import { useCustomRefresher } from "@/composables/useCustomRefresher";

const requirementStatusList = [
  {
    label: "全部",
    value: null,
  },
  {
    label: "待接单",
    value: "0",
  },
  {
    label: "已接单",
    value: "1,2,3",
  },
  {
    label: "已取消",
    value: "4",
  },
];
const screenHeight = uni.getWindowInfo().windowHeight;
const pickedRequirement = ref();
const specsEditDialogShow = ref(false);

const currentStatus = ref(null);
const publishRequirementCount = ref(0);
const noticeList = ref([]);
const pageParam = reactive({
  curPage: 1,
  number: 10,
});
const refresher = useCustomRefresher();
const navTransparent = useNavTransparent();

const {
  mutate: queryList,
  data: requirementList,
  isLoading,
} = useMutation(queryRequirementList, {
  select({ data, sumcount }) {
    publishRequirementCount.value = sumcount || 0;
    return isNotEmpty(data)
      ? data.map((item) => ({
          ...item,
          specs: item.specs?.startsWith("[") ? JSON.parse(item.specs) : [],
        }))
      : [];
  },
});

function redirectToPublish() {
  uni.reLaunch({
    url: "/pages/publish/index",
  });
}

async function fetchData({
  withoutStatus = false,
  refresh = false,
}: {
  refresh?: boolean;
  withoutStatus?: boolean;
} = {}) {
  if (refresh) pageParam.curPage = 1;

  await queryList({
    ...pageParam,
    ...(withoutStatus
      ? {}
      : {
          jobState: currentStatus.value,
        }),
  });
  pageParam.curPage += 1;
}

async function fetchNoticeList() {
  const { data } = await queryRequirementNotice({
    type: 1,
    userId: 1,
  });
  if (isNotEmpty(data)) {
    noticeList.value = data as any[];
  }
}

function changStatus(value: string | null) {
  if (currentStatus.value === value) return;
  currentStatus.value = value;
  fetchData({
    refresh: true,
  });
}

function openEditPriceDialog(data: any) {
  specsEditDialogShow.value = true;
  pickedRequirement.value = data;
}

async function handleEditPriceFinished({ data, isSuccess }) {
  specsEditDialogShow.value = false;

  if (isSuccess) {
    try {
      await addOrEditRequirement({
        id: pickedRequirement.value.id,
        specs: data,
        userId: 1,
      });
      toast.info("修改成功");
      await fetchData({
        refresh: true,
      });
    } catch (e) {
      toast.info("修改失败");
    } finally {
      pickedRequirement.value = null;
    }
  }
}

async function handleRefresh() {
  refresher.onRefresh(() =>
    fetchData({
      refresh: true,
    }),
  );
}

onPageScroll((e) => {
  navTransparent.onScroll(e);
});
onShow(() => {
  fetchData({
    withoutStatus: true,
    refresh: true,
  });
  fetchNoticeList();
});
</script>

<template>
  <nav-with-support
    :transparent="navTransparent.transparent.value"
    title="发布需求"
  />
  <specs-edit-dialog
    :id="pickedRequirement?.id"
    :show="specsEditDialogShow"
    :specs-list="pickedRequirement?.specs"
    @finish="handleEditPriceFinished"
  />
  <view
    :class="[specsEditDialogShow ? 'no-scroll' : '']"
    :style="{
      minHeight: screenHeight + 'px',
    }"
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
      <scroll-view
        :refresher-triggered="refresher.isRefreshing.value"
        refresher-enabled
        vscroll-y
        @refresherrefresh="handleRefresh"
      >
        <view
          class="relative h-full mx-auto mt-28px w-90vw flex flex-col gap-y-18px"
        >
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
          <notice-tips
            v-if="isNotEmpty(noticeList)"
            :notice-list="noticeList"
            rounded-class="rounded-16px"
          />
          <view
            v-for="(item, index) in requirementList"
            :key="index"
            class="pb-24px"
          >
            <requirement-card
              :requirement="item"
              @add-price="openEditPriceDialog"
            />
          </view>
          <view
            v-if="isLoading"
            class="flex !my-1/3 items-center justify-center"
          >
            <sar-loading size="48rpx" />
          </view>
          <view v-else-if="!isNotEmpty(requirementList)" class="!my-1/3">
            <sar-empty description="暂无工单" />
          </view>
        </view>
      </scroll-view>
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
