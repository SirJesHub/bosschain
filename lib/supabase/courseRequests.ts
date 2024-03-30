import { supabaseClient } from "./supabaseClient";
import { CreateCourseRequest, SupabaseResponse } from "@/models/requestModels";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Database } from "@/types/supabase";

export const createCourse = async ({
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
