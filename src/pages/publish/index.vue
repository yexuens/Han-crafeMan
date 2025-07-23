<route lang="jsonc">
{
  "layout": "tabbar",
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
    "navigationBarTitleText": "首页",
  },
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

const customUnit = reactive<IAddCustomSpecs>({
  name: "",
  price: NaN,
});
const form = reactive<IPublishRequirement>({
  address: "",
  area: "",
  pickedSpecs: [],
});
const { mutate: publish } = useMutation(addOrEditRequirement);
const unitList = ref<
  {
    name: string;
    refPrice: number;
    userPrice: number | null;
  }[]
>([
  {
    name: "200x1200mm",
    refPrice: 24,
    userPrice: null,
  },
  {
    name: "300x600mm",
    refPrice: 18,
    userPrice: null,
  },
  {
    name: "600x600mm",
    refPrice: 28,
    userPrice: null,
  },
  {
    name: "800x800mm",
    refPrice: 35,
    userPrice: null,
  },
  {
    name: "400x800mm",
    refPrice: 22,
    userPrice: null,
  },
  {
    name: "750x1500mm",
    refPrice: 58,
    userPrice: null,
  },
  {
    name: "900x1800mm",
    refPrice: 75,
    userPrice: null,
  },
  {
    name: "300x300mm",
    refPrice: 12,
    userPrice: null,
  },
]);
const getSpecs = () =>
  form.pickedSpecs.map((name) => {
    const item = unitList.value.find((unit) => unit.name === name);
    if (!item) {
      throw new Error("规格不存在");
    }
    return {
      unit: item.name,
      price: item.userPrice ? item.userPrice : item.refPrice,
    };
  });

async function handlePublish() {
  try {
    PublishRequirement.parse(form);
    const specs = JSON.stringify(getSpecs());
    await publish({
      ...form,
      specs,
      userId: 1,
    });
    resetForm();
    await uni.showToast({
      title: "发布成功！",
      icon: "none",
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
  unitList.value.push({
    name: customUnit.name,
    refPrice: Number(customUnit.price),
    userPrice: Number(customUnit.price),
  });
  uni.showToast({
    title: "添加成功",
    icon: "none",
  });
  resetCustomUnit();
}

function toggleUnit({ name }: { name: string }) {
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
  customUnit.name = "";
  customUnit.price = NaN;
}
</script>

<template>
  <image
    :src="imgRes.publishTopImg"
    class="absolute left-0 top-0 h-full w-screen -z-1"
    mode="widthFix"
  />
  <safe-area-layout>
    <view
      class="absolute mt-12px w-screen flex items-center justify-center rounded-16px bg-primary-500 px-40px pb-32px pt-16px text-18px text-white -z-1"
    >
      快速简算
    </view>
    <view class="z-11 mt-68px rounded-t-17px bg-white px-16px pt-40px">
      <view class="flex items-center justify-between">
        <view class="text-18px font-600"> 需求填写</view>
        <custom-icon :height="24" :width="28" icon-name="serviceIcon" />
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
            <view class="flex items-center justify-between">
              <view>
                请选择瓷砖规格
                <text style="color: var(--sar-form-item-star-color)"> *</text>
              </view>
              <view class="text-13px text-primary-500">
                已选择（{{ form.pickedSpecs.length }} / {{ unitList.length }}）
              </view>
            </view>
            <view
              class="grid grid-cols-2 mt-12px h-160px gap-4 overflow-y-auto"
            >
              <view
                v-for="(unit, index) in unitList"
                :key="index"
                class="h-70px flex transition-all duration-200 ease-in-out"
                @click="toggleUnit(unit)"
              >
                <view
                  v-if="form.pickedSpecs.includes(unit.name)"
                  class="h-full w-full rounded-7px bg-primary-500 px-16px py-8px text-white tracking-wider"
                >
                  <view
                    class="border-b-0.5px border-b-white border-b-solid pb-1px text-14px"
                  >
                    {{ unit.name }}
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
                    <view class="flex flex-1 flex-col items-center" @click.stop>
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
                  class="my-auto h-52px w-full flex items-center justify-center rounded-7px bg-[#F6F6F6] text-14px text-[#666]"
                >
                  {{ unit.name }}
                </view>
              </view>
            </view>
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
                <input v-model="customUnit.name" class="custom-unit-input" />
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
  </safe-area-layout>
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
