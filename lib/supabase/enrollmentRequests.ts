import { supabaseClient } from "./supabaseClient";
import {
  UserAuth,
  SupabaseResponse,
  FullCourseDetail,
  EnrollCourseRequest,
} from "@/models/requestModels";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Database } from "@/types/supabase";

// get courses enrolled by a particular user
const getCourse = async ({
  userId,
  token,
}: UserAuth): Promise<
  SupabaseResponse<Array<Database["public"]["Tables"]["course"]["Row"] | null>>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("enrollment")
    .select(`course (course_id, created_at, title, description, instructor_id)`)
    .eq("user_id", userId);
  if (error) {
    console.log("[getCourese ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data: data.map((entry) => entry.course),
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

// get courses enrolled by a particular user joined with module and lesson
const getFullCourse = async ({
  userId,
  token,
}: UserAuth): Promise<SupabaseResponse<Array<FullCourseDetail | null>>> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("enrollment")
    .select(`course (*, module (*, lesson(*)))`)
    .eq("user_id", userId);
  if (error) {
    console.log("[getFullCourese ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data: data.map((entry) => entry.course),
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const enrollByCourseId = async ({
  userId,
  token,
  courseId,
}: EnrollCourseRequest): Promise<
  SupabaseResponse<Array<Database["public"]["Tables"]["enrollment"]["Row"]>>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const { data, error, status, statusText } = await supabase
    .from("enrollment")
    .insert({ user_id: userId, course_id: courseId })
    .select();
  if (error) {
    console.log("[enrollByCourseId ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data: data,
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

export const EnrollmentService = {
  getCourse,
  getFullCourse,
  enrollByCourseId,
};
