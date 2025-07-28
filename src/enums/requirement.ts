export enum OrderStatus {
  /**
   * 填写需求
   */
  FillingRequirements = -1,
  /**
   * 已发布
   */
  Published = 0,
  /**
   * 已接单
   */
  Accepted = 1,
  /**
   * 群码上传
   */
  GroupCodeUploaded = 2,
  /**
   * 群内对接
   */
  GroupConnecting = 3,

  WasCanceled = 4,

  Completed = 5,
}

export const craftManOrderStatusText = {
  [OrderStatus.Published]: {
    crafeman: "待抢单",
    user: "待接单",
    detail: "待抢单",
    bgColor: "#f6590d",
  },
  [OrderStatus.Accepted]: {
    crafeman: "已抢单",
    user: "已被接单",
    detail: "等待平台上传项目群",
    bgColor: "#10ad80",
  },
  [OrderStatus.GroupCodeUploaded]: {
    crafeman: "已建群",
    user: "已建群",
    detail: "请尽快加入项目群沟通",
    bgColor: "#3789fe",
  },
  [OrderStatus.GroupConnecting]: {
    crafeman: "群内对接",
    user: "群内对接",
    detail: "群内对接中",
    bgColor: "#f6590d",
  },
  [OrderStatus.WasCanceled]: {
    crafeman: "工单已取消",
    user: "工单已取消",
    detail: "工单已取消",
    bgColor: "#e1e1e1",
  },
  [OrderStatus.Completed]: {
    crafeman: "工单已完成",
    user: "工单已完成",
    detail: "工单已完成",
    bgColor: "#e1e1e1",
  },
};
export const orderStatusNoticeInfoMap = {
  [OrderStatus.GroupCodeUploaded]: {
    // 角色无关的文案，可以为两个角色设置相同内容
    user: "项目群已创建，请及时进群沟通",
    crafeman: "项目群已创建，请及时进群沟通",
    textColor: "#0BB260",
    icon: "greenNoticeIcon",
    bgColor: "#dbf3ec",
  },
  [OrderStatus.Published]: {
    // 根据角色区分的文案
    user: "等待师傅接单", // 对应 userRole.value === 0
    crafeman: "接单前请确认订单的基本信息", // 对应 else 的情况
    bgColor: "#fee8dd",
    icon: "noticeIcon",
    textColor: "#733617",
  },
  [OrderStatus.Accepted]: {
    user: "等待平台上传项目沟通群二维码",
    crafeman: "等待平台上传项目沟通群二维码",
    bgColor: "#fee8dd",
    icon: "noticeIcon",
    textColor: "#733617",
  },
  // 您后续提供的其他状态也可以一并加入
  [OrderStatus.WasCanceled]: {
    user: "工单已取消",
    crafeman: "工单已取消",
    detail: "工单已取消", // 保留您示例中的 detail 字段
    bgColor: "#e1e1e1",
  },
  [OrderStatus.Completed]: {
    user: "工单已完成",
    crafeman: "工单已完成",
    detail: "工单已完成",
    bgColor: "#e1e1e1",
  },
};

export enum OrderStatusByUser {
  "工匠待抢单",
  "用户已发单,工匠未接单",
  "取消接单",
  "已完成/已取消",
}
