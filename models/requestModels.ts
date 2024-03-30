import { ResponseStatus } from "@/constants/auth";
import { Database } from "@/types/supabase";

interface UserAuth {
  userId: string;
  token: string | null | undefined;
}

interface WriteRequest extends UserAuth {
  event: any;
}

interface ImageUploadRequest extends UserAuth {
  courseId: number;
  file: File;
}

interface GetUserRoleResponse {
  data: string | null;
  error: string | null;
  status: ResponseStatus;
}

interface CreateCourseRequest extends UserAuth {
  title: string;
  description: string | null;
}

interface SupabaseResponse<T> {
  data: T | null;
  statusCode: number;
  statusMessage: string | undefined;
  error: string | null;
}

interface EnrollCourseRequest extends UserAuth {
  courseId: number;
}

type FullCourseDetail = Database["public"]["Tables"]["course"]["Row"] & {
  module: Array<ModuleLesson>;
};

type ModuleLesson = Database["public"]["Tables"]["module"]["Row"] & {
  lesson: Array<Database["public"]["Tables"]["lesson"]["Row"]>;
};

export type {
  UserAuth,
  WriteRequest,
  GetUserRoleResponse,
  CreateCourseRequest,
  SupabaseResponse,
  FullCourseDetail,
  EnrollCourseRequest,
  ImageUploadRequest,
};
