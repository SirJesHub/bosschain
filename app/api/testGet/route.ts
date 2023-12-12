import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseClientWithoutToken } from "@/lib/supabase/supabaseClient";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: Request) {
  console.log("RECEVIE WEBHOOK");
  try {
    // const supabase = await supabaseClientWithoutToken();
    const foo = await req.json()
    console.log(foo)
    return NextResponse.json({ data: "test" }, {status: 201});
    // res.status(200).json({ message: 'Hello from Next.js!' })
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json({err: error}, {status: 500})
  }
}
