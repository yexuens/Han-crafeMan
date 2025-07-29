export interface IExamResult {
  questionType: 1 | 2;
  answer: string | string[];
  correctAnswer: string | string[];
  multiConfirm?: boolean;
}

export const stepList = ref([
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
  {
    label: "第五步 等待管理员审核",
  },
]);
export function getExamResultInit(_examList: any) {
  return _examList.map((item) => ({
    questionType: item.questionType,
    answer: item.questionType === 1 ? "" : [],
    correctAnswer:
      item.questionType === 2
        ? item.correctAnswer.split(",")
        : item.correctAnswer,
    ...{ multiConfirm: item.questionType === 2 ? false : undefined },
  }));
}
