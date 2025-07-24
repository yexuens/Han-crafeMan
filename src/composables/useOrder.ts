import { addOrEditRequirement } from "@/service/requirement";
import { RequirementStatus } from "@/enums";
import { toast } from "@/utils/toast";

export async function cancelOrder({
  id,
  userRole,
  userId,
}: {
  id: number;
  userRole: number;
  userId: number;
}) {
  uni.showModal({
    title: "取消工单",
    content: "确认取消该工单吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          const { code } = await addOrEditRequirement({
            id: id,
            jobState: RequirementStatus.WasCanceled.valueOf(),
            ...(userRole === 1 && { accesUserId: userId }),
            ...(userRole === 0 && { userId: userId }),
          });
          if (code !== 1) throw new Error("取消工单失败");
          toast.info("取消成功");
        } catch (e) {
          toast.info(e.message || "取消工单失败");
        }
      }
    },
  });
}

export async function grabOrder({
  id,
  userRole,
  userId,
}: {
  id: number;
  userRole: number;
  userId: number;
}) {
  if (userRole !== 1) return;
  try {
    const { code } = await addOrEditRequirement({
      id,
      jobState: RequirementStatus.Accepted,
      accesUserId: userId,
    });
    if (code !== 1) throw new Error("抢单失败，请稍后再试");
  } catch (e) {
    toast.info(e.message || "抢单失败，请稍后再试");
  }
}
