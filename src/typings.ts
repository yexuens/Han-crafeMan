// 枚举定义
export type IResData<T = any> = {
  code: number | string;
  data: T | T[];
  record?: T | T[];
  records?: T | T[];
  phoneNumber?: string;
  user?: any;
  openid?: string;
  msg: string;
  sumcount?: number;
  totalPage?: number;
};

export enum TestEnum {
  A = "1",
  B = "2",
}

// uni.uploadFile文件上传参数
export interface IUniUploadFileOptions {
  file?: File;
  files?: UniApp.UploadFileOptionFiles[];
  filePath?: string;
  name?: string;
  formData?: any;
}
