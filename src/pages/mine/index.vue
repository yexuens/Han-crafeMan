<route lang="jsonc">
{
  "layout": "tabbar",
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
    "navigationBarTitleText": "首页",
    "enablePullDownRefresh": true,
  },
}
</route>

<script lang="ts" setup>
import NavWithSupport from "@/components/navWithSupport.vue";
import {
  addOrEditRequirement,
  queryRequirementList,
  queryRequirementNotice,
} from "@/service/requirement";
import { useNavTransparent } from "@/composables/useNavTransparent";
import { useUserStore } from "@/store";
import { imgRes } from "@/constants";
import { useSafeAreaStyle } from "@/composables/useSafeAreaStyle";
import { isNotEmpty } from "@/utils";
import { toast } from "@/utils/toast";

const user = useUserStore();
const navTransparent = useNavTransparent();
const latestRequirement = ref();
const shareMode = ref<0 | 1>(0);
const { style } = useSafeAreaStyle();
const screenHeight = uni.getSystemInfoSync().windowHeight;
const noticeData = ref("");
const featureList = [
  {
    label: "接单中心",
    showFlag: () => {
      return user.userInfo?.role === 1 && user.userInfo?.remark === 1;
    },
    openType: "none",
    iconUrl: "https://cdn.juesedao.cn/mdy/ea0a4c98c9e64315b620c0f00bef1502\n",
    handleFunc: () => {
      uni.navigateTo({
        url: "/pages-sub/craft_man_order_center/index",
      });
    },
  },
  {
    openType: "none",
    label: "我的资料",
    showFlag: () => true,
    iconUrl: "https://cdn.juesedao.cn/mdy/47c7c9d7935b41e69ee9727a0101c138",
    handleFunc: () => navigateToEditProfile(),
  },

  {
    label: "邀请业主",
    iconUrl: "https://cdn.juesedao.cn/mdy/93afb76a8c1c4060b18cdd85be574bed",
    openType: "share",
    showFlag: () => true,
    handleFunc() {
      shareMode.value = 1;
    },
  },
  {
    label: "邀请工匠",
    showFlag: () => true,
    iconUrl: "https://cdn.juesedao.cn/mdy/e2452f5fa67a432c9774aa4525ca1b71",
    openType: "share",
    handleFunc() {
      shareMode.value = 0;
    },
  },
];

function navigateToAllRequirement() {
  uni.navigateTo({
    url: "/pages-sub/user_orders/index",
  });
}

async function fetchData() {
  const { data } = await queryRequirementList({
    userId: user.userInfo.id,
    curPage: 1,
    jobState: null,
    number: 1,
  });
  if (isNotEmpty(data)) latestRequirement.value = data[0];
}

function navigateToLogin() {
  if (user.isLogin) return;
  uni.navigateTo({
    url: "/pages-sub/login/index",
  });
}

async function fetchNotice() {
  const { data } = await queryRequirementNotice({
    type: 0,
    ...{
      userId: user.userInfo.id || null,
    },
  });
  if (isNotEmpty(data)) {
    noticeData.value = data[0];
  }
}

function navigateToEditProfile() {
  uni.navigateTo({
    url: "/pages-sub/user_profile/index?scene=2",
  });
}

onShow(async () => {
  if (!user.isLogin) return;
  fetchData();
  fetchNotice();
  user.updateUser();
});

onPageScroll((e) => {
  navTransparent.onScroll(e);
});
onPullDownRefresh(async () => {
  if (!user.isLogin) return;
  await fetchData();
  await fetchNotice();
  uni.stopPullDownRefresh();
});

async function handleEditPriceFinished({ data, isSuccess }) {
  specsEditDialogShow.value = false;
  if (!isSuccess) return;
  try {
    await addOrEditRequirement({
      id: latestRequirement.value.id,
      specs: data,
      userId: user.userInfo.id,
    });
    toast.info("修改成功");
  } catch (e) {
    toast.info("修改价格失败");
  } finally {
    fetchData();
  }
}

const specsEditDialogShow = ref(false);
onShareAppMessage(() => {
  return {
    title: shareMode.value ? "邀请业主" : "邀请工人",
    imageUrl: shareMode.value ? imgRes.inviteUserImg : imgRes.inviteCraftsImg,
  };
});
onShareTimeline(() => ({}));
function openEditPriceDialog() {
  specsEditDialogShow.value = true;
}
</script>

<template>
  <view :style="`min-height: ${screenHeight}px`" class="mine_bg flex flex-col">
    <nav-with-support
      :left-arrow="false"
      :transparent="navTransparent.transparent.value"
      title="工作台"
    />
    <view v-if="latestRequirement">
      <specs-edit-dialog
        :id="latestRequirement.id"
        :show="specsEditDialogShow"
        :specs-list="latestRequirement.specs"
        @finish="handleEditPriceFinished"
      />
    </view>
    <view :style="style" class="mx-auto w-90vw">
      <view
        class="mt-20px flex items-center gap-x-12px"
        @click="navigateToLogin"
      >
        <image
          :src="user.userInfo.wxPhoto || imgRes.defaultAvatar"
          class="h48px w48px rounded-full"
        />
        <view class="flex flex-col gap-y-4px justify-center">
          <view class="flex items-center gap-x-4px">
            <view class="text-16px font-bold">
              {{ user.userInfo.wxName || "待登录" }}
            </view>
            <sar-tag
              v-if="user.isLogin"
              root-class="!px-8px"
              round
              theme="primary"
            >
              {{ !user.userInfo?.name ? "业主" : "工匠" }}
            </sar-tag>
          </view>
          <view
            v-if="user.isLogin"
            class="text-12px text-#060606 opacity-60"
            @click="navigateToEditProfile"
          >
            编辑信息
          </view>
        </view>
      </view>
    </view>
    <view class="relative mt-60px h-full flex flex-1 flex-col">
      <view
        class="relative z-10 flex-1 rounded-t-16px bg-white px-16px py-20px"
      >
        <!--        全部工单 -->
        <view
          v-if="user.isLogin"
          class="h-56px w-full flex items-center justify-between rounded-12px bg-primary-500 px-16px text-white"
          @click="navigateToAllRequirement"
        >
          <view class="center">
            <custom-icon :size="21" icon-name="pointIcon" />
            <text class="ml-6px text-16px font-500"> 全部工单</text>
          </view>
          <custom-icon icon-name="rightArrowWhiteIcon" />
        </view>
        <!--        需求卡片 -->
        <view v-if="latestRequirement" class="mt-12px">
          <requirement-card
            :enable-shadow="true"
            :requirement="latestRequirement"
            @addPrice="openEditPriceDialog"
          />
        </view>
        <!--        常用功能 -->
        <view :class="user.isLogin ? 'mt-40px' : 'mt-0'">
          <view class="font-500"> 常用功能</view>
          <view class="grid grid-cols-4 mt-18px gap-40px">
            <block v-for="(item, index) in featureList" :key="index">
              <button
                v-if="item.showFlag()"
                :open-type="item?.openType"
                class="flex flex-col items-center justify-center !bg-transparent !p-0"
                hover-class="none"
                @click="item?.handleFunc"
              >
                <custom-icon :custom-url="item.iconUrl" :size="22" />
                <view class="text-12px opacity-70">
                  {{ item.label }}
                </view>
              </button>
            </block>
          </view>
        </view>
      </view>
      <view
        v-if="user.isLogin && noticeData"
        class="absolute z-9 h-60px w-screen rounded-t-16px bg-#FFE2D4 px-24px py-8px text-12px text-primary-500 -translate-y-35px"
      >
        <view class="flex items-center gap-x-8px">
          <custom-icon :size="20" icon-name="noticeIcon" />
          <text>{{ noticeData }}</text>
        </view>
      </view>
      <view class="text-#c9c6c6 mx-auto mt-24px mb-24px text-12px"
        >-蜜多云科技提供技术支持-
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.mine_bg {
  flex-shrink: 0;
  background: linear-gradient(
    180deg,
    #f8e4db 0%,
    #faf2ee 13.07%,
    #f6f6f6 100.12%
  );
}
</style>
