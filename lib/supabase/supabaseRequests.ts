import { supabaseClient } from "./supabaseClient";

interface UserAuth {
  userId: string | null | undefined;
  token: string | null | undefined;
}

interface writeRequest extends UserAuth {
  event: any;
}

export const getPost = async ({ userId, token }: UserAuth) => {
  if (!token) return [];
  const supabase = await supabaseClient(token);
  const { data } = await supabase
    .from("test")
    .select("*")
    .eq("user_id", userId);
  if (!data) return [];
  return data;
};

export const addPost = async ({ userId, token, event }: writeRequest) => {
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
