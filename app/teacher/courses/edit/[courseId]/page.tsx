"use client";

import React, { useState, useEffect } from "react";
import { Banner } from "@/components/banner";
import { TitleForm } from "./_components/title-form";
import ReactJson from "react-json-view";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRoleContext } from "@/context/roleContext";
import { SupabaseResponse } from "@/models/requestModels";
import { DescriptionForm } from "./_components/description-form";

const CourseIdPage = () => {
  const { role } = useRoleContext();
  const { user, isSignedIn } = useUser();
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [course, setCourse] = useState<SupabaseResponse<Array<any>>>();
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const initializePage = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken({ template: "supabase" });
          setToken(token || "");
          const courseId = window.location.pathname.split("/").pop() || "";
          const courseData = await EnrollmentService.getCourseById({ userId, courseId, token });
          setCourse(courseData);
        }
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
      }
    };
    initializePage();
  }, [isSignedIn, user]);

  const courseId = window.location.pathname.split("/").pop() || "";

  // Callback function to handle title update
  // Change the type of `prevCourse` to `SupabaseResponse<any[]> | undefined`
  // Change the type of `prevCourse` to `SupabaseResponse<any[]> | undefined`
  const handleTitleUpdate = (updatedTitle: string) => {
    setCourse((prevCourse: SupabaseResponse<any[]> | undefined) => ({
      ...prevCourse!,
      data: [{ ...(prevCourse?.data?.[0] ?? {}), title: updatedTitle }],
    }));
  };

  const handleDescriptionUpdate = (updatedDescription: string) => {
    setCourse((prevCourse: SupabaseResponse<any[]> | undefined) => ({
      ...prevCourse!,
      data: [
        { ...(prevCourse?.data?.[0] ?? {}), description: updatedDescription },
      ],
    }));
  };

  return (
    <div>
      <Banner label="This course is unpublished. It will not be visible to the students." />
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              Course setup and User Id {userId}
            </h1>
            <span className="text-sm text-slate-700">
              Course ID: {courseId || ""}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm
              initialData={{ title: course?.data?.[0]?.title || "" }}
              courseId={courseId || ""}
              token={token}
              userId={userId}
              onTitleUpdate={handleTitleUpdate} // Pass the callback function
            />
            <DescriptionForm
              initialData={{
                description: course?.data?.[0]?.description || "",
              }}
              courseId={courseId || ""}
              token={token}
              userId={userId}
              onDescriptionUpdate={handleDescriptionUpdate} // Pass the callback function
            />
          </div>

          {course?.data?.map((row) => (
            <ReactJson src={row || {}} key={row?.course_id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
