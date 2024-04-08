"use client";

import React, { useEffect, useState } from "react";
import TextEditor from "@/app/browse/_components/lesson/TextEditor";
import { getLessonContent } from "@/lib/supabase/courseRequests";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import NextVideo from "next-video";
import Wildlife_Sample from "@/videos/Wildlife_Sample.mp4.json";
import MuxUploader from "@mux/mux-uploader-react";

export default function page({
  params: { courseId, moduleId, lessonIndex} 
}: {
  params: { courseId: number; moduleId: number; lessonIndex: number }, 
}) {
  const [content, setContent] = useState<string>();
  const [contentType, setContentType] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [userAuth, setUserAuth] = useState<any>()

  useEffect(() => {
    const pageInitialized = async () => {
      const token = await getToken({ template: "supabase" });
      const userAuth = { userId: userId, token: token };
      setUserAuth(userAuth)
      const lessonContent = await getLessonContent(
        userAuth,
        moduleId,
        lessonIndex
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
    <div>
      {!loading && contentType === "article" && (
        <div className="flex flex-col items-end ">
          <TextEditor content={content} userAuth={userAuth} />
        </div>
      )}
      {contentType === "video" && (
        <div className="w-75% overflow-hidden">
          <NextVideo src={Wildlife_Sample} accentColor="#539FFF" />
        </div>
      )}
    </div>
  );
}
