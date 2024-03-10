import { supabaseClient } from "./supabaseClient";
import {
  UserAuth,
  SupabaseResponse,
  FullCourseDetail,
} from "@/models/requestModels";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Database } from "@/types/supabase";

export const getCourse = async ({
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

export const getFullCourse = async ({
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