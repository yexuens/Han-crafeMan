<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="jsonc">
{
  "layout": "customBar",
  "needLogin": true,

  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
  },
}
</route>

<script lang="ts" setup>
import { useUserStore } from "@/store";
import { BannerModule, getBanner, uploadImage } from "@/service/system";
import { updateUserProfile } from "@/service/user";
import { queryCraftsAuthInfo } from "@/service/crafts";
import { isNotEmpty } from "@/utils";
import { getExamResultInit, IExamResult, stepList } from "./index";
import { areArraysEqual } from "@/utils/array";

const { screenHeight } = uni.getWindowInfo();

const user = useUserStore();
const step = ref(1);
const examList = ref([]);
const examResultList = ref<IExamResult[]>([]);
const videoUrl = ref("");
const form = reactive({
  yuliuone: "", //身份证照片人像面
  yuliutwo: "", //身份证照片国徽面
  progress: 0,
});
const currentExamItemIndex = ref(0);
const isFinishedLearn = computed(() => form.progress >= 94);
const reviewResultInfo = computed(() => {
  switch (user.userInfo?.integral) {
    case 1:
      return {
        label: "等待管理员审核",
        theme: "info",
      };
    case 2:
      return {
        label: "审核通过",
        theme: "success",
      };
    case 3:
      return {
        label: "审核不通过，请联系客服",
        theme: "danger",
      };
  }
});
const rightExamItemCount = ref(0);
const nextStepBtnDisabled = computed(() => {
  switch (step.value) {
    case 1:
      return !form.yuliuone || !form.yuliutwo;
    case 2:
      return !isFinishedLearn.value;
    case 3:
      const result = examResultList.value[currentExamItemIndex.value];
      return (
        result &&
        !(result.questionType === 1 ? result.answer : isNotEmpty(result.answer))
      );
    default:
      return false;
  }
});
const nextStepBtnLabel = computed(() => {
  switch (step.value) {
    case 2:
      return isFinishedLearn.value ? "下一步" : "请先完成视频学习";
    case 3:
      const item = examResultList.value[currentExamItemIndex.value];
      if (item && item.questionType === 2 && !item.multiConfirm) {
        return "确认多选题答案";
      }
      return currentExamItemIndex.value < examResultList.value.length - 1
        ? "下一题"
        : "查看结果";
    case 4:
      return "确认提交";
    case 5:
      return "返回主页";
    default:
      return "下一步";
  }
});
const submitFunc = {
  async handleIdCardSubmit() {
    const { code } = await updateUserProfile({
      userId: user.userInfo.id,
      yuliuone: form.yuliuone,
      yuliutwo: form.yuliutwo,
    });
    if (code === 1) step.value += 1;
  },
  async handleCompleteVideoSubmit() {
    if (!isNotEmpty(examList.value)) {
      handleCertificateSuccess();
      return;
    }
    if (user.userInfo.number !== 1) {
      const { code } = await updateUserProfile({
        userId: user.userInfo.id,
        number: 1,
      });
    }
    step.value += 1;
  },
  async handleSubmitExamResult() {
    const { code } = await updateUserProfile({
      userId: user.userInfo.id,
      remark: 1,
      delFlag: `${rightExamItemCount.value}/${examList.value.length}`,
      integral: 1,
    });
    if (code === 1) {
      step.value += 1;
    }
  },
};

async function fetchExamAndInitResult() {
  const { data } = await queryCraftsAuthInfo({
    type: 0,
  });
  if (isNotEmpty(data)) {
    examList.value.push(...(data as any[]));
    examResultList.value = getExamResultInit(data);
  }
}

function getStepByUser() {
  switch (true) {
    case user.userInfo.integral !== 0:
      step.value = 5;
      break;
    case user.userInfo.number === 1:
      step.value = 3;
      break;
    case !!user.userInfo.yuliutwo && !!user.userInfo.yuliuone:
      step.value = 2;
      break;

    default:
      step.value = 1;
  }
}
async function handleCertificateSuccess() {
  await uni.showModal({
    title: "恭喜您",
    content: "提交成功，等待管理员审核通过",
    showCancel: false,
    confirmText: "返回主页",
  });
  uni.reLaunch({
    url: "/pages/index/index",
  });
}
async function handleUploadIdCardPics(type: "yuliuone" | "yuliutwo") {
  const chooseAndUpload = () =>
    new Promise((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        async success(res) {
          form[type] = await uploadImage(res.tempFilePaths[0]);
          resolve(true);
        },
      });
    });
  if (form[type]) {
    const { confirm } = await uni.showModal({
      title: "是否需要重新上传身份证?",
    });
    if (confirm) await chooseAndUpload();
  } else {
    await chooseAndUpload();
  }
}

async function handleNextQuestionOrFinished() {
  const current = examResultList.value[currentExamItemIndex.value];
  if (!current.multiConfirm && current.questionType === 2) {
    const { confirm } = await uni.showModal({
      title: "请确认您的答案",
    });
    if (confirm) current.multiConfirm = true;
    return;
  }
  if (
    current.questionType === 2
      ? areArraysEqual(
          current.answer as string[],
          current.correctAnswer as string[],
        )
      : current.answer === current.correctAnswer
  ) {
    rightExamItemCount.value += 1;
  }
  if (currentExamItemIndex.value < examResultList.value.length - 1) {
    currentExamItemIndex.value += 1;
  } else {
    step.value += 1;
  }
}

async function handleNextStep() {
  switch (step.value) {
    case 1:
      submitFunc.handleIdCardSubmit();
      break;
    case 2:
      submitFunc.handleCompleteVideoSubmit();
      break;
    case 3:
      handleNextQuestionOrFinished();
      break;
    case 4:
      await submitFunc.handleSubmitExamResult();
      handleCertificateSuccess();
      break;
    case 5:
      uni.reLaunch({
        url: "/pages/index/index",
      });
      break;
    default:
      break;
  }
}

function handleVideoProgressUpdate(e) {
  const { currentTime, duration } = e.detail;
  if (!duration || duration <= 0) {
    form.progress = 0; // 如果时长无效，进度设为0
    return;
  }
  const progressPercentage = (currentTime / duration) * 100;
  form.progress = Math.round(progressPercentage); // 四舍五入为整数
}

function handleItemPicked({
  answer,
  questionType,
  index,
}: {
  answer: string;
  questionType: 1 | 2;
  index: number;
}) {
  if (questionType === 1)
    examResultList.value[index] = {
      ...examResultList.value[index],
      answer,
    };
  if (questionType === 2) {
    const result = examResultList.value[index];
    const answerList = result.answer as string[];
    const answerIndex = answerList.indexOf(answer);
    if (answerIndex === -1) {
      answerList.push(answer);
    } else {
      answerList.splice(answerIndex, 1);
    }
    answerList.sort((a, b) => a.localeCompare(b));
  }
}

async function resetExam() {
  const { confirm } = await uni.showModal({
    title: "提示",
    content: "您确定重新答题吗？",
  });
  if (confirm) {
    examResultList.value = getExamResultInit(examList.value);
    step.value = 3;
    currentExamItemIndex.value = 0;
  }
}
async function fetchVideoUrl() {
  const { records } = await getBanner(BannerModule.video);
  if (isNotEmpty(records)) videoUrl.value = records[0].url;
}
onLoad(async () => {
  await user.updateUser();
  form.yuliuone = user.userInfo.yuliuone;
  form.yuliutwo = user.userInfo.yuliutwo;
  getStepByUser();
  fetchExamAndInitResult();
  fetchVideoUrl();
});
</script>

<template>
  <view :style="`min-height: ${screenHeight}px`" class="bg relative">
    <safe-area-layout>
      <view v-for="(stepItem, index) in stepList" :key="index">
        <view v-if="step === index + 1" class="px-16px py-30px">
          <view class="primary-text pb-100px">
            {{ stepItem.label }}
          </view>

          <template v-if="step === 1">
            <view class="flex flex-col items-center gap-y-30px">
              <view
                class="h-180px w-240px flex gap-y-12px justify-center flex-col"
                @click="handleUploadIdCardPics('yuliuone')"
              >
                <view>人像面：</view>
                <image
                  :src="
                    form.yuliuone
                      ? form.yuliuone
                      : 'https://cdn.juesedao.cn/mdy/1da86280c2f74556b1e401ed5e8459c8'
                  "
                  class="h-full w-full rounded-8px"
                  mode="aspectFill"
                />
              </view>
              <view
                class="h-180px w-240px flex gap-y-12px justify-center flex-col"
                @click="handleUploadIdCardPics('yuliutwo')"
              >
                <view>国徽面：</view>
                <image
                  :src="
                    form.yuliutwo
                      ? form.yuliutwo
                      : 'https://cdn.juesedao.cn/mdy/f7ff2e88ed8e43aa907544e9b7f2f070'
                  "
                  class="h-full w-full rounded-8px"
                  mode="aspectFill"
                />
              </view>
            </view>
          </template>

          <template v-if="step === 2">
            <view class="flex flex-col items-center gap-y-30px">
              <view class="h-220px w-350px flex items-center justify-center">
                <video
                  class="h-full w-full"
                  mode="aspectFill"
                  :src="videoUrl"
                  @timeupdate="handleVideoProgressUpdate"
                />
              </view>
              <view class="primary-text">
                学习进度：
                {{ isFinishedLearn ? 100 : form.progress }}
                %
              </view>
            </view>
          </template>

          <template
            v-if="
              step === 3 && isNotEmpty(examResultList) && isNotEmpty(examList)
            "
          >
            <view class="mb-12px font-bold">
              {{ currentExamItemIndex + 1 }}/{{ examList.length }}题
            </view>
            <exam-item
              v-for="(item, index) in examList"
              v-show="currentExamItemIndex === index"
              :key="index"
              :answer="examResultList[index].answer"
              :answer-analysis="item.answerAnalysis"
              :correct-answer="item.correctAnswer"
              :multi-confirm="examResultList[index].multiConfirm"
              :options="
                item.options?.map((_item) => ({
                  label: _item,
                  value: _item[0],
                }))
              "
              :question-content="item.questionContent"
              :question-type="item.questionType"
              @update:answer="
                ({ answer, questionType }) =>
                  handleItemPicked({
                    answer,
                    questionType,
                    index,
                  })
              "
            />
          </template>
          <template v-if="step === 4">
            <view
              class="flex items-center justify-center flex-col gap-y-18px px-8px py-36px bg-white rounded-8px"
            >
              <view class="font-bold">考试结果</view>
              <sar-progress-circle
                :percent="
                  examList.length > 0
                    ? Number(
                        ((rightExamItemCount / examList.length) * 100).toFixed(
                          2,
                        ),
                      )
                    : 0
                "
              />
              <view class="text-14px text-gray-6 font-bold">
                答题情况
                {{ rightExamItemCount }}/{{ examList.length }}
              </view>
              <sar-button block theme="info" @click="resetExam"
                >重新答题
              </sar-button>
            </view>
          </template>
          <template v-if="step === 5">
            <view
              class="flex items-center justify-center flex-col gap-y-18px px-8px py-36px bg-white rounded-8px"
            >
              <sar-tag
                root-class="!text-16px"
                :theme="reviewResultInfo.theme as any"
                >{{ reviewResultInfo.label }}</sar-tag
              >
            </view>
          </template>
          <sar-button
            :disabled="nextStepBtnDisabled"
            root-class="!mt-40px"
            @click="handleNextStep"
          >
            {{ nextStepBtnLabel }}
          </sar-button>
        </view>
      </view>
    </safe-area-layout>
  </view>
</template>

<style lang="scss" scoped>
.primary-text {
  color: #000;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%;
}

.bg {
  background: linear-gradient(
    180deg,
    #fc7c44 10.05%,
    #f6f6f6 24.44%,
    #f6f6f6 100.12%
  );
}
</style>
