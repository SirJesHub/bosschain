import { supabaseClient } from "./supabaseClient";
import {
  GetUserRoleResponse,
  UserAuth,
  WriteRequest,
  CreateCourseRequest,
  SupabaseResponse,
  FullCourseDetail,
} from "@/models/requestModels";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Database } from "@/types/supabase";

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

const createCourse = async ({
  userId,
  token,
  title,
  description,
}: CreateCourseRequest): Promise<
  SupabaseResponse<Array<Database["public"]["Tables"]["course"]["Row"]>>
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
    .from("course")
    .insert({
      title,
      description: description,
      instructor_id: userId,
    })
    .select();
  if (error) {
    console.log("[createCourese ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  return {
    data,
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

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

// For obtaining individual course details
const getFullCurrentCourse = async (
  userAuth: UserAuth,
  courseId: any,
): Promise<any> => {
  if (!userAuth.token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(userAuth.token);
  const { data, error, status, statusText } = await supabase
    .from("course")
    .select(`*,module (*, lesson(*))`)
    .eq("course_id", courseId);
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
    data: data[0],
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const getLessonContent = async (
  userAuth: UserAuth,
  moduleId: Number,
  index: Number,
): Promise<any> => {
  if (!userAuth.token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(userAuth.token);
  const { data, error, status, statusText } = await supabase
    .from("lesson")
    .select(`content`)
    .eq("index", index)
    .eq("module_id", moduleId);
  if (error) {
    console.log("[getFullCourese ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  }
  console.log("data is", data[0]);
  return {
    data: data[0],
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

export const CourseService = {
  createCourse,
  getCourse,
  getFullCourse,
  getFullCurrentCourse,
  getLessonContent,
};
