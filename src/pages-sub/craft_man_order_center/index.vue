<route lang="jsonc">
{
  "layout": "default",
  "needLogin": true,

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
  addOrEditRequirement,
  queryRequirementCount,
  queryRequirementList,
  queryRequirementNotice,
} from "@/service/requirement";
import { isNotEmpty } from "@/utils";
import { useNavTransparent } from "@/composables/useNavTransparent";
import { useCustomRefresher } from "@/composables/useCustomRefresher";
import { toast } from "@/utils/toast";
import { OrderStatus } from "@/enums";
import { useUserStore } from "@/store";

const { screenHeight } = uni.getWindowInfo();
usePageAuth();

const tabMenuBtnList = ref([
  {
    label: "待抢单",
    status: "0",
    count: 0,
  },

  {
    label: "已抢单",
    status: "1,2,3",
    count: 0,
  },

  {
    label: "已取消",
    status: "4",
    customClass: "!ml-auto",
    count: 0,
  },
]);
const form = reactive({
  keyword: "",
  activeStatus: "0",
});
const pageParam = reactive({
  curPage: 1,
  number: 10,
});
const certDialogVisible = ref(false);
const noticeList = ref([]);
const navTransparent = useNavTransparent();
const user = useUserStore();
const refresher = useCustomRefresher();
const { mutate: queryList, data: orderList } = useMutation(
  queryRequirementList,
  {
    select({ data }) {
      return isNotEmpty(data)
        ? data.map((item) => ({
            ...item,
            specs: item.specs || [],
          }))
        : [];
    },
  },
);

function handleSearch() {
  fetchData({
    refresh: true,
  });
}

async function fetchNoticeList() {
  const { data } = await queryRequirementNotice({
    type: 1,
    userId: user.userInfo.id,
  });
  if (isNotEmpty(data)) {
    noticeList.value = data as any[];
  }
}

async function handleCancelOrder(id: number) {
  uni.showModal({
    title: "取消工单",
    content: "确认取消该工单吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          const { code } = await addOrEditRequirement({
            id: id,
            jobState: OrderStatus.WasCanceled.valueOf(),
            ...(user.userInfo.role === 0 || user.userInfo.id === id
              ? { userId: user.userInfo.id }
              : { accesUserId: user.userInfo.id }),
          });
          if (code !== 1) throw new Error("取消工单失败");
          toast.info("取消成功");
        } catch (e) {
          toast.info(e.message || "取消工单失败");
        } finally {
          handleRefresh();
        }
      }
    },
  });
}

function beforeGrabAuth() {
  switch (user.userInfo.integral) {
    case 1:
    case 3:
      uni.navigateTo({
        url: "/pages-sub/craft_man_certification/index",
      });
      break;
    case 0:
      certDialogVisible.value = true;
      break;
    default:
      return;
  }
  throw new Error();
}

async function handleNavigateToDetail(id: number) {
  beforeGrabAuth();
  uni.navigateTo({
    url: `/pages-sub/order_detail/index?id=${id}`,
  });
}

async function handleGrabOrder(id: number) {
  beforeGrabAuth();
  try {
    const order = orderList.value.find((item) => item.id === id);
    if (!order) throw new Error("工单不存在");
    if (order.userId === user.userInfo.id)
      throw new Error("不能抢自己发布的单");
    const { code } = await addOrEditRequirement({
      id,
      jobState: OrderStatus.Accepted,
      accesUserId: user.userInfo.id,
    });
    if (code === 1) toast.info("抢单成功");
  } catch (e) {
    toast.info(e.message || "抢单失败");
  } finally {
    handleRefresh();
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
    ...{
      accesUserId: form.activeStatus !== "0" ? user.userInfo.id : null,
    },
    ...pageParam,
    ...(withoutStatus
      ? {}
      : {
          jobState: form.activeStatus,
        }),
  });
  pageParam.curPage += 1;
}

async function fetchRequirementCount() {
  const data: any = await queryRequirementCount({
    accesUserId: user.userInfo.id,
  });
  if (data.code === 1) {
    tabMenuBtnList.value[0].count = data.Num1;
    tabMenuBtnList.value[1].count = data.Num2;
  }
}

async function handleRefresh() {
  refresher.onRefresh(() =>
    fetchData({
      refresh: true,
    }),
  );
  fetchRequirementCount();
}

function changeStatus(status: string) {
  if (status === form.activeStatus) return;
  form.activeStatus = status;
  fetchData({ refresh: true });
}

onPageScroll((e) => {
  navTransparent.onScroll(e);
  e.scrollTop === 0 ? refresher.enable() : refresher.disable();
});
onLoad((opt) => {});
onShow(async () => {
  await user.updateUser();
  fetchNoticeList();
  handleRefresh();
});
onShareAppMessage(() => {
  return {};
});
</script>

<template>
  <certification-guide-dialog v-model="certDialogVisible" />
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
      <!--      <view class="pl-5vw flex items-center justify-between gap-x-28px mt-16px">-->
      <view class="px-5vw flex items-center justify-between gap-x-28px mt-16px">
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
          v-if="false"
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
            <view
              v-if="item.count"
              :class="[
                form.activeStatus === item.status
                  ? 'border-solid border-white border-0.1px'
                  : 'bg-primary-500 text-white',
              ]"
              class="w-16px h-16px rounded-full center p-8px text-10px ml-4px"
              >{{ item.count }}
            </view>
          </sar-button>
        </view>
        <scroll-view
          :refresher-enabled="refresher.enableRefresh.value"
          :refresher-triggered="refresher.isRefreshing.value"
          :throttle="false"
          scroll-y
          @refresherrefresh="handleRefresh"
        >
          <view class="mt-28px flex flex-col gap-y-16px pb-24px">
            <requirement-card-for-craft-man
              v-for="item in orderList"
              :key="item.id"
              :requirement="item"
              @cancel="handleCancelOrder"
              @detail="handleNavigateToDetail"
              @grab="handleGrabOrder"
            />
            <sar-empty
              v-if="!isNotEmpty(orderList)"
              description="暂无工单"
              root-class="!my-1/2"
            />
          </view>
        </scroll-view>
      </view>
    </safe-area-layout>
  </view>
</template>

<style lang="scss" scoped></style>
