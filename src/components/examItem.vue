<script lang="ts" setup>
import { toast } from "@/utils/toast";

interface IExamItemOption {
  label: string;
  value: "A" | "B" | "C" | "D";
}

interface IProps {
  questionContent: string;
  options: IExamItemOption[];
  correctAnswer: string;
  answerAnalysis?: string;
  questionType: 1 | 2;
  answer: string | string[];
  multiConfirm?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits(["update:answer"]);
const questionTypeSchema = {
  1: {
    label: "单选题",
    theme: "primary",
  },
  2: {
    label: "多选题",
    theme: "info",
  },
};

function chosenAnswer({
  answer,
  questionType,
}: {
  answer: string | string[];
  questionType: 1 | 2;
}) {
  if (questionType === 1) {
    if (!props.answer) {
      uni.showModal({
        title: "提示",
        content: `您确定选择选项 ${answer} 吗？`,
        success: (res) => {
          if (res.confirm) {
            emit("update:answer", {
              answer,
              questionType,
            });
          }
        },
      });
    } else {
      toast.info("您已选择了答案，不可重新选择！");
    }
  } else {
    if (!props.multiConfirm) {
      emit("update:answer", {
        answer,
        questionType,
      });
    } else {
      toast.info("您已选择了答案，不可重新选择！");
    }
  }
}
const isSelected = (itemValue: string) => {
  if (props.questionType === 1) {
    return props.answer === itemValue;
  }
  // questionType === 2
  return (props.answer as string[])?.includes(itemValue);
};

const isCorrectAnswer = (itemValue: string) => {
  if (typeof props.correctAnswer === "string") {
    return props.correctAnswer?.includes(itemValue);
  }
  return false;
};
function getOptionClass(item: IExamItemOption) {
  const selected = isSelected(item.value);
  const correct = isCorrectAnswer(item.value);

  // 答题后（单选有值，或多选已确认）
  const isAnswered =
    props.questionType === 1 ? !!props.answer : props.multiConfirm;

  if (isAnswered) {
    if (selected && correct) return "right_answer";
    if (selected && !correct) return "wrong_answer";
    if (!selected && correct) return "right_answer"; // 也可高亮正确答案
  } else if (props.questionType === 2 && selected) {
    // 多选未确认时，只高亮已选
    return "picked_answer";
  }
  return "";
}
</script>

<template>
  <view
    class="px-12px py-4px bg-white rounded-8px flex flex-col gap-y-12px pb-12px"
  >
    <view>
      <sar-tag :theme="questionTypeSchema[questionType].theme as any">
        {{ questionTypeSchema[questionType].label }}
      </sar-tag>
    </view>
    <view class="font-500px text-justify">
      {{ questionContent }}
    </view>
    <view class="flex gap-y-8px flex-col">
      <view
        v-for="(item, index) in options"
        :key="index"
        :class="[
          'px-16px text-14px opacity-90 py-12px bg-#f9f9f9 flex rounded-4px items-center justify-between',
          getOptionClass(item),
        ]"
        @click="
          chosenAnswer({
            answer: item.value,
            questionType,
          })
        "
      >
        <text> {{ item.label }}</text>
        <!--        选择了选项且选项是正确的选项-->
        <custom-icon
          v-if="
            questionType === 1
              ? answer === item.value && answer === correctAnswer
              : multiConfirm &&
                answer.indexOf(item.value) !== -1 &&
                correctAnswer.indexOf(item.value) !== -1
          "
          icon-name="rightIcon"
        />
        <!--        选择了选项但不是正确的选项-->
        <custom-icon
          v-if="
            questionType === 1
              ? answer === item.value && answer !== correctAnswer
              : multiConfirm &&
                answer.indexOf(item.value) !== -1 &&
                correctAnswer.indexOf(item.value) === -1
          "
          icon-name="wrongIcon"
        />
      </view>
    </view>
    <view
      v-if="questionType === 1 ? answer : answer && multiConfirm"
      class="mt-16px"
    >
      <view
        :class="[
          questionType === 2 ? 'flex-col' : 'justify-between items-center',
        ]"
        class="flex text-14px"
      >
        <view class="flex items-center">
          正确答案：
          <text class="text-red-7 text-16px">{{ correctAnswer }}</text>
        </view>
        <view class="flex items-center">
          已选答案：
          <text class="text-red-7 text-16px">{{
            questionType === 1 ? answer : (answer as string[]).join(",")
          }}</text>
        </view>
      </view>
      <view
        v-if="answerAnalysis"
        class="text-14px mt-8px text-#afafaf text-justify"
      >
        解析：{{ answerAnalysis }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.wrong_answer {
  background-color: #ffebec;
  color: #f24e4e;
}

.right_answer {
  background-color: #eaf7ee;
  color: #59be83;
}
.picked_answer {
  @apply bg-blue-100 text-blue-600;
}
</style>
