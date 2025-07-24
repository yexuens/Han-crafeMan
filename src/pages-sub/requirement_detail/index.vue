<route lang="jsonc">
{
  "layout": "default",
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
  craftManRequirementStatusText,
  jobStateNoticeInfo,
  RequirementStatus,
  RequirementStatusByUser,
} from "@/enums/requirement";
import { isNotEmpty, navigateBack } from "@/utils";
import { toast } from "@/utils/toast";

const { screenHeight } = uni.getWindowInfo();
const requirementDetail = ref();
//  1. 工匠 0. 用户
const userRole = computed(() => 0);
const jobState = computed(() => requirementDetail.value?.jobState);
const requirementStatusByUser = computed<RequirementStatusByUser>(() => {
  if (requirementDetail.value) {
    if (
      jobState.value === RequirementStatus.WasCanceled ||
      jobState.value === RequirementStatus.Completed
    ) {
      return RequirementStatusByUser["已完成/已取消"];
    }
    if (userRole.value === 0) {
      // 用户提价
      if (jobState.value === RequirementStatus.Published) {
        return RequirementStatusByUser["用户已发单,工匠未接单"];
      }
    }
    if (userRole.value === 1) {
      // 工匠抢单
      if (jobState.value === RequirementStatus.Published) {
        return RequirementStatusByUser["工匠待抢单"];
      }
    }
  }
  // 其余情况，统一取消订单，联系客服
  return RequirementStatusByUser["取消接单"];
});
const id = ref();
const specsEditDialogShow = ref(false);
const userId = ref(1);

async function getDetail(id: number) {
  const { data } = await queryRequirementList({
    id,
  });
  if (isNotEmpty(data)) {
    let rawData = data[0];
    requirementDetail.value = {
      ...rawData,
      specs: rawData.specs?.startsWith("[") ? JSON.parse(rawData.specs) : [],
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
            jobState: RequirementStatus.WasCanceled.valueOf(),
            ...(userRole.value === 1 && { accesUserId: userId.value }),
            ...(userRole.value === 0 && { userId: userId.value }),
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
      userId: userId.value || 1,
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
  if (requirementDetail.value) {
    if (userRole.value === 0 && requirementDetail.value.userId === userId.value)
      return;
    if (
      requirementDetail.value.jobState === RequirementStatus.Published ||
      (userRole.value === 1 &&
        requirementDetail.value.accesUserId === userId.value)
    )
      return;
  }
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
              :color="craftManRequirementStatusText[jobState].bgColor"
              :size="'small'"
            >
              {{
                userRole === 0
                  ? craftManRequirementStatusText[jobState].user
                  : craftManRequirementStatusText[jobState].crafeman
              }}
            </sar-tag>
          </view>
          <view class="text-12px opacity-60">
            发布时间：{{ requirementDetail.createTime }}
          </view>
        </view>
        <view
          v-if="jobStateNoticeInfo[jobState]"
          :style="{
            backgroundColor: jobStateNoticeInfo[jobState].bgColor,
            color: jobStateNoticeInfo[jobState].textColor,
          }"
          class="w-full rounded-t-16px h-40px flex items-center px-5vw gap-x-6px"
        >
          <custom-icon
            v-if="jobStateNoticeInfo[jobState].icon"
            :icon-name="jobStateNoticeInfo[jobState].icon"
          />
          <text class="text-12px font-500"
            >{{
              userRole === 0
                ? jobStateNoticeInfo[jobState].user
                : jobStateNoticeInfo[jobState].crafeman
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
          <view class="flex justify-between w-full text-14px">
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
            v-if="
              jobState !== RequirementStatus.Published ||
              (jobState === RequirementStatus.WasCanceled &&
                requirementDetail.workmanName)
            "
            class="flex justify-between w-full text-14px"
          >
            <view class="text-#060606 opacity-60 shrink-0 pr-48px">接单人</view>
            <view>{{ requirementDetail.workmanName }}</view>
          </view>
          <view
            v-if="
              jobState === RequirementStatus.GroupCodeUploaded ||
              jobState === RequirementStatus.GroupConnecting ||
              jobState === RequirementStatus.Completed
            "
            class="flex justify-between w-full text-14px"
          >
            <view class="text-#060606 opacity-60 shrink-0 pr-48px">项目群</view>
            <view>{{ requirementDetail.qrCode }}</view>
          </view>
        </view>
      </view>

      <view
        v-if="
          requirementStatusByUser !== RequirementStatusByUser['已完成/已取消']
        "
        class="fixed bottom-0 px-5vw pt-8px pb-24px border-t-solid border-t-gray-200 border-t-1px w-full h-81px flex items-center gap-x-16px"
      >
        <view
          v-if="
            requirementStatusByUser !== RequirementStatusByUser['工匠待抢单']
          "
          class="max-w-35% shrink-0 gap-x-8px h-full flex items-center justify-between"
        >
          <button
            hover-class="none"
            class="flex items-center flex-col m-0 p-0 after:border-none"
            open-type="contact"
          >
            <custom-icon icon-name="lianXiKeFuIcon" />
            <view class="text-12px text-#060606">联系客服</view>
          </button>
          <button
            v-if="
              requirementStatusByUser ===
              RequirementStatusByUser['用户已发单,工匠未接单']
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
            v-if="
              requirementStatusByUser === RequirementStatusByUser['取消接单']
            "
            @click="handleCancel"
            >申请取消
          </sar-button>
          <sar-button
            v-if="
              requirementStatusByUser ===
              RequirementStatusByUser['用户已发单,工匠未接单']
            "
            @click="openEditPriceDialog"
            >马上提价
          </sar-button>
          <sar-button
            v-if="
              requirementStatusByUser === RequirementStatusByUser['工匠待抢单']
            "
            @click="handleGrabOrder"
            >立即抢单
          </sar-button>
        </view>
      </view>
    </safe-area-layout>
  </view>
</template>

<style lang="scss" scoped></style>
