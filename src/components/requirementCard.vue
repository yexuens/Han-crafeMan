<script lang="ts" setup>
import dayjs from "dayjs";
import { formatDurationSmart } from "@/utils/time";
import { OrderStatus } from "@/enums";
import { previewImg } from "@/utils";

const orderRightTipsMap: Record<OrderStatus, TipInfo> = {
  [OrderStatus.FillingRequirements]: {
    bgColor: "#f8dc8e",
    text: "待接单",
    textColor: "#c89300",
  },
  [OrderStatus.Published]: {
    bgColor: "#f8dc8e",
    text: "待接单",
    textColor: "#c89300",
  },
  [OrderStatus.Accepted]: {
    bgColor: "#f6631b",
    text: "已接单",
    textColor: "#ffffff",
  },
  [OrderStatus.GroupCodeUploaded]: {
    bgColor: "#b32020",
    text: "待入群",
    textColor: "#ffffff",
  },
  [OrderStatus.GroupConnecting]: {
    bgColor: "#10ad80",
    text: "群内对接",
    textColor: "#ffffff",
  },
  [OrderStatus.WasCanceled]: {
    bgColor: "#e1e1e1",
    text: "已取消",
    textColor: "#ffffff",
  },
  [OrderStatus.Completed]: {
    bgColor: "#e1e1e1",
    text: "已完成",
    textColor: "#ffffff",
  },
};
const statusList = [
  {
    label: "填写需求",
    status: -1,
  },
  {
    label: "已发布",
    status: 0,
  },
  {
    label: "已接单",
    status: 1,
  },
  {
    label: "群码上传",
    status: 2,
  },
  {
    label: "群内对接",
    status: 3,
  },
];
type TipInfo = {
  bgColor: string;
  text: string;
  textColor: string;
};
interface IProps {
  requirement: any;
  enableShadow?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  enableShadow: false,
});
const emit = defineEmits(["addPrice"]);
const status = computed(() => data.value?.jobState);
const data = computed(() => {
  const now = dayjs();
  if (props.requirement) {
    return {
      ...props.requirement,
      createTime: dayjs(props.requirement.createTime).format(
        "YYYY.MM.DD HH:mm",
      ),
      publishedTime: formatDurationSmart(props.requirement.createTime, now),
    };
  }
});

function handleAddPrice() {
  emit("addPrice", data.value);
}
function navigateToDetail() {
  uni.navigateTo({
    url: `/pages-sub/order_detail/index?id=${data.value?.id}`,
  });
}
</script>

<template>
  <view
    @click="navigateToDetail"
    class="relative rounded-8px bg-white px-18px py-24px"
    :style="
      enableShadow ? 'box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.25)' : ''
    "
  >
    <view
      :style="{
        backgroundColor: orderRightTipsMap[status].bgColor,
        color: orderRightTipsMap[status].textColor,
      }"
      class="absolute right-36rpx top-0 flex items-center justify-center rounded-b-6px bg-primary-500 px-16px py-8px text-12px text-white shadow-md"
    >
      {{ orderRightTipsMap[status].text }}
    </view>
    <view
      class="font-bold pb-12px border-b-solid border-b-gray-300 border-b-0.5px text-16px"
    >
      {{ data.orderNo }}
    </view>
    <view class="flex flex-col mt-12px gap-y-12px text-12px text-#979797">
      <view>房屋地址 佛山市南海区季华东路万科金域..</view>
      <view>发布时间 {{ data.createTime }}</view>
      <view>发布详情 点击查看</view>
    </view>
    <view class="mt24px flex items-center justify-between">
      <view
        class="flex flex-col gap-y-4px text-14px"
        style="width: calc(100% - 200rpx)"
      >
        <view
          v-if="OrderStatus.Accepted <= status"
          class="flex items-center gap-x-8px"
        >
          <view class="text-primary-500"> 接单人</view>
          <view class="font-bold">
            {{ data.workmanName }}
          </view>
        </view>
        <view class="flex items-center gap-x-8px">
          <view class="text-primary-500"> 已发布</view>
          <view class="font-bold">
            {{ data.publishedTime }}
          </view>
        </view>
      </view>
      <view @click.stop>
        <sar-button
          :disabled="status >= OrderStatus.Accepted"
          root-class="!h-32px"
          @click="handleAddPrice"
        >
          马上加价
        </sar-button>
      </view>
    </view>
    <view
      v-if="
        !(
          status === OrderStatus.WasCanceled || status === OrderStatus.Completed
        )
      "
      class="grid grid-cols-5 mt-40px justify-items-center"
    >
      <view
        v-for="(item, index) in statusList"
        :key="index"
        class="relative flex flex-col items-center"
      >
        <view
          :class="[
            index === 0
              ? ''
              : item.status <= status
                ? 'check_status_line'
                : 'uncheck_status_line',
          ]"
          class="line"
        />
        <custom-icon
          :icon-name="
            item.status <= status ? 'checkedStatusIcon' : 'unCheckedStatusIcon'
          "
          :size="20"
          custom-class="z-11 relative"
        />
        <view class="mt-8px text-11px">
          {{ item.label }}
        </view>
      </view>
    </view>
    <view class="mt16px" @click.stop>
      <view
        v-if="OrderStatus.GroupCodeUploaded === status"
        class="h-48px w-full flex items-center justify-between"
      >
        <view class="text-12px"> 请扫码进入项目群...</view>
        <image
          @click="previewImg(data.qrCode)"
          class="h-48px w-48px"
          mode="aspectFill"
          :src="data.qrCode"
        />
      </view>
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
</style>
