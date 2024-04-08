import React, { useEffect, useState } from "react";
import {
  createCourse,
  getCourse,
  getFullCourse,
  getFullCurrentCourse,
  getLessonContent,
  updateAllCourse,
  insertCourseAlgolia,
} from "@/lib/supabase/courseRequests";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";

export default function Demo({
  lessonIndex,
  courseId,
  moduleId,
}: {
  lessonIndex: number;
  courseId: number;
  moduleId: number;
}) {
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [courseData, setCourseData] = useState<any>();

  useEffect(() => {
    const initializePage = async () => {
      const token = await getToken({ template: "supabase" });
      const userAuth = { userId: userId, token: token };
      const courseDetail = await getFullCurrentCourse(userAuth, courseId);
    //   if (courseDetail.data) {
        console.log(courseDetail.data)
        setCourseData(courseDetail.data);
    //   }
    };
    initializePage();
  }, [courseId]);
  return (
    <div>
        { courseData &&  <p>{courseData.description}</p>}
     
    </div>
  );
}
