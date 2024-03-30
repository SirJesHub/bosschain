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
  console.log("data is", data[0]);
  return {
    data: data[0],
    statusCode: status,
    statusMessage: statusText,
    error: null,
  };
};

export const LessonService = {
  getLessonContent,
};
