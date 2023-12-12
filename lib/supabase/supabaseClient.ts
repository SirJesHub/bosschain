import { createClient } from "@supabase/supabase-js";

export const supabaseClient = async(supabaseToken: string) => {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_KEY as string,
        {
            global: {headers: {Authorization: `Bearer ${supabaseToken}`}}
        }
    )

    return supabase
}

export const supabaseClientWithoutToken = async() => {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_KEY as string
    )

    return supabase
}