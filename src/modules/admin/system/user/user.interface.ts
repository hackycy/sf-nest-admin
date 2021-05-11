export interface IAccountInfo {
  name: string;
  nickName: string;
  email: string;
  phone: string;
  remark: string;
  headImg: string;
}

export interface IPageSearchUserResult {
  createTime: string;
  departmentId: number;
  email: string;
  headImg: string;
  id: number;
  name: string;
  nickName: string;
  phone: string;
  remark: string;
  status: number;
  updateTime: string;
  username: string;
  departmentName: string;
  roleNames: string[];
}
