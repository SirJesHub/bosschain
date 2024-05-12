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
import { index } from "@/helper";
import algoliasearch from "algoliasearch";
import { equal } from "assert";

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
    console.log("[createCourse ERROR]: ", error);
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
    .select(
      `*,module(*, lesson(title,content_type,index,module_id,lesson_id,created_at,description))`,
    )
    .eq("course_id", courseId)
    .order("index", { ascending: true, referencedTable: "module" })
    .order("index", { ascending: true, referencedTable: "module.lesson" });
  if (error) {
    console.log("[getFullCourse ERROR]: ", error);
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
  lessonIndex: Number,
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
    .select(`content, content_type`)
    .eq("index", lessonIndex)
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
  return {
    data: data[0],
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const updateAllCourse = async (userAuth: UserAuth): Promise<any> => {
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
    .select("*");
  if (error) {
    console.log("[updateAllCourse ERROR]: ", error);
    return {
      data: null,
      statusCode: status,
      statusMessage: statusText,
      error: error.message,
    };
  } else {
    const objectsWithObjectID = data.map((course) => ({
      objectID: course.course_id,
      ...course,
    }));
    const algolia = algoliasearch(
      "4EIO37Y3KT",
      "4f7dc9c296db73db48a82ab8dc9f190b",
    );
    const course_data = {
      objectID: 6,
      created_at: "2024-02-26T06:25:10.159741+00:00",
      description: "testing insert 1 course",
      instructor_id: "user_2baaE3uRKDvduWPPSOsV3QcM1id",
      title: "testCreateCourse2",
    };
    console.log("objectsWithObjectID", course_data);
    const indexAL = algolia.initIndex("bosschain");
    const result = await indexAL.saveObject(course_data);
    console.log("result from inserting to algolia", result);
    return {
      data: data,
      statusCode: status,
      statusMessage: statusText,
      error: null,
    };
  }
};

const insertCourseAlgolia = async (
  courseId: number,
  created_at: string,
  title: string | null,
  description: string | null,
  instructor_id: string | null,
): Promise<any> => {
  const algolia = algoliasearch(
    "4EIO37Y3KT",
    "4f7dc9c296db73db48a82ab8dc9f190b",
  );
  const course_data = {
    objectID: courseId,
    created_at: created_at,
    description: description,
    instructor_id: instructor_id,
    title: title,
  };
  if (course_data) {
    const indexAL = algolia.initIndex("bosschain");
    const result = await indexAL.saveObject(course_data);
    console.log("Result from insertAlgolia", result);
  } else {
    console.log("[insertCourse ERROR]: ");
  }
};

const getProgress = async (
  userAuth: UserAuth,
  courseId: number,
  enrollmentId: any,
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
    .from("module")
    .select(
      `module_id, index, lesson(index, lesson_progress(completed, enrollment_id))`,
    )
    .eq("course_id", courseId)
    .eq("lesson.lesson_progress.enrollment_id", enrollmentId)
    .order("index", { ascending: true })
    .order("index", { ascending: true, referencedTable: "lesson" });
  // const { data, error, status, statusText } = await supabase
  // .from("module")
  // .select(`module_id, index, lesson(index, lesson_progress(completed, enrollment_id))`)
  // .eq("course_id", courseId)
  // .eq("lesson.lesson_progress.enrollment_id", enrollmentId)
  // .order("index", { ascending: true })
  // .order("index", { ascending: true, referencedTable: "lesson" });
  if (error) {
    console.log("[getProgress ERROR]: ", error);
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

const updateProgress = async (
  userAuth: UserAuth,
  enrollment_id: any,
  lesson_id: number,
): Promise<any> => {
  if (!userAuth.token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(userAuth.token);
  console.log(enrollment_id, lesson_id);
  const { data, error, status, statusText } = await supabase
    .from("lesson_progress")
    .update({ completed: true })
    .eq("enrollment_id", enrollment_id)
    .eq("lesson_id", lesson_id)
    .select();
  if (error) {
    console.log("[getProgress ERROR]: ", error);
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

const getEnrollment = async (
  userAuth: UserAuth,
  courseId: number,
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
    .from("enrollment")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", userAuth.userId);
  if (error) {
    console.log("[getProgress ERROR]: ", error);
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

const createEnrollment = async (
  userAuth: UserAuth,
  courseId: number,
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
    .from("enrollment")
    .insert({ user_id: userAuth.userId, course_id: courseId })
    .select();
  if (error) {
    console.log("[createProgress ERROR]: ", error);
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

const getCoverImage = async (
  userAuth: UserAuth,
  courseId: number,
): Promise<any> => {
  if (!userAuth.token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(userAuth.token);
  const { data } = supabase.storage
    .from("course_cover_image")
    .getPublicUrl("longtunman.jpeg");
  return {
    data: data,
    error: null,
  };
};

export const CourseService = {
  getProgress,
  createCourse,
  getFullCurrentCourse,
  getLessonContent,
  updateAllCourse,
  insertCourseAlgolia,
  getEnrollment,
  createEnrollment,
  getCoverImage,
  updateProgress,
};
