import dayjs from "dayjs";

export function formatDurationSmart(startTime, endTime) {
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  // 确保结束时间在开始时间之后
  if (end.isBefore(start)) {
    return '0分钟'; // 或者可以抛出错误，根据你的业务需求
  }

  const diffMilliseconds = end.diff(start);
  const durationObj = dayjs.duration(diffMilliseconds);

  // 获取天、小时、分钟
  const days = durationObj.days();
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();

  // 创建一个数组来存放结果的各个部分
  const parts = [];

  // 只有当值大于0时，才将该部分添加到数组中
  if (days > 0) {
    parts.push(`${days}天`);
  }
  if (hours > 0) {
    parts.push(`${hours}小时`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}分钟`);
  }

  // 如果 parts 数组为空，说明总时长小于1分钟，返回 "0分钟"
  if (parts.length === 0) {
    return '0分钟';
  }

  // 将数组中的所有部分连接起来返回
  return parts.join('');
}
