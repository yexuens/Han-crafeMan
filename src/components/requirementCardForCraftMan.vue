<script lang="ts" setup>
import dayjs from "dayjs";
import { formatDurationSmart } from "@/utils/time";
import { OrderStatus } from "@/enums";
import { previewImg } from "@/utils";

const orderRightLabelMap = {
  [OrderStatus.Published]: {
    text: "待抢单",
    customClass: "text-[#F6631B]",
    menuBg: "bg-[#2A86FF]",
  },
  [OrderStatus.Accepted]: {
    text: "等待平台上传项目群",
    customClass: "text-[#00A878] ",
    menuBg: "bg-[#00A878]",
  },
  [OrderStatus.GroupCodeUploaded]: {
    text: "请尽快加入项目群沟通",
    customClass: "text-[#B32020] ",
    menuBg: "bg-[#B32020]",
  },
  [OrderStatus.GroupConnecting]: {
    text: "群内对接中",
    customClass: "text-[#733617]",
    menuBg: "bg-[#733617]",
  },
  [OrderStatus.WasCanceled]: {
    text: "工单已取消",
    customClass: "text-[#a7a7a7] ",
    menuBg: "bg-[#e1e1e1]",
  },
  [OrderStatus.Completed]: {
    text: "工单已完成",
    customClass: "text-[#a7a7a7] ",
    menuBg: "bg-[#e1e1e1]",
  },
};
const bottomBtnGroupMap = {
  [OrderStatus.Published]: [
    {
      label: "马上抢单",
      onClick: () => emits("grab", data.value.id),
      rootStyle: {
        color: "white",
        backgroundColor: "#F6631B",
      },
    },
    {
      label: "查看详情",
      onClick: () => navigateToDetail(),
      rootStyle: {
        color: "#F6631B",
        backgroundColor: "white",
        border: "1rpx solid #F6631B",
      },
    },
  ],
  [OrderStatus.Accepted]: [
    {
      label: "取消接单",
      onClick: () => {
        emits("cancel", data.value?.id);
      },
      rootStyle: {
        color: "#10AD80",
        backgroundColor: "white",
        border: "1rpx solid #10AD80",
      },
    },
    {
      label: "查看详情",
      onClick: () => navigateToDetail(),
      rootStyle: {
        color: "white",
        backgroundColor: "#10AD80",
      },
    },
  ],
  [OrderStatus.GroupCodeUploaded]: [
    {
      label: "取消接单",
      onClick: () => {
        emits("cancel", data.value?.id);
      },
      rootStyle: {
        color: "white",
        backgroundColor: "#B32020",
      },
    },
    {
      label: "查看详情",
      onClick: () => navigateToDetail(),
      rootStyle: {
        color: "#B32020",
        backgroundColor: "white",
        border: "1rpx solid #B32020",
      },
    },
    {
      label: "联系客服",
      openType: "contact",
      rootStyle: {
        color: "#B32020",
        backgroundColor: "white",
        border: "1rpx solid #B32020",
      },
      icon: "redServiceIcon",
      customClass: "mr-auto",
    },
  ],
  [OrderStatus.GroupConnecting]: [
    {
      label: "查看详情",
      onClick: () => navigateToDetail(),
      rootStyle: {
        color: "#6a6a6a",
        backgroundColor: "white",
        border: "1rpx solid #E7E7E7",
      },
    },
  ],
  [OrderStatus.WasCanceled]: [
    {
      label: "查看详情",
      onClick: () => navigateToDetail(),
      rootStyle: {
        color: "#6a6a6a",
        backgroundColor: "white",
        border: "1rpx solid #E7E7E7",
      },
    },
  ],
  [OrderStatus.Completed]: [
    {
      label: "查看详情",
      onClick: () => navigateToDetail(),
      rootStyle: {
        color: "#6a6a6a",
        backgroundColor: "white",
        border: "1rpx solid #E7E7E7",
      },
    },
  ],
};

const props = defineProps(["requirement"]);
const emits = defineEmits(["cancel", "grab", "detail"]);

const bottomBtnGroupByStatus = computed(() => bottomBtnGroupMap[status.value]);

const status = computed(() => data.value?.jobState);
const data = computed(() => {
  if (props.requirement) {
    const now = dayjs();
    return {
      ...props.requirement,
      createTime: dayjs(props.requirement.createTime).format(
        "YYYY.MM.DD HH:mm",
      ),
      publishedTime: formatDurationSmart(props.requirement.createTime, now),
    };
  }
  return {} as any;
});
const hasQrCode = computed(
  () =>
    data.value?.jobState === OrderStatus.GroupCodeUploaded ||
    OrderStatus.GroupConnecting,
);

function navigateToDetail() {
  emits("detail", data.value.id);
}
</script>

<template>
  <view class="relative rounded-8px bg-white py-16px">
    <view class="flex pb-8px items-center justify-between bb">
      <view class="font-500 px-16px text-14px">
        {{ data.orderNo }}
      </view>
      <view
        :class="orderRightLabelMap[status].customClass"
        class="text-14px px-16px"
      >
        {{ orderRightLabelMap[status].text }}
      </view>
    </view>
    <view :class="[hasQrCode ? ' pb-16px bb' : '']" class="px-16px">
      <view class="flex flex-col mt-20px gap-y-12px text-14px">
        <view class="flex items-center justify-between">
          <view class="text-#060606 opacity-30 shrink-0 pr-48px">
            施工面积
          </view>
          <view>
            {{ data.area }}
          </view>
        </view>
        <view class="flex items-center justify-between">
          <view class="text-#060606 opacity-30 shrink-0 pr-48px">
            客户名称
          </view>
          <view>
            {{ data.ownerName }}
          </view>
        </view>

        <view class="flex justify-between">
          <view class="text-#060606 opacity-30 shrink-0 pr-48px"
            >铺贴规格
          </view>
          <view>
            {{ data.specs.map((item) => item.unit)?.join(";\t") }}
          </view>
        </view>
        <view class="flex items-center justify-between">
          <view class="text-#060606 opacity-30 shrink-0 pr-48px"
            >详细地址
          </view>
          <view>
            {{ data.address }}
          </view>
        </view>
      </view>
    </view>
    <view class="px-16px mt-24px">
      <view
        v-if="
          OrderStatus.GroupCodeUploaded === status ||
          OrderStatus.GroupConnecting === status
        "
        class="w-full flex items-center justify-between"
      >
        <view class="text-14px flex flex-col gap-y-8px">
          <view class="opacity-30"> 项目群二维码</view>
          <view> 请尽快扫码加入项目群</view>
        </view>
        <image
          @click="previewImg(data.qrCode)"
          class="h-72px w-72px"
          mode="aspectFill"
          :src="data.qrCode"
        />
      </view>
    </view>
    <view class="flex px-16px flex-row-reverse mt-28px gap-x-12px">
      <button
        v-for="item in bottomBtnGroupByStatus"
        :key="item.label"
        :class="[item?.customClass]"
        :open-type="item?.openType"
        :style="item.rootStyle"
        class="min-w-88px p-0 m-0 center gap-x-8px h-32px rounded-8px text-12px"
        @click="item?.onClick"
      >
        <custom-icon v-if="item.icon" :icon-name="item.icon" />
        {{ item.label }}
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.check_status_line {
  z-index: 1;
}

.uncheck_status_line {
  z-index: 0;
}

.check_status_line:after {
  content: "";
  display: block;
  position: absolute;
  height: 1px;
  top: 20rpx;
  right: 40rpx;
  background: #f86919;
  width: 150%;
  z-index: 0;
}

.uncheck_status_line:after {
  content: "";
  display: block;
  position: absolute;
  height: 1px;
  top: 20rpx;
  right: 40rpx;
  background: #ebebeb;
  width: 150%;
  z-index: 0;
}

.bb {
  @apply border-b-solid border-b-gray-100 border-b-0.1px;
}
</style>
