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
    .select(`course (*)`)
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

const getCourseById = async ({
  userId,
  courseId,
  token,
}: UserAuth & { courseId: string }): Promise<
  SupabaseResponse<
    Array<{
      course_id: number;
      created_at: string;
      description: string | null;
      instructor_id: string | null;
      title: string | null;
      is_published: boolean | null;
    } | null>
  >
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
    .select(`*`)
    .eq("instructor_id", userId)
    .eq("course_id", courseId);
  if (error) {
    console.log("[getCourseById ERROR]: ", error);
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

const getAllTeacherCourse = async ({
  userId,
  token,
}: UserAuth): Promise<
  SupabaseResponse<
    Array<{
      course_id: number;
      created_at: string;
      description: string | null;
      instructor_id: string | null;
      title: string | null;
      is_published: boolean | null;
    } | null>
  >
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
    .select(`*`)
    .eq("instructor_id", userId);
  if (error) {
    console.log("[getAllTeacherCourse ERROR]: ", error);
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

const updateCourseTitle = async ({
  courseId,
  title,
  token,
  userId, // Add userId to the function parameters
}: {
  courseId: number;
  title: string;
  token: string;
  userId: string; // Accept userId as a parameter
}): Promise<
  SupabaseResponse<Database["public"]["Tables"]["course"]["Row"]>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: courseData,
    error: courseError,
    status: courseStatus,
    statusText: courseStatusText,
  } = await supabase
    .from("course")
    .update({ title }) // Update the title
    .eq("course_id", courseId) // Match the course ID
    .eq("instructor_id", userId) // Ensure the course belongs to the user
    .single(); // Only update a single row

  if (courseError) {
    console.log("[updateCourseTitle ERROR]: ", courseError);
    return {
      data: null,
      statusCode: courseStatus,
      statusMessage: courseStatusText,
      error: courseError.message,
    };
  }

  return {
    data: courseData,
    statusCode: courseStatus,
    statusMessage: courseStatusText,
    error: null,
  };
};

const updateCourseDescription = async ({
  courseId,
  description,
  token,
  userId,
}: {
  courseId: number;
  description: string;
  token: string;
  userId: string;
}): Promise<
  SupabaseResponse<Database["public"]["Tables"]["course"]["Row"]>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: courseData,
    error: courseError,
    status: courseStatus,
    statusText: courseStatusText,
  } = await supabase
    .from("course")
    .update({ description }) // Update the description
    .eq("course_id", courseId)
    .eq("instructor_id", userId)
    .single();

  if (courseError) {
    console.log("[updateCourseDescription ERROR]: ", courseError);
    return {
      data: null,
      statusCode: courseStatus,
      statusMessage: courseStatusText,
      error: courseError.message,
    };
  }

  return {
    data: courseData,
    statusCode: courseStatus,
    statusMessage: courseStatusText,
    error: null,
  };
};

const updateCourseCategory = async ({
  courseId,
  category,
  token,
  userId,
}: {
  courseId: number;
  category: string;
  token: string;
  userId: string;
}): Promise<
  SupabaseResponse<Database["public"]["Tables"]["course"]["Row"]>
> => {
  if (!token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(token);
  const {
    data: courseData,
    error: courseError,
    status: courseStatus,
    statusText: courseStatusText,
  } = await supabase
    .from("course")
    .update({ category }) // Update the category
    .eq("course_id", courseId)
    .eq("instructor_id", userId)
    .single();

  if (courseError) {
    console.log("[updateCourseCategory ERROR]: ", courseError);
    return {
      data: null,
      statusCode: courseStatus,
      statusMessage: courseStatusText,
      error: courseError.message,
    };
  }

  return {
    data: courseData,
    statusCode: courseStatus,
    statusMessage: courseStatusText,
    error: null,
  };
};


export const EnrollmentService = {
  getCourse,
  getFullCourse,
  enrollByCourseId,
  getCourseById,
  getAllTeacherCourse,
  updateCourseTitle,
  updateCourseDescription,
  updateCourseCategory
};


