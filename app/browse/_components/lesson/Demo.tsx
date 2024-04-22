import React, { useEffect, useState } from "react";
import {
 CourseService
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
      const courseDetail = await CourseService.getFullCurrentCourse(userAuth, courseId);
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
