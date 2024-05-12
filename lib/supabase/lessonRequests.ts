import { supabaseClient } from "./supabaseClient";
import { UserAuth } from "@/models/requestModels";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Database } from "@/types/supabase";

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
  return {
    data: data[0],
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

const updateLessonContentType = async (
  userAuth: UserAuth,
  moduleId: number,
  lessonId: number,
  contentType: string,
): Promise<any> => {
  if (!userAuth.token)
    return {
      data: null,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      error: "Where is your Clerk token?!!",
    };
  const supabase = await supabaseClient(userAuth.token);
  let defaultContent;
  switch (contentType) {
    case "article":
      defaultContent = JSON.stringify([
        {
          id: "4727ab91-dc61-46eb-99f8-f86a498a1da0",
          type: "heading",
          props: {
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left",
            level: 3,
          },
          content: [
            {
              type: "text",
              text: "",
              styles: {},
            },
          ],
          children: [],
        },
      ]);
      break;
    case "video":
      defaultContent = "";
      break;
    case "quiz":
      defaultContent = "";
      break;
    default:
      defaultContent = "";
      break;
  }
  const { data, error, status, statusText } = await supabase
    .from("lesson")
    .update({ content_type: contentType, content: defaultContent })
    .eq("lesson_id", lessonId)
    .eq("module_id", moduleId)
    .select(`content, content_type`);
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

const updateLessonContent = async (
  userAuth: UserAuth,
  moduleId: number,
  lessonId: number,
  content: string,
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
    .update({ content: content })
    .eq("lesson_id", lessonId)
    .eq("module_id", moduleId)
    .select();
  if (error) {
    console.log("[updateLessonContent ERROR]: ", error);
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

export const LessonService = {
  getLessonContent,
  updateLessonContentType,
  updateLessonContent,
};
