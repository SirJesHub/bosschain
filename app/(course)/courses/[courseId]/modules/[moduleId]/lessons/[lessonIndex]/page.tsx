"use client";

import React, { useEffect, useState } from "react";
import TextEditor from "../../../../_components/TextEditor";
import { CourseService } from "@/lib/supabase/courseRequests";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Wildlife_Sample from "@/videos/Wildlife_Sample.mp4.json";
import MuxUploader from "@mux/mux-uploader-react";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";

export default function page({
  params: { courseId, moduleId, lessonIndex },
}: {
  params: { courseId: number; moduleId: number; lessonIndex: number };
}) {
  const [queryParam, setQueryParam] = useState<string>(
    `?timestamp=${new Date().getTime()}`,
  ); // temporary hack to trigger reload video
  const [content, setContent] = useState<string>();
  const [contentType, setContentType] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [lessonData, setLessonData] = useState<any>();
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [userAuth, setUserAuth] = useState<any>();

  useEffect(() => {
    const pageInitialized = async () => {
      const token = await getToken({ template: "supabase" });
      const userAuth = { userId: userId, token: token };
      setUserAuth(userAuth);

      const lessonData = await EnrollmentService.getLessonDataByIndex(
        userAuth,
        moduleId,
        lessonIndex,
      );
      // Check for lesson data
      if (lessonData.data) {
        const dateString = "2024-05-12T18:16:03.180482+00:00";
        const date = new Date(lessonData.data.created_at);
        const formattedDate = date.toDateString();

        setLessonData(() => ({
          ...lessonData.data,
          created_at: formattedDate,
        }));
      } else {
        console.log("Lesson Content Not Found");
      }
      //Check for lesson content
      const lessonContent = await CourseService.getLessonContent(
        userAuth,
        moduleId,
        lessonIndex,
      );

      if (lessonContent.data) {
        setContent(lessonContent.data.content);
        setContentType(lessonContent.data.content_type);
      } else {
        console.log("Lesson Content Not Found");
      }
      setLoading(false);
    };
    pageInitialized();
  }, []);

  return (
    <div className="h-full flex flex-col w-full">
      <div className="h-full">
        {!loading && contentType === "article" && (
          <div className="flex flex-col items-start h-full pr-2 w-full ">
            <div className="bg-white w-full ml-2 mt-2 border-2 mr-2 border-gray-200 rounded-md ">
              <h1 className="p-3 rounded-xl font-semibold text-xl truncate ">
                {lessonData.title}
              </h1>
              {/* {lessonData.title && (
               <h1 className="p-5 rounded-xl font-semibold text-2xl ">
               {lessonData.title} 
           
             </h1>
              )}
              <p className=" text-sm p-2 rounded-xl">
                {lessonData.created_at}
              </p>
              {lessonData.description && (
                <p className=" text-sm p-2 rounded-xl">
                  {lessonData.description}
                </p>
              )} */}
            </div>
            <div className=" w-full ml-2  mb-2 overflow-scroll flex-grow">
              <TextEditor content={content} userAuth={userAuth} />
            </div>
          </div>
        )}
        {contentType === "video" && (
          <div className="pr-3 pl-4 pt-2">
            <div className="border-gray-200 border-2 rounded-md">
              <video
                className="w-full rounded-md aspect-video shadow-sm "
                controls
              >
                <source
                  src={
                    "https://uemuqiskvetslcirjqdw.supabase.co/storage/v1/object/public/course_assets/47/course/testVideo.mp4"
                  }
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="ml-2">
              {lessonData.title && (
                <h1 className="font-semibold text-2xl my-5 line-clamp-2">
                  {lessonData.title}
                </h1>
              )}
              <p className="bg-gray-100 text-sm p-5 rounded-xl">
                {lessonData.created_at}
              </p>
              {lessonData.description && (
                <p className="bg-gray-100 text-sm p-5 rounded-xl">
                  {lessonData.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
