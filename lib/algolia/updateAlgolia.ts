import { supabaseClient } from "../supabase/supabaseClient";
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

const updateAllCourse = async (userAuth: UserAuth) : Promise<any>=> {
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
    // const algolia = algoliasearch(
    //     "4EIO37Y3KT",
    //     "4f7dc9c296db73db48a82ab8dc9f190b"
    //   );
    // const indexAL = algolia.initIndex("bosschain");
    // const result = await indexAL.saveObjects(data);
    // console.log("result", result);
    console.log(data)
    return {
      data: data,
      statusCode: status,
      statusMessage: statusText,
      error: null,
    };
  }
};

export default { updateAllCourse };
