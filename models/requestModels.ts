import { ResponseStatus } from "@/constants/auth";

export interface GetUserRoleResponse {
  data: string | null;
  error: string | null;
  status: ResponseStatus;
}
