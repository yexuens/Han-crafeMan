<route lang="jsonc">
{
  "layout": "default",
  "needLogin": true,
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
    "enablePullDownRefresh": true,
  },
}
</route>
<script lang="ts" setup>
import {
  addOrEditRequirement,
  queryRequirementList,
} from "@/service/requirement";
import {
  craftManOrderStatusText,
  OrderStatus,
  OrderStatusByUser,
  orderStatusNoticeInfoMap,
} from "@/enums/requirement";
import { isNotEmpty, navigateBack, previewImg } from "@/utils";
import { toast } from "@/utils/toast";
import { useUserStore } from "@/store";

const { screenHeight } = uni.getWindowInfo();
const requirementDetail = ref();
const id = ref();
const specsEditDialogShow = ref(false);
const user = useUserStore();

const requirementStatusByUser = computed<OrderStatusByUser>(() => {
  if (requirementDetail.value) {
    if (
      jobState.value === OrderStatus.WasCanceled ||
      jobState.value === OrderStatus.Completed
    ) {
      return OrderStatusByUser["已完成/已取消"];
    }
    if (
      userRole.value === 0 ||
      user.userInfo.id === requirementDetail.value.userId
    ) {
      // 用户提价
      if (jobState.value === OrderStatus.Published) {
        return OrderStatusByUser["用户已发单,工匠未接单"];
      }
    }
    if (userRole.value === 1) {
      // 工匠抢单
      if (jobState.value === OrderStatus.Published) {
        return OrderStatusByUser["工匠待抢单"];
      }
    }
  }
  // 其余情况，统一取消订单，联系客服
  return OrderStatusByUser["取消接单"];
});

//  1. 工匠 0. 用户
const userRole = computed(() => user.userInfo.role);
const jobState = computed(() => requirementDetail.value?.jobState);
const userId = computed(() => user.userInfo.id);

async function getDetail(id: number) {
  const { data } = await queryRequirementList({
    id,
  });
  if (isNotEmpty(data)) {
    let rawData = data[0];
    requirementDetail.value = {
      ...rawData,
      specs: rawData.specs || [],
    };
  } else {
    toast.info("获取工单详情失败");
  }
}

async function handleCancel() {
  uni.showModal({
    title: "取消工单",
    content: "确认取消该工单吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          const { code } = await addOrEditRequirement({
            id: requirementDetail.value.id,
            jobState: OrderStatus.WasCanceled.valueOf(),
            ...(userRole.value === 0 ||
            userId.value === requirementDetail.value.userId
              ? { userId: userId.value }
              : { accesUserId: userId.value }),
          });
          if (code !== 1) throw new Error("取消工单失败");
          toast.info("取消成功");
        } catch (error) {
          toast.info(error.message || "取消工单失败");
        } finally {
          getDetail(id.value);
        }
      }
    },
  });
}

async function handleEditPriceFinished({ data, isSuccess }) {
  specsEditDialogShow.value = false;
  if (!isSuccess) return;
  try {
    await addOrEditRequirement({
      id: id.value,
      specs: data,
      userId: userId.value,
    });
    toast.info("修改成功");
  } catch (e) {
    toast.info("修改价格失败");
  } finally {
    getDetail(id.value);
  }
}

async function handleGrabOrder() {
  if (userRole.value !== 1) return;
  try {
    if (!requirementDetail.value) throw new Error("工单不存在");
    if (requirementDetail.value.userId === user.userInfo.id)
      throw new Error("不能抢自己发布的单");
    const { code } = await addOrEditRequirement({
      id: requirementDetail.value.id,
      jobState: 1,
      accesUserId: userId.value || 1,
    });
    if (code !== 1) throw new Error("抢单失败，请稍后再试");
    toast.info("抢单成功");
  } catch (e) {
    toast.info(e.message || "抢单失败，请稍后再试");
  } finally {
    getDetail(id.value);
  }
}

function openEditPriceDialog() {
  specsEditDialogShow.value = true;
}

function validateDetail() {
  if (
    requirementDetail.value.userId === userId.value ||
    (requirementDetail.value.jobState === OrderStatus.Published &&
      userRole.value === 1) ||
    requirementDetail.value.accesUserId === userId.value
  )
    return;

  uni.showModal({
    title: "权限不足",
    content: "您没有权限查看该工单",
    showCancel: false,
    success: () => {
      navigateBack();
    },
  });
}

onLoad((opt) => {
  if (opt?.id) {
    id.value = opt.id;
  }
});
onShow(async () => {
  await getDetail(id.value);
  validateDetail();
});
onPullDownRefresh(async () => {
  await getDetail(id.value);
  uni.stopPullDownRefresh();
});
onShareAppMessage(() => {
  return {};
});
</script>

<template>
  <nav-with-support
    :transparent="true"
    :with-service-icon="false"
    title="工单详情"
  />

  <view
    v-if="requirementDetail"
    :style="`height:${screenHeight}px`"
    class="bg-#f6f6f6"
  >
    <specs-edit-dialog
      :id="requirementDetail.id"
      :show="specsEditDialogShow"
      :specs-list="requirementDetail.specs"
      @finish="handleEditPriceFinished"
    />
    <safe-area-layout>
      <view class="flex flex-col gap-y-20px">
        <view class="flex flex-col gap-y-12px px-5vw">
          <view class="flex items-center gap-x-8px pt-20px">
            <view class="font-bold text-16px">
              {{ requirementDetail.address }}
            </view>
            <sar-tag
              :color="craftManOrderStatusText[jobState].bgColor"
              :size="'small'"
            >
              {{
                userRole === 0 || userId === requirementDetail.userId
                  ? craftManOrderStatusText[jobState].user
                  : craftManOrderStatusText[jobState].crafeman
              }}
            </sar-tag>
          </view>
          <view class="text-12px opacity-60">
            发布时间：{{ requirementDetail.createTime }}
          </view>
        </view>
        <view
          v-if="orderStatusNoticeInfoMap[jobState]"
          :style="{
            backgroundColor: orderStatusNoticeInfoMap[jobState].bgColor,
            color: orderStatusNoticeInfoMap[jobState].textColor,
          }"
          class="w-full rounded-t-16px h-40px flex items-center px-5vw gap-x-6px"
        >
          <custom-icon
            v-if="orderStatusNoticeInfoMap[jobState].icon"
            :icon-name="orderStatusNoticeInfoMap[jobState].icon"
          />
          <text class="text-12px font-500"
            >{{
              userRole === 0 || userId === requirementDetail.userId
                ? orderStatusNoticeInfoMap[jobState].user
                : orderStatusNoticeInfoMap[jobState].crafeman
            }}
          </text>
        </view>
        <view class="font-bold text-16px px-5vw"> 基本信息</view>
        <view class="flex items-center px-5vw flex-col gap-y-16px">
          <view class="flex justify-between w-full text-14px">
            <view class="text-#060606 opacity-60 shrink-0 pr-48px"
              >工单编号
            </view>
            <view>{{ requirementDetail.orderNo }}</view>
          </view>
          <view class="flex justify-between w-full text-14px">
            <view class="text-#060606 opacity-60 shrink-0 pr-48px"
              >施工面积
            </view>
            <view>{{ requirementDetail.area }}㎡</view>
          </view>
          <view class="flex justify-between w-full text-14px">
            <view class="text-#060606 opacity-60 shrink-0 pr-48px"
              >铺贴规格
            </view>
            <view>
              <view
                v-for="(spec, index) in requirementDetail.specs"
                :key="index"
                class="text-right tracking-wider"
              >
                <text class="text-#060606 opacity-60">{{ spec.unit }}/</text>
                <text class="text-primary-500">${{ spec.price }}/㎡</text>
              </view>
            </view>
          </view>
          <view
            v-if="userId !== requirementDetail.userId"
            class="flex justify-between w-full text-14px"
          >
            <view class="text-#060606 opacity-60 shrink-0 pr-48px"
              >客户名称
            </view>
            <view>{{ requirementDetail.ownerName }}</view>
          </view>
          <view class="flex justify-between w-full text-14px">
            <view class="text-#060606 opacity-60 shrink-0 pr-48px"
              >详细地址
            </view>
            <view>{{ requirementDetail.address }}</view>
          </view>
          <view
            v-if="requirementDetail.workmanName"
            class="flex justify-between w-full text-14px"
          >
            <view class="text-#060606 opacity-60 shrink-0 pr-48px"
              >接单师傅</view
            >
            <view>{{ requirementDetail.workmanName }}</view>
          </view>
          <view
            v-if="
              jobState === OrderStatus.GroupCodeUploaded ||
              jobState === OrderStatus.GroupConnecting
            "
            class="flex justify-between w-full text-14px"
          >
            <view class="text-#060606 opacity-60 shrink-0 pr-48px">项目群</view>
            <view>
              <image
                :src="requirementDetail.qrCode"
                class="w-120px w-120px"
                mode="widthFix"
                @click="previewImg(requirementDetail.qrCode)"
              />
            </view>
          </view>
        </view>
      </view>

      <view
        v-if="requirementStatusByUser !== OrderStatusByUser['已完成/已取消']"
        class="fixed bottom-0 px-5vw pt-8px pb-24px border-t-solid border-t-gray-200 border-t-1px w-full h-81px flex items-center gap-x-16px"
      >
        <view
          v-if="requirementStatusByUser !== OrderStatusByUser['工匠待抢单']"
          class="max-w-35% shrink-0 gap-x-8px h-full flex items-center justify-between"
        >
          <button
            class="flex items-center flex-col m-0 p-0 after:border-none"
            hover-class="none"
            open-type="contact"
          >
            <custom-icon icon-name="lianXiKeFuIcon" />
            <view class="text-12px text-#060606">联系客服</view>
          </button>
          <button
            v-if="
              requirementStatusByUser ===
              OrderStatusByUser['用户已发单,工匠未接单']
            "
            class="flex items-center flex-col m-0 p-0"
            @click="handleCancel"
          >
            <custom-icon icon-name="cancelOrderIcon" />
            <view class="text-12px text-#060606">取消订单</view>
          </button>
        </view>
        <view class="w-full h-full">
          <sar-button
            v-if="requirementStatusByUser === OrderStatusByUser['取消接单']"
            @click="handleCancel"
            >申请取消
          </sar-button>
          <sar-button
            v-if="
              requirementStatusByUser ===
              OrderStatusByUser['用户已发单,工匠未接单']
            "
            @click="openEditPriceDialog"
            >马上提价
          </sar-button>
          <sar-button
            v-if="requirementStatusByUser === OrderStatusByUser['工匠待抢单']"
            @click="handleGrabOrder"
            >立即抢单
          </sar-button>
        </view>
      </view>
    </safe-area-layout>
  </view>
</template>

<style lang="scss" scoped></style>
