"use client";
import { useRouter } from "next/navigation";
import { userLearningData } from "../../../_components/mockData/userLearningData";
import { courseInformation } from "../../../_components/mockData/courseInformation";
import { useState, useEffect } from "react";
import CourseSidebar from "../../../_components/lesson/CourseSidebar";
import Content from "../../../_components/lesson/Content";
import TextEditor from "../../../_components/lesson/TextEditor";
import Image from "next/image";
import NextVideo from "next-video";
import Wildlife_Sample from "../../../../../videos/Wildlife_Sample.mp4.json";
import Link from "next/link";
import Progressbar from "../../../_components/lesson/Progressbar";
import {
  createCourse,
  getCourse,
  getFullCourse,
  getFullCurrentCourse,
  getLessonContent,
  updateAllCourse,
  insertCourseAlgolia,
  getEnrollment,
} from "@/lib/supabase/courseRequests";
import { Database } from "@/types/supabase";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import CourseSidebarSkeleton from "@/app/browse/_components/lesson/CourseSidebarSkeleton";
import LessonInfoSkeleton from "@/app/browse/_components/lesson/LessonInfoSkeleton";
import { Timer } from "lucide-react";
import LessonInfo from "@/app/browse/_components/lesson/LessonInfo";
import Demo from "@/app/browse/_components/lesson/Demo";


export default function LessonPage({
  params: { lessonIndex, courseId, moduleId },
}: {
  params: { lessonIndex: number; courseId: number; moduleId: number };
}) {
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<any>();
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const [courseData, setCourseData] = useState<any>();
  const userId = maybeUserId || "";
  const router = useRouter();
  const [nextLessonId, setNextLessonId] = useState<number>();
  const [nextModuleId, setNextModuleId] = useState<number>();
  const [completedLessonCount, setCompletedLessonCount] = useState<number>();
  const [totalLessonCount, setTotalLessonCount] = useState<number>();
  const [contentType, setContentType] = useState<string | null>();
  const [content, setContent] = useState<string>();
  const [lessonProgress, setLessonProgress] = useState<
    { completedLesson: number; totalLesson: number }[]
  >([]);

  const [test, setTest] = useState("")

 

  const getUserProgress = () => {
    return userLearningData.progress;
  };

  const lessonCompletionHandler = () => {
    // set learning progress to completed and naviate to next lesson
    <Link href={`/browse/${courseId}/${nextModuleId}/${nextLessonId}`}></Link>
  };

  const nextLessonIdHandler = (
    nextlessonId: number,
    completedLessonCount: number,
    totalLessonCount: number
  ) => {
    // setNextLessonId(nextlessonId);
    // setCompletedLessonCount(completedLessonCount);
    // setTotalLessonCount(totalLessonCount);
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        const token = await getToken({ template: "supabase" });
        const userAuth = { userId: userId, token: token };
        // const course = {userId: userAuth.userId, token:userAuth.token, title:"test create course function inserting to algolia", description:"test create course function"}
        // const x = await createCourse(course)
        // if (x.data) {
        //   await insertCourseAlgolia(
        //     x.data[0].course_id,
        //     x.data[0].created_at,
        //     x.data[0].title,
        //     x.data[0].description,
        //     x.data[0].instructor_id,
        //   );
        // }
        const courseDetail = await getFullCurrentCourse(userAuth, courseId);
        const userProgress = getUserProgress();
        const lessonContent = await getLessonContent(
          userAuth,
          moduleId,
          lessonIndex
        );
        const isEnrolled = await getEnrollment(userAuth, courseId)
        console.log("enrollment",isEnrolled)
        if (courseDetail.data) {
          setCourseData(courseDetail.data);
        } else {
          console.log("Course Details Not Found");
        }
        if (lessonContent.data) {
          setContent(lessonContent.data.content);
          setContentType(lessonContent.data.content_type);
        } else {
          console.log("Lesson Content Not Found");
        }
        if (userProgress) {
         
          setUserProgress(userProgress);
          let completedLessonCount: number = 0;
          let totalLessonCount: number = 0;
          let lessonProgress: {
            completedLesson: number;
            totalLesson: number;
          }[] = [];
          userProgress.map((module: any) => {
            let completedWeekLessonsCount: number = 0;
            let totalWeekLessonsCount: number = 0;
            module.lesson.map((lesson: any) => {
              totalWeekLessonsCount += 1;
              totalLessonCount += 1;
              if (lesson.status === "completed") {
                completedLessonCount += 1;
                completedWeekLessonsCount += 1;
              }
            });
            lessonProgress.push({
              completedLesson: completedWeekLessonsCount,
              totalLesson: totalWeekLessonsCount,
            });
          });
          let nextLessonNumber = null;
          let nextModuleNumber = null;
          let foundCurrentLesson = false;
          for (let module of courseDetail.data.module) {
            for (let lesson of module.lesson) {
              if (foundCurrentLesson) {
                nextLessonNumber = lesson.index;
                nextModuleNumber = lesson.module_id;
                console.log("nextModuleNumber", nextModuleNumber);
                break;
              }
              if (lesson.index == lessonIndex) {
                foundCurrentLesson = true;
              }
            }
            if (foundCurrentLesson && nextLessonNumber !== null) {
              break;
            }
          }
          setCompletedLessonCount(completedLessonCount);
          setTotalLessonCount(totalLessonCount);
          setLessonProgress(lessonProgress);
          setNextLessonId(nextLessonNumber);
          setNextModuleId(nextModuleNumber);
        } else {
          console.log("User Progress Not Found");
        }
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
      }
      setLoading(false);
    };
    initializePage();
    console.log("Loading State is:", loading);
  }, []);

  useEffect(()=>{
    setTimeout(() => {
      
      console.log("Timeout completed!");
      setTest("hellooo hiiaoidsfaisjdfijaiudfjaukshdjfkajksdfjasdfjakjsdfjkads fkajk ellooo hiiaoidsfaisjdfijaiudfjaukshdjfkajksdfjasdfjakjsdfjkads fkajksdfjasdfjakjsdf fkajksdfjasdfjasdfjakjsdf fkajksdfjasdfjakjsdf")
    }, 10000);
   
  },[test])
  return (
    <div className="grid grid-cols-12 grid-rows-5 h-screen gap-2 ">
      <div className=" col-span-9 row-span-5 overflow-auto px-4  mt-4">
        {!loading && contentType === "article" && (
          <div className="flex flex-col items-end ">
            <TextEditor content={content} />
            {nextLessonId != null && (
              <button
                className="p-1 pl-2 pr-2 my-5 h-10 rounded-3xl bg-blue-500 w-48 text-white font-bold"
                onClick={lessonCompletionHandler}
              >
                Mark lesson complete
              </button>
            )}
          </div>
        )}
        {!loading && contentType === "video" && (
          <div className="w-75% overflow-hidden">
            <NextVideo src={Wildlife_Sample} accentColor="#539FFF" />
          </div>
        )}
      </div>

      <div className="col-span-3 row-span-1 bg-gray-100 rounded-xl mr-4 mt-4 pl-3 pr-3 flex flex-col justify-between">
      
        {!loading && (
          <>
            <LessonInfo />
            <Progressbar
              completedLessonCount={completedLessonCount}
              totalLessonCount={totalLessonCount}
            />
          </>
        )}
        {/* {loading && <LessonInfoSkeleton />} */}
      </div>

      <div className="col-span-3 row-span-4 overflow-auto mb-2 ">

        {!loading && (
          <CourseSidebar
            courseInfo={courseData.module}
            userProgress={userProgress}
            courseId={courseId}
            moduleId={moduleId}
            lessonIndex={lessonIndex}
            completedLesson={completedLessonCount}
            totalLesson={totalLessonCount}
            lessonProgress={lessonProgress}
          />
         )} 
        {/* {loading && <CourseSidebarSkeleton />} */}
       
      </div>
    </div>
  );
}
