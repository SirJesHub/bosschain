"use client";
import React, { useEffect, useState } from "react";
import {
  CourseService
} from "@/lib/supabase/courseRequests";
import NextCourseButton from "./_components/next-lesson-button";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import { userLearningData } from "@/app/browse/_components/mockData/userLearningData";
import CourseSidebar from "./_components/course-side-bar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Progressbar from "@/app/browse/_components/lesson/Progressbar";
import LessonInfo from "@/app/browse/_components/lesson/LessonInfo";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
export default function layout({
  children,
  params: { courseId },
}: {
  children: React.ReactNode;
  params: { courseId: number };
}) {
  const [lessonCompletion, setLessonCompletion] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [courseData, setCourseData] = useState<any>();
  const [progress, setProgress] = useState<any>();
  const [lessonIndex, setLessonIndex] = useState<number>(-1);
  const [moduleIndex, setModuleIndex] = useState<number>(-1);
  const [moduleId, setModuleId] = useState<number>(-1);
  const pathName = usePathname();
  const [nextLessonIndex, setNextLessonIndex] = useState<number>();
  const [nextModuleId, setNextModuleId] = useState<number>();
  const [completedLessonCount, setCompletedLessonCount] = useState<number>();
  const [totalLessonCount, setTotalLessonCount] = useState<number>();
  const [lessonProgress, setLessonProgress] = useState<
    { completedLesson: number; totalLesson: number }[]
  >([]);
  const [userAuth, setUserAuth] = useState<any>();
  // const [enrollmentId, setEnrollmentId] = useState<number>(-1);
  const [lessonId, setLessonId] = useState<number>(-1);
  const [enrollmentData, setEnrollmentData] = useState<any>();
  const [lessonLengths, setLessonLengths] = useState<any>();
  const router = useRouter();

  // useEffect(() => {
  //   if (pathName) {
  //     const index: RegExpMatchArray | null = pathName.match(/lessons\/(\d+)/);
  //     if (index !== null) {
  //       const extractedLessonNumber: number = parseInt(index[1], 10);
  //       setLessonIndex(extractedLessonNumber);
  //     }
  //   }
  //   if (pathName) {
  //     const index = pathName.match(/modules\/(\d+)/);
  //     if (index !== null) {
  //       const extractedModuleNumber = parseInt(index[1], 10);
  //       setModuleId(extractedModuleNumber);
  //     }
  //   }
  // }, [pathName && []]);

  // useEffect(() => {
  //   const initializePage = async () => {
  //     const token = await getToken({ template: "supabase" });
  //     const userAuth = { userId: userId, token: token };
  //     const enrollment = await getEnrollment(userAuth, courseId);
  //     if (enrollment.data) {
  //       setEnrollmentId(enrollment.data.enrollment_id);
  //     }
  //   };
  //   initializePage();
  // }, []);

  useEffect(() => {
    const initializePage = async () => {
      let extractedLessonNumber;
      let extractedModuleNumber;

      let lessonId, moduleIndex, nextLessonNumber, nextModuleId;

      if (pathName) {
        const indexLesson: RegExpMatchArray | null =
          pathName.match(/lessons\/(\d+)/);
        const indexModule = pathName.match(/modules\/(\d+)/);

        if (indexLesson !== null) {
          extractedLessonNumber = parseInt(indexLesson[1], 10);
          setLessonIndex(extractedLessonNumber);
        }

        if (indexModule !== null) {
          extractedModuleNumber = parseInt(indexModule[1], 10);
          if(extractedModuleNumber){
            setModuleId(extractedModuleNumber);
          }
      
        }
      }

      const token = await getToken({ template: "supabase" });
      const userAuth = { userId: userId, token: token };
      setUserAuth(userAuth);

      try {
        const courseData = await CourseService.getFullCurrentCourse(userAuth, courseId);

        // 1.Course Validity Check
        if (!courseData.data) {
          console.log("course is not found");
          return router.push("/browse");
        }
        setCourseData(courseData.data);
        getLessonAmount(courseData.data.module);

        // 2.Course Publishment check
        if (!courseData.data.is_published) {
          console.log("course is not published");
          return router.push("/browse");
        }
        const enrollment = await CourseService.getEnrollment(userAuth, courseId);

        // 3. Course Enrollment check
        if (enrollment.data) {
          const progress = await CourseService.getProgress(
            userAuth,
            courseId,
            enrollment.data.enrollment_id
          );

          if (progress.data) {
            setProgress(progress.data);
            setEnrollmentData(enrollment.data);

            if (typeof extractedLessonNumber === "number") {
              const { lessonId, moduleIndex, nextLessonNumber, nextModuleId } =
                findNextLessonAndModule(courseData, extractedLessonNumber);
              console.log(
                lessonId,
                moduleIndex,
                nextLessonNumber,
                nextModuleId,
                extractedLessonNumber
              );

              setNextModuleId(nextModuleId);
              setNextLessonIndex(nextLessonNumber);
              setLessonId(lessonId);
              setModuleIndex(moduleIndex);

              for (let lesson of progress.data[moduleIndex].lesson) {
                if (lesson.index === extractedLessonNumber) {
                  setLessonCompletion(lesson.lesson_progress[0].completed);
                }
              }
            }
            const { completedLessonCount, totalLessonCount, lessonProgress } =
              calculateLessonProgress(progress.data);

            setCompletedLessonCount(completedLessonCount);
            setTotalLessonCount(totalLessonCount);
            setLessonProgress(lessonProgress);
          }
        } else {
          if (typeof extractedLessonNumber === "number") {
            const { lessonId, moduleIndex, nextLessonNumber, nextModuleId } =
              findNextLessonAndModule(courseData, extractedLessonNumber);

            setNextModuleId(nextModuleId);
            setNextLessonIndex(nextLessonNumber);
            setLessonId(lessonId);
            setModuleIndex(moduleIndex);
          }
          console.log("no user enrollment");
        }
      } catch (error) {
        console.log("[ERROR while fetching enrollment and progress]: ", error);
      }
      setIsLoading(false);
    };
    initializePage();
  }, [pathName || []]);

  function getLessonAmount(data: any) {
    const lessonLengths = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      lessonLengths.push({
        module_id: item.module_id,
        lesson_length: item.lesson.length,
      });
    }
    setLessonLengths(lessonLengths);
  }

  function calculateLessonProgress(progressData: any) {
    let completedLessonCount: number = 0;
    let totalLessonCount: number = 0;
    let lessonProgress: {
      completedLesson: number;
      totalLesson: number;
    }[] = [];

    progressData.map((module: any) => {
      let completedWeekLessonsCount: number = 0;
      let totalWeekLessonsCount: number = 0;
      module.lesson.map((lesson: any) => {
        totalWeekLessonsCount += 1;
        totalLessonCount += 1;
        if (lesson.lesson_progress[0].completed) {
          completedLessonCount += 1;
          completedWeekLessonsCount += 1;
        }
      });
      lessonProgress.push({
        completedLesson: completedWeekLessonsCount,
        totalLesson: totalWeekLessonsCount,
      });
    });
    return {
      completedLessonCount,
      totalLessonCount,
      lessonProgress,
    };
  }

  function findNextLessonAndModule(courseData: any, lessonIndex: number) {
    let nextLessonNumber = null;
    let nextModuleId = null;
    let foundCurrentLesson = false;
    let moduleIndex = null;
    let lessonId = null;

    for (let module of courseData.data.module) {
      for (let lesson of module.lesson) {
        if (foundCurrentLesson) {
          nextLessonNumber = lesson.index;
          nextModuleId = lesson.module_id;
          break;
        }
        if (lesson.index === lessonIndex) {
          lessonId = lesson.lesson_id;
          moduleIndex = module.index;
          foundCurrentLesson = true;
        }
      }
      if (foundCurrentLesson && nextLessonNumber !== null) {
        break;
      }
    }
    return {
      lessonId,
      moduleIndex,
      nextLessonNumber,
      nextModuleId,
    };
  }

  const lessonCompletionHandler = async () => {
    if (!lessonCompletion) {
      await CourseService.updateProgress(userAuth, enrollmentData.enrollment_id, lessonId);
      toast.success("Lesson completed");

      const enrollment = await CourseService.getEnrollment(userAuth, courseId);

      // 3. Course Enrollment check
      // if (enrollment.data) {
        const progress = await CourseService.getProgress(
          userAuth,
          courseId,
          enrollmentData.enrollment_id
        );
        setProgress(progress.data);
        const { completedLessonCount, totalLessonCount, lessonProgress } =
          calculateLessonProgress(progress.data);

        setCompletedLessonCount(completedLessonCount);
        setTotalLessonCount(totalLessonCount);
        setLessonProgress(lessonProgress);
        setLessonCompletion(true)
      // }

      // if (nextModuleId && nextLessonIndex) {
      //   router.push(
      //     `/courses/${courseId}/modules/${nextModuleId}/lessons/${nextLessonIndex}`
      //   );
      // }
    }
  };

  const nextLessonHandler = async () => {
    if (nextModuleId && nextLessonIndex) {
      router.push(
        `/courses/${courseId}/modules/${nextModuleId}/lessons/${nextLessonIndex}`
      );
    }
  };

  return (
    <div className="grid grid-cols-12 grid-rows-6 h-screen gap-2 ">
      <Toaster position="top-center" />
      <div className="col-span-9 row-span-6 overflow-auto px-4 mt-4">
        <main>{children}</main>
      </div>
      {!isLoading && (
        <div className="col-span-3 row-span-1 border-2 border-gray-200 rounded-md mr-4 mt-4 pl-3 pr-3 flex flex-col justify-around">
          <LessonInfo title={courseData.title} />
          {enrollmentData &&  completedLessonCount && totalLessonCount&& (
            <Progressbar
              completedLessonCount={completedLessonCount}
              totalLessonCount={totalLessonCount}
            />
          )}
        </div>
      )}
      {!isLoading && courseData &&(
        <div className="col-span-3 row-span-4 overflow-auto mr-4 border-2 ">
          <CourseSidebar
            courseData={courseData.module}
            courseId={courseId}
            lessonIndex={lessonIndex}
            moduleId={moduleId}
            enrollmentData={enrollmentData}
            userProgress={enrollmentData ? progress : undefined}
            lessonProgress={enrollmentData ? lessonProgress : undefined}
            lessonLengths={lessonLengths}
          />
        </div>
      )}
      {!isLoading && (
        <div className="col-span-3 row-span-1 mr-4  flex flex-col justify-around ">
          {enrollmentData && (
            <button
              onClick={lessonCompletionHandler}
              className={`p-1 pl-2 pr-2 h-2/5 ${lessonCompletion ? "cursor-not-allowed text-gray-400 " : ""} rounded-lg w-full text-black font-semibold flex justify-center items-center bg-gray-200 hover:bg-gray-300 hover:shadow-md transition-all duration-700`}
            >
              Mark Lesson Completed
              {/* {`${nextModuleId && nextLessonIndex ? "Continue & Mark Lesson Complete" : "Mark Lesson Complete"} `} */}
            </button>
          )}

          <button
            onClick={nextLessonHandler}
            className={`p-1 pl-2 pr-2 rounded-lg  w-full text-white transition-all duration-700 font-semibold flex justify-center items-center ${nextLessonIndex === null ? "bg-blue-200 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 hover:shadow-md"} ${enrollmentData ? "h-2/5" : "h-3/5"} `}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
