<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="jsonc">
{
  "layout": "customBar",
  "needLogin": true,

  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
    "disableScroll": true,
  },
}
</route>

<script lang="ts" setup>
import { useUserStore } from "@/store";
import { uploadImage } from "@/service/system";
import { updateUserProfile } from "@/service/user";
import { queryCraftsAuthInfo } from "@/service/crafts";
import { isNotEmpty } from "@/utils";

interface IExamResult {
  questionType: 1 | 2;
  answer: string | string[];
  correctAnswer: string | string[];
  multiConfirm?: boolean;
}

const { screenHeight } = uni.getWindowInfo();

const user = useUserStore();
const step = ref(4);
const stepList = ref([
  {
    label: "第一步 请上传或拍摄身份证",
  },

  {
    label: "第二步 完成视频学习",
  },

  {
    label: "第三步 工匠考试",
  },
  {
    label: "第四步 确认考试",
  },
]);
const isFinishedLearn = ref(false);
const examList = ref([]);

const examResultList = ref<IExamResult[]>([]);
const form = reactive({
  yuliuone: "", //身份证照片人像面
  yuliutwo: "", //身份证照片国徽面
  progress: 0,
});
const currentExamIndex = ref(0);
const isFinishedStep = computed(() => step.value >= stepList.value.length);
watchEffect(() => {
  console.log(examResultList.value);
});
const nextStepBtnDisabled = computed(() => {
  switch (step.value) {
    case 1:
      return !form.yuliuone && !form.yuliutwo;
    case 2:
      return !isFinishedLearn.value;
    case 3:
      const result = examResultList.value[currentExamIndex.value];
      return !(result?.questionType === 1
        ? result?.answer
        : isNotEmpty(result?.answer));
    default:
      return false;
  }
});
const nextStepBtnLabel = computed(() => {
  switch (step.value) {
    case 2:
      return isFinishedLearn.value ? "下一步" : "请先完成视频学习";
    case 3:
      const item = examResultList.value[currentExamIndex.value];
      if (item?.questionType === 2 && !item?.multiConfirm) {
        return "确认多选题答案";
      }
      return currentExamIndex.value < examResultList.value.length - 1
        ? "下一题"
        : "完成考试";
    default:
      return "下一步";
  }
});

async function fetchExamAndInitResult() {
  const { data } = await queryCraftsAuthInfo({
    type: 0,
  });
  if (isNotEmpty(data)) {
    examList.value.push(...(data as any[]));
    examResultList.value = examList.value.map((item) => ({
      questionType: item.questionType,
      answer: item.questionType === 1 ? "" : [],
      correctAnswer:
        item.questionType === 2
          ? item.correctAnswer.split(",")
          : item.correctAnswer,
      ...{ multiConfirm: item.questionType === 2 ? false : undefined },
    }));
  }
}

function getStepByUser() {
  switch (true) {
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

async function directUploadIdCardPics(type: "yuliuone" | "yuliutwo") {}

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
    uni.showModal({
      title: "是否需要重新上传身份证?",
      async success(res) {
        if (res.confirm) {
          await chooseAndUpload();
        }
      },
    });
    return;
  } else {
    uni.showLoading();
    try {
      await chooseAndUpload();
    } finally {
      uni.hideLoading();
    }
  }
}

async function handleIdCardSubmit() {
  const { code } = await updateUserProfile({
    userId: user.userInfo.id,
    yuliuone: form.yuliuone,
    yuliutwo: form.yuliutwo,
  });
  if (code === 1) step.value += 1;
}

async function handleCompleteVideoSubmit() {
  if (user.userInfo.number === 1) {
    step.value += 1;
    return;
  }
  const { code } = await updateUserProfile({
    userId: user.userInfo.id,
    number: 1,
  });
  if (code === 1) step.value += 1;
}

async function handleExamSubmit() {
  const rightAnswerCount = examResultList.value.filter((item) =>
    item.questionType === 2
      ? areArraysEqual(item.answer as string[], item.correctAnswer as string[])
      : item.answer === item.correctAnswer,
  ).length;
  const { code } = await updateUserProfile({
    userId: user.userInfo.id,
    remark: 1,
  });
}

function handleNextStep() {
  switch (step.value) {
    case 1:
      handleIdCardSubmit();
      break;
    case 2:
      handleCompleteVideoSubmit();
      break;
    case 3:
      const current = examResultList.value[currentExamIndex.value];
      if (!current.multiConfirm && current.questionType === 2) {
        uni.showModal({
          title: "请确认您的答案",
          success(res) {
            if (res.confirm) {
              current.multiConfirm = true;
            }
          },
        });
        return;
      }
      if (currentExamIndex.value < examResultList.value.length - 1) {
        handleNextQuestion();
      } else {
        step.value += 1;
      }
      break;
    case 4:
      handleExamSubmit();
      break;
    default:
      break;
  }
}

function handleUpdateProgress(e) {
  const { currentTime, duration } = e.detail;
  if (!duration || duration <= 0) {
    form.progress = 0; // 如果时长无效，进度设为0
    return;
  }
  const progressPercentage = (currentTime / duration) * 100;
  form.progress = Math.round(progressPercentage); // 四舍五入为整数
  if (form.progress >= 100) {
    isFinishedLearn.value = true;
  }
}

onLoad(async () => {
  await user.updateUser();
  form.yuliuone = user.userInfo.yuliuone;
  form.yuliutwo = user.userInfo.yuliutwo;
  isFinishedLearn.value = user.userInfo.number === 1;
  getStepByUser();
  await fetchExamAndInitResult();
});

function handleNextQuestion() {
  currentExamIndex.value += 1;
}

function handleItemPickedAnswer({
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
function resetExamAnswer() {
  uni.showModal({
    title: "提示",
    content: "您确定重新答题吗？",
    success(res) {
      if (res.confirm) {
        examResultList.value = examList.value.map((item) => ({
          questionType: item.questionType,
          answer: item.questionType === 1 ? "" : [],
          correctAnswer: item.correctAnswer,
          ...{ multiConfirm: item.questionType === 2 ? false : undefined },
        }));
        step.value = 3;
        currentExamIndex.value = 0;
      }
    },
  });
}
function areArraysEqual<T>(arrA: T[], arrB: T[]): boolean {
  // 1. 如果长度不同，肯定不相等
  if (arrA.length !== arrB.length) {
    return false;
  }

  // 2. 逐个比较每个元素
  // .every() 方法会测试数组的所有元素是否都通过了指定函数的测试
  return arrA.every((value, index) => value === arrB[index]);
}
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
                class="h-160px w-240px flex gap-y-12px justify-center flex-col"
                @click="handleUploadIdCardPics('yuliuone')"
              >
                <view>人像面：</view>
                <image
                  :src="
                    form.yuliuone
                      ? form.yuliuone
                      : 'https://cdn.juesedao.cn/mdy/af5d10481fb54f389440a04a7e0e0d1a'
                  "
                  class="h-full w-full rounded-8px"
                  mode="aspectFill"
                />
              </view>
              <view
                class="h-160px w-240px flex gap-y-12px justify-center flex-col"
                @click="handleUploadIdCardPics('yuliutwo')"
              >
                <view>国徽面：</view>
                <image
                  :src="
                    form.yuliutwo
                      ? form.yuliutwo
                      : 'https://cdn.juesedao.cn/mdy/af5d10481fb54f389440a04a7e0e0d1a'
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
                  src="https://cdn.juesedao.cn/mdy/827246545e4e4be5a6f0733987942813"
                  @timeupdate="handleUpdateProgress"
                />
              </view>
              <view class="primary-text">
                学习进度：
                {{ isFinishedLearn ? 100 : form.progress }}
                %
              </view>
            </view>
          </template>

          <template v-if="step === 3">
            <view class="mb-12px font-bold">
              {{ currentExamIndex + 1 }}/{{ examList?.length }}题
            </view>
            <exam-item
              v-for="(item, index) in examList"
              v-show="currentExamIndex === index"
              :key="index"
              :multi-confirm="examResultList[index].multiConfirm"
              :answer-analysis="item.answerAnalysis"
              :correct-answer="item.correctAnswer"
              :model-value="examResultList[index].answer"
              :options="
                item.options?.map((_item) => ({
                  label: _item,
                  value: _item[0],
                }))
              "
              :question-content="item.questionContent"
              :question-type="item.questionType"
              @update:modelValue="
                ({ answer, questionType }) =>
                  handleItemPickedAnswer({
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
                  (examResultList.filter((item) =>
                    item.questionType === 2
                      ? areArraysEqual(
                          item.answer as string[],
                          item.correctAnswer as string[],
                        )
                      : item.answer === item.correctAnswer,
                  ).length /
                    examList.length) *
                  100
                "
              />
              <view class="text-14px text-gray-6 font-bold">
                答题情况
                {{
                  examResultList.filter((item) =>
                    item.questionType === 2
                      ? areArraysEqual(
                          item.answer as string[],
                          item.correctAnswer as string[],
                        )
                      : item.answer === item.correctAnswer,
                  ).length
                }}/{{ examList.length }}
              </view>
              <sar-button block @click="resetExamAnswer" theme="info"
                >重新答题</sar-button
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
