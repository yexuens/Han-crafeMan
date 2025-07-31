<route lang="jsonc">
{
  "layout": "tabbar",
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
    "navigationBarTitleText": "首页",
    "disableScroll": true,
  },
  "disableScroll": true,
}
</route>

<script lang="ts" setup>
import { imgRes } from "@/constants";
import { useMutation } from "@/http/useMutation";
import { addOrEditRequirement } from "@/service/requirement";
import {
  AddCustomSpecs,
  IAddCustomSpecs,
  IPublishRequirement,
  PublishRequirement,
  showZodError,
} from "@/schemas";
import { useUserStore } from "@/store";
import { queryUnitList } from "@/service/system";
import { isNotEmpty } from "@/utils";
import { useSafeAreaStyle } from "@/composables/useSafeAreaStyle";

const customUnit = reactive<IAddCustomSpecs>({
  unit: "",
  price: NaN,
});
const user = useUserStore();
const form = reactive<IPublishRequirement>({
  address: "",
  area: "",
  pickedSpecs: [],
});
const { mutate: publish } = useMutation(addOrEditRequirement);
const unitList = ref<
  {
    unit: string;
    refPrice: number;
    userPrice: number | null;
  }[]
>([]);
const getSpecs = () =>
  form.pickedSpecs.map((name) => {
    const item = unitList.value.find((unit) => unit.unit === name);
    if (!item) {
      throw new Error("规格不存在");
    }
    return {
      unit: item.unit,
      price: item.userPrice ? item.userPrice : item.refPrice,
    };
  });

async function handlePublish() {
  try {
    if (!user.isLogin) {
      uni.showModal({
        title: "提示",
        content: "请先登录",
        cancelText: "稍后登录",
        confirmText: "去登录",
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: "/pages-sub/login/index",
            });
          }
        },
      });
      return;
    }
    PublishRequirement.parse(form);
    uni.showModal({
      title: "确认发布",
      content: "发布前请确认信息是否填写正确？",
      success: async (res) => {
        if (res.confirm) {
          const specs = JSON.stringify(getSpecs());
          await publish({
            ...form,
            specs,
            userId: user.userInfo.id,
          });
          resetForm();
          await uni.showToast({
            title: "发布成功！",
            icon: "none",
          });
        }
      },
    });
  } catch (error) {
    showZodError(error);
  }
}

function addCustomUnit() {
  const { success, error } = AddCustomSpecs.safeParse(customUnit);
  if (!success) {
    showZodError(error);
    return;
  }
  unitList.value.unshift({
    unit: customUnit.unit,
    refPrice: Number(customUnit.price),
    userPrice: Number(customUnit.price),
  });
  uni.showToast({
    title: "添加成功",
    icon: "none",
  });
  resetCustomUnit();
}

function toggleUnit(name: string) {
  const currentUnit = form.pickedSpecs.find((unit) => unit === name);
  if (currentUnit) {
    const curIdx = form.pickedSpecs.indexOf(currentUnit);
    form.pickedSpecs.splice(curIdx, 1);
  } else {
    form.pickedSpecs.push(name);
  }
}

function resetForm() {
  form.address = "";
  form.area = "";
  form.pickedSpecs = [];
}

function resetCustomUnit() {
  customUnit.unit = "";
  customUnit.price = NaN;
}

async function queryUnits() {
  const { data } = await queryUnitList();
  if (isNotEmpty(data)) {
    const rawData = data[0].children[0].children;
    if (isNotEmpty(rawData)) {
      unitList.value = rawData.map((item) => ({
        unit: item.name,
        refPrice: Number(item.yuliutwo),
        userPrice: null,
      }));
    }
  }
}

onShareAppMessage(() => ({}));
onShareTimeline(() => ({}));

onLoad(() => {
  queryUnits();
});
const menuButtonArea = uni.getMenuButtonBoundingClientRect();
</script>

<template>
  <image
    :src="imgRes.publishTopImg"
    class="absolute left-0 top-0 h-full w-screen -z-1"
    mode="widthFix"
  />
  <view
    :style="`padding-top: ${menuButtonArea.top + menuButtonArea.height}px;`"
  >
    <view
      class="absolute mt-12px w-screen flex items-center justify-center rounded-16px bg-primary-500 px-40px pb-32px pt-16px text-18px text-white -z-1"
    >
      快速简算
    </view>
    <view class="z-11 mt-58px rounded-t-17px bg-white px-16px pt-40px">
      <view class="flex items-center justify-between">
        <view class="text-18px font-600"> 需求填写</view>
        <icon-button
          :height="24"
          :width="28"
          icon-name="serviceIcon"
          open-type="contact"
        />
      </view>
      <view>
        <sar-form :model="form" label-width="160rpx" star-position="right">
          <sar-form-item label="房屋地址" required root-class="!py-24px">
            <sar-input
              v-model="form.address"
              inlaid
              placeholder="请输入城市区域"
            />
          </sar-form-item>
          <sar-form-item label="房屋面积" required root-class="!py-24px">
            <sar-input v-model="form.area" inlaid placeholder="请填写面积">
              <template #append>
                <view class="w-100px text-14px opacity-60"> /㎡</view>
              </template>
            </sar-input>
          </sar-form-item>
          <sar-form-item root-class="!py-24px">
            <view class="flex items-center justify-between pb-6px">
              <view>
                请选择瓷砖规格
                <text style="color: var(--sar-form-item-star-color)"> *</text>
              </view>
              <view class="text-13px text-primary-500">
                已选择（{{ form.pickedSpecs.length }} / {{ unitList.length }}）
              </view>
            </view>
            <scroll-view scroll-y class="hide-scrollbar">
              <view
                class="grid grid-cols-2 mt-12px gap-4 h-160px hide-scrollbar"
              >
                <view
                  v-for="(unit, index) in unitList"
                  :key="index"
                  class="h-70px flex transition-all duration-200 ease-in-out"
                  @click="toggleUnit(unit.unit)"
                >
                  <view
                    v-if="form.pickedSpecs.includes(unit.unit)"
                    class="h-full w-full rounded-7px bg-primary-500 px-16px py-8px text-white tracking-wider"
                  >
                    <view
                      class="border-b-0.5px border-b-white border-b-solid pb-1px text-14px"
                    >
                      {{ unit.unit }}
                    </view>
                    <view
                      class="mt-1px flex items-center justify-between text-12px"
                      style="line-height: 1.3"
                    >
                      <view
                        class="flex-1 border-r-0.5px border-r-white border-r-solid"
                      >
                        <view> 参考价</view>
                        <view class="font-500"> ${{ unit.refPrice }}/㎡</view>
                      </view>
                      <view
                        class="flex flex-1 flex-col items-center"
                        @click.stop
                      >
                        <view> 自主出价</view>
                        <view class="flex items-center gap-x-1px font-500">
                          $
                          <input
                            v-model="unit.userPrice"
                            class="user-price-input"
                          />
                          /㎡
                        </view>
                      </view>
                    </view>
                  </view>
                  <view
                    v-else
                    class="my-auto truncate42 h-52px w-full flex items-center justify-center rounded-7px bg-[#F6F6F6] text-14px text-[#666]"
                  >
                    {{ unit.unit }}
                  </view>
                </view>
              </view>
            </scroll-view>
          </sar-form-item>
          <!--           自定义规格添加 -->
          <view class="mb-28px mt-8px flex items-center justify-between">
            <view
              class="h-45px w-92% flex items-center rounded-8px bg-[#F6F6F6] px-18px text-[#666]"
            >
              <view
                class="w-65% flex items-center justify-center border-r-1px border-r-gray border-r-solid"
              >
                <view class="shrink-0"> 自填规格：</view>
                <input v-model="customUnit.unit" class="custom-unit-input" />
              </view>
              <view class="flex items-center justify-center pl-12px">
                <view class="shrink-0"> 出价：</view>
                <input
                  v-model="customUnit.price"
                  class="custom-unit-input w-50px"
                />
              </view>
            </view>
            <view @click="addCustomUnit">
              <custom-icon icon-name="addIcon" />
            </view>
          </view>
          <sar-button @click="handlePublish"> 确认并发布需求</sar-button>
        </sar-form>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.user-price-input {
  width: 45rpx;
  height: 24rpx !important;
  font-size: 24rpx;
  min-height: 24rpx;
  line-height: 24rpx;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.3);
}

.custom-unit-input {
  font-size: 26rpx;
  min-height: 26rpx;
  line-height: 26rpx;
  border-radius: 3px;
}
</style>
