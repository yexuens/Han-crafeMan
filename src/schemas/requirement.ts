import * as z from "zod";

export const PublishRequirement = z.object({
  address: z.string().nonempty("请输入地址"),
  area: z.string().nonempty("请输入面积"),
  pickedSpecs: z.array(z.string()).min(1, "至少选择一个规格"),
});
export type IPublishRequirement = z.infer<typeof PublishRequirement>;

export const AddCustomSpecs = z.object({
  unit: z.string().nonempty("请输入规格名称"),
  price: z.coerce
    .number({
      invalid_type_error: "价格必须是一个整数",
      required_error: "请输入价格",
    })
    .min(0, "价格不能小于0"),
});
export type IAddCustomSpecs = z.infer<typeof AddCustomSpecs>;
