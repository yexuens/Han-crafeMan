import { http } from "@/http/http";

export function queryCraftsAuthInfo({ type }: { type: 0 | 1 | 3 }) {
  return http.get("/oe_examCrud_.csp", {
    type,
    flag: "query",
    curPage: 1,
    number: 99,
  });
}
