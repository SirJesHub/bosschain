import { ResponseStatus } from "@/constants/auth";
import { supabaseClient } from "./supabaseClient";
import {
  GetUserRoleResponse,
  UserAuth,
  WriteRequest,
} from "@/models/requestModels";

const getPost = async ({ userId, token }: UserAuth) => {
  if (!token) return [];
  const supabase = await supabaseClient(token);
  const { data } = await supabase
    .from("test")
    .select("*")
    .eq("user_id", userId);
  if (!data) return [];
  return data;
};

const addPost = async ({ userId, token, event }: WriteRequest) => {
  if (!token) return [];
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("test")
    .insert({
      user_id: userId,
      text: event.target[0].value,
    })
    .select();
  if (error) {
    console.log("[ERROR]: ", error);
    return [];
  }
  return data;
};

const getUserRole = async ({
  userId,
  token,
}: UserAuth): Promise<GetUserRoleResponse> => {
  try {
    if (!token) throw new Error("Where is your token?!!");
    const supabase = await supabaseClient(token);
    const { data } = await supabase
      .from("user")
      .select("role_name")

      .eq("user_id", userId)
      .single();

    console.log(data);

    return {
      data: data?.role_name || null,
      error: null,
      status: ResponseStatus.OK,
    };
  } catch (error) {
    console.log("[SERVER ERROR]: ", error);
    return { data: null, error: null, status: ResponseStatus.UNAUTHORIZED };
  }
};

export { getPost, addPost, getUserRole };
