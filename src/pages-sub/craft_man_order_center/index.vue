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
import { useMutation } from "@/http/useMutation";
import {
  queryRequirementList,
  queryRequirementNotice,
} from "@/service/requirement";
import { isNotEmpty } from "@/utils";
import { useNavTransparent } from "@/composables/useNavTransparent";
import { cancelOrder, grabOrder } from "@/composables/useOrder";
import { useCustomRefresher } from "@/composables/useCustomRefresher";

const { screenHeight } = uni.getWindowInfo();

const tabMenuBtnList = [
  {
    label: "待抢单",
    status: "0",
    eq: "is",
  },

  {
    label: "已抢单",
    status: "1,2,3",
  },

  {
    label: "已取消",
    status: "4",
    customClass: "!ml-auto",
  },
];
const form = reactive({
  keyword: "",
  activeStatus: "0",
});
const pageParam = reactive({
  curPage: 1,
  number: 10,
});
const noticeList = ref([]);
const navTransparent = useNavTransparent();
const refresher = useCustomRefresher();
const { mutate: queryList, data: requirementList } = useMutation(
  queryRequirementList,
  {
    select({ data }) {
      return isNotEmpty(data)
        ? data.map((item) => ({
            ...item,
            specs: item.specs?.startsWith("[") ? JSON.parse(item.specs) : [],
          }))
        : [];
    },
  },
);

function handleSearch() {
  console.log(form);
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

async function handleCancelOrder(id: number) {
  try {
    await cancelOrder({
      id,
      userId: 1,
      userRole: 1,
    });
  } finally {
    fetchData({
      refresh: true,
    });
  }
}

async function handleGrabOrder(id: number) {
  try {
    await grabOrder({
      id,
      userId: 1,
      userRole: 1,
    });
  } finally {
    fetchData({
      refresh: true,
    });
  }
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
    keyword: form.keyword,
    ...pageParam,
    ...(withoutStatus
      ? {}
      : {
          jobState: form.activeStatus,
        }),
  });
  pageParam.curPage += 1;
}

async function handleRefresh() {
  refresher.onRefresh(() =>
    fetchData({
      refresh: true,
    }),
  );
}
function changeStatus(status: string) {
  if (status === form.activeStatus) return;
  form.activeStatus = status;
  fetchData({ refresh: true });
}

onPageScroll((e) => {
  navTransparent.onScroll(e);
});
onLoad((opt) => {});
onShow(() => {
  fetchNoticeList();
  fetchData({
    refresh: true,
  });
});
</script>

<template>
  <nav-with-support
    :transparent="navTransparent.transparent.value"
    :with-service-icon="false"
    title="接单中心"
  />
  <view
    :style="{
      minHeight: screenHeight + 'px',
    }"
    class="common_bg"
  >
    <safe-area-layout>
      <view class="pl-5vw flex items-center justify-between gap-x-28px mt-16px">
        <sar-input
          v-model="form.keyword"
          placeholder="输入工单关键词搜索"
          root-class="!bg-white acitve:!border-primary-500  !border-primary-200 !rounded-20px !py-8px"
          @confirm="handleSearch"
        >
          <template #prepend>
            <custom-icon icon-name="graySearchIcon" />
          </template>
        </sar-input>
        <view
          class="bg-#FFE2D4 text-12px font-500 text-#733617 px-12px py-6px rounded-l-12px"
        >
          平台7天内总单
        </view>
      </view>
      <view v-if="isNotEmpty(noticeList)" class="mt-20px">
        <notice-tips
          :notice-list="noticeList"
          :show-next-text="true"
          rounded-class="rounded-t-16px"
        />
      </view>
      <view class="w-90vw mx-auto mt-16px flex flex-col">
        <view class="flex gap-x-12px">
          <sar-button
            v-for="(item, index) in tabMenuBtnList"
            :key="index"
            :root-class="
              [
                '!w-72px !h-36px !rounded-8px',
                item.customClass,
                form.activeStatus === item.status
                  ? ''
                  : '!bg-white !text-black',
              ].join(' ')
            "
            inline
            @click="changeStatus(item.status)"
          >
            {{ item.label }}
          </sar-button>
        </view>
        <scroll-view
          @refresherrefresh="handleRefresh"
          :refresher-triggered="refresher.isRefreshing.value"
          refresher-enabled
          vscroll-y
        >
          <view class="mt-28px flex flex-col gap-y-16px pb-24px">
            <requirement-card-for-craft-man
              v-for="item in requirementList"
              :key="item.id"
              :requirement="item"
              @cancel="handleCancelOrder"
              @grab="handleGrabOrder"
            />
            <sar-empty
              root-class="!my-1/2"
              v-if="!isNotEmpty(requirementList)"
              description="暂无工单"
            />
          </view>
        </scroll-view>
      </view>
    </safe-area-layout>
  </view>
</template>

<style lang="scss" scoped></style>
