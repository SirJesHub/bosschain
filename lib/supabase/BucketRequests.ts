import { supabaseClient } from "./supabaseClient";
import {
  UserAuth,
  SupabaseResponse,
  FullCourseDetail,
  EnrollCourseRequest,
  ImageUploadRequest,
} from "@/models/requestModels";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Database } from "@/types/supabase";

const uploadCourseImage = async ({
  token,
  userId,
  courseId,
  file,
}: ImageUploadRequest) => {
  if (!token) return console.log("Upload image fail - no token detected");
  const targetPath = courseId + "/course/cover";
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.storage
    .from("course_assets")
    .upload(targetPath, file, {
      upsert: true,
    });
  if (data) {
    console.log("upload done");
    // getImages({ token, folderPath: targetPath });
  } else {
    console.log("[Upload course image error] ", error);
  }
};

const getImageList = async ({
  token,
  folderPath = "",
}: {
  token: string | null;
  folderPath?: string;
}) => {
  if (!token) return console.log("Get image fail - no token detected");
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.storage
    .from("course_assets")
    .list(folderPath);

  if (error) {
    console.log("[getImages error] ", error);
  } else {
    return data;
  }
};

export const BucketService = {
  uploadCourseImage,
  getImageList,
};
