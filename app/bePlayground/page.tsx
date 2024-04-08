"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import ReactJson from "react-json-view";
import { useEffect, useState } from "react";
import { useRoleContext } from "@/context/roleContext";
import {
  createCourse,
  getCourse,
  getFullCourse,
  getProgress
} from "@/lib/supabase/courseRequests";
import { SupabaseResponse } from "@/models/requestModels";
import { Database } from "@/types/supabase";

export default function Home() {
  const { role } = useRoleContext();

  const { user, isSignedIn } = useUser();
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";

  const [course, setCourse] =
    useState<
      SupabaseResponse<
        Array<Database["public"]["Tables"]["course"]["Row"] | null>
      >
    >();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
      try {
        const token = await getToken({ template: "supabase" });

        const course = await getFullCourse({ userId, token });
        setCourse(course); // may require frontend side to filter null -> can use Array.filter

        const fullCourse = await getFullCourse({ userId, token });
        console.log("FULL COURSE -> ", fullCourse);

        setLoading(false);
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
      }
    };

    initializePage();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const token = await getToken({ template: "supabase" });
    const createdCourse = await createCourse({
      userId,
      token,
      title: event.target[0].value,
      description: null,
    });
    setCourse(createdCourse);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <UserButton afterSignOutUrl="/" />
      <div>isLoaded: {isLoaded.toString()}</div>
      <div>sessionId: {sessionId}</div>
      <h2>
        Your role is <b>{role}</b>
      </h2>
      {isSignedIn ? (
        <div className="p-3">
          <p className="text-3xl font-medium text-sky-700">
            A backend playground for testing supabase DB call
          </p>
          <br />
          Course of this user: {userId}
          <br />
          {course?.data?.map((row) => (
            <ReactJson src={row || {}} key={row?.course_id} />
          ))}
          <br />
          <br />
          <h1>Teacher functions</h1>
          <h3>
            Add course - this function shoud be guarded by frontend using
            roleContext
          </h3>
          <form onSubmit={handleSubmit}>
            <Input placeholder="course title [IF WANT TO TEST DESCRIPTION -> NEED TO CREATE A FORM]" />
            <Button>Add course</Button>
          </form>
        </div>
      ) : (
        <div>
          <p>please sign in</p>
          <SignInButton mode="modal" />
        </div>
      )}
    </>
  );
}
