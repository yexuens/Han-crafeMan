import { http } from "@/http/http";

export type IRequirementSpecs = {
  unit: string;
  price: number;
};

export function queryRequirementList(data: {
  address?: string;
  userId?: number;
  jobState?: number | null | string;
  accesUserId?: number;
  curPage?: number;
  number?: number;
  keyword?: string;
  id?: number;
}) {
  return http.get<any[]>("/oe_TaskCrud_.csp", {
    ...data,
    flag: "query",
  });
}

export function addOrEditRequirement(data: {
  accesUserId?: number;
  userId?: number;
  address?: string;
  jobState?: number | null;
  qrCode?: string;
  specs?: string;
  id?: number;
}) {
  return http.get("/oe_TaskCrud_.csp", {
    ...data,
    flag: "save",
  });
}

export function queryRequirementNotice(data: {
  type: 0 | 1;
  accesUserId?: number;
  userId?: number;
}) {
  return http.get("/oe_QueryNotice_.csp", data);
}
