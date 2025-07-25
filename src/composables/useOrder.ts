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
}) {}

export async function grabOrder({
  id,
  userRole,
  userId,
}: {
  id: number;
  userRole: number;
  userId: number;
}) {
  if (userRole !== 1) throw new Error("你不是工匠，不能抢单");
  const { code } = await addOrEditRequirement({
    id,
    jobState: RequirementStatus.Accepted,
    accesUserId: userId,
  });
}
