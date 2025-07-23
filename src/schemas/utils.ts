import * as z from "zod";

export function showZodError(error: unknown) {
  if (!error) {
    return;
  }
  if (error instanceof z.ZodError) {
    const firstError = error.errors[0];
    if (firstError) {
      return uni.showToast({
        title: firstError.message,
        icon: "none",
      });
    }
  } else
    return uni.showToast({
      title: "系统繁忙",
      icon: "none",
    });
}
