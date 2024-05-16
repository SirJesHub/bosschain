"use client";
import React, { useEffect, useState } from "react";
import { CourseService } from "@/lib/supabase/courseRequests";
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
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userAuth, setUserAuth] = useState<any>();
  const userId = maybeUserId || "";
  const router = useRouter();
  const pathName = usePathname();

  const [courseData, setCourseData] = useState<any>();
  const [progress, setProgress] = useState<any>();
  const [enrollmentData, setEnrollmentData] = useState<any>();

  const [lessonLengths, setLessonLengths] = useState<any>();
  const [completedLessonCount, setCompletedLessonCount] = useState<number>();
  const [totalLessonCount, setTotalLessonCount] = useState<number>();
  const [lessonProgress, setLessonProgress] = useState<
    { completedLesson: number; totalLesson: number }[]
  >([]);
  const [lessonCompletion, setLessonCompletion] = useState<boolean>();

  const [moduleId, setModuleId] = useState<number>(-1);
  const [moduleIndex, setModuleIndex] = useState<number>(-1);
  const [nextModuleId, setNextModuleId] = useState<number>(-1);

  const [lessonIndex, setLessonIndex] = useState<number>(-1);
  const [nextLessonIndex, setNextLessonIndex] = useState<number | undefined>(
    -1,
  );
  const [currentLessonId, setCurrentLessonId] = useState<number>(-1);
  const [lessonId, setLessonId] = useState<number>(-1);

  useEffect(() => {
    const initializePage = async () => {
      let extractedLessonIndex;
      let extractedModuleNumber;

      if (pathName) {
        const indexLesson: RegExpMatchArray | null =
          pathName.match(/lessons\/(\d+)/);
        const indexModule = pathName.match(/modules\/(\d+)/);

        if (indexLesson !== null) {
          extractedLessonIndex = parseInt(indexLesson[1], 10);
          setLessonIndex(extractedLessonIndex);
        }

        if (indexModule !== null) {
          extractedModuleNumber = parseInt(indexModule[1], 10);
          if (extractedModuleNumber) {
            setModuleId(extractedModuleNumber);
          }
        }
      }

      const token = await getToken({ template: "supabase" });
      const userAuth = { userId: userId, token: token };
      setUserAuth(userAuth);

      try {
        const courseData = await CourseService.getFullCurrentCourse(
          userAuth,
          courseId,
        );

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
        const enrollment = await CourseService.getEnrollment(
          userAuth,
          courseId,
        );

        // 3. Course Enrollment check
        if (enrollment.data) {
          const progress = await CourseService.getProgress(
            userAuth,
            courseId,
            enrollment.data.enrollment_id,
          );
          console.log("progress", progress);

          if (progress.data) {
            setProgress(progress.data);
            setEnrollmentData(enrollment.data);

            if (
              typeof extractedLessonIndex === "number" &&
              typeof extractedModuleNumber === "number"
            ) {
              const x = findNextModuleAndLesson(
                courseData,
                extractedModuleNumber,
                extractedLessonIndex,
              );
              console.log("value:", x);
              setNextModuleId(x?.module_id);
              setNextLessonIndex(x?.lesson_index);
              setLessonId(extractedLessonIndex);
              setModuleIndex(extractedModuleNumber);
              setCurrentLessonId(x?.currentLessonId);

              // error here
              for (let lesson of progress.data[x?.currentModuleIndex].lesson) {
                console.log("lesson", lesson);
                if (lesson.index === extractedLessonIndex) {
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
          if (
            typeof extractedLessonIndex === "number" &&
            typeof extractedModuleNumber === "number"
          ) {
            const x = findNextModuleAndLesson(
              courseData,
              extractedModuleNumber,
              extractedLessonIndex,
            );
            console.log("value:", x);
            setNextModuleId(x?.module_id);
            setNextLessonIndex(x?.lesson_index);
            setLessonId(extractedLessonIndex);
            setModuleIndex(extractedModuleNumber);
            setCurrentLessonId(x?.currentLessonId);
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

    console.log("progressData", progressData);
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

  // function findNextModuleAndLesson(
  //   courseData: any,
  //   currentModuleId: any,
  //   currentLessonIndex: number
  // ) {
  //   console.log("ran");
  //   const module = courseData.data.module;

  //   for (let i = 0; i < module.length; i++) {
  //     if (module[i].module_id === currentModuleId) {
  //       if (currentLessonIndex < module[i].lesson.length - 1) {
  //         console.log("250",module[i].lesson[currentLessonIndex].lesson_id)

  //         // If there are more lessons in the current module, return the next lesson in the same module
  //         return {
  //           module_id: currentModuleId,
  //           lesson_index: currentLessonIndex + 1,
  //           currentModuleIndex: module[i].index,
  //           currentLessonId: module[i].lesson[currentLessonIndex].lesson_id
  //         };
  //       } else if (i < module.length - 1) {
  //         console.log("250",module[i].lesson[currentLessonIndex].lesson_id)

  //         // If the current module is not the last one, return the first lesson of the next module
  //         return {
  //           module_id: module[i + 1].module_id,
  //           lesson_index: 0,
  //           currentModuleIndex: module[i].index,
  //           currentLessonId: module[i].lesson[currentLessonIndex].lesson_id
  //         };
  //       } else if (i === module.length - 1 && currentLessonIndex === module[i].lesson.length - 1) {
  //         // If it's the last module and last lesson, return only the currentModuleIndex and currentLessonId
  //         return {
  //           module_id: -1,
  //           lesson_index: -1,
  //           currentModuleIndex: module[i].index,
  //           currentLessonId: module[i].lesson[currentLessonIndex].lesson_id
  //         };
  //       }
  //     }
  //   }

  function findNextModuleAndLesson(
    courseData: any,
    currentModuleId: any,
    currentLessonIndex: number,
  ) {
    console.log("ran");
    const moduleData = courseData.data.module;

    for (let i = 0; i < moduleData.length; i++) {
      if (moduleData[i].module_id === currentModuleId) {
        if (currentLessonIndex < moduleData[i].lesson.length - 1) {
          // If there are more lessons in the current module, return the next lesson in the same module
          return {
            module_id: currentModuleId,
            lesson_index: currentLessonIndex + 1,
            currentModuleIndex: moduleData[i].index,
            currentLessonId: moduleData[i].lesson[currentLessonIndex].lesson_id,
          };
        } else if (i < moduleData.length - 1) {
          // If the current module is not the last one, return the first lesson of the next module
          return {
            module_id: moduleData[i + 1].module_id,
            lesson_index: 0,
            currentModuleIndex: moduleData[i].index,
            currentLessonId: moduleData[i].lesson[currentLessonIndex].lesson_id,
          };
        } else if (
          i === moduleData.length - 1 &&
          currentLessonIndex === moduleData[i].lesson.length - 1
        ) {
          // If it's the last module and last lesson, return only the currentModuleIndex and currentLessonId
          return {
            module_id: -1,
            lesson_index: -1,
            currentModuleIndex: moduleData[i].index,
            currentLessonId: moduleData[i].lesson[currentLessonIndex].lesson_id,
          };
        }
      }
    }
    // If the current module or lesson doesn't exist, return null
    return null;
  }

  // function findNextLessonAndModule(courseData: any, lessonIndex: number) {
  //   let nextLessonNumber = null;
  //   let nextModuleId = null;
  //   let foundCurrentLesson = false;
  //   let moduleIndex = null;
  //   let lessonId = null;

  //   for (let moduleVariable of courseData.data.module) {
  //     for (let lesson of moduleVariable.lesson) {
  //       if (foundCurrentLesson) {
  //         nextLessonNumber = lesson.index;
  //         nextModuleId = lesson.module_id;
  //         break;
  //       }
  //       if (lesson.index === lessonIndex) {
  //         lessonId = lesson.lesson_id;
  //         moduleIndex = moduleVariable.index;
  //         foundCurrentLesson = true;
  //       }
  //     }
  //     if (foundCurrentLesson && nextLessonNumber !== null) {
  //       break;
  //     }
  //   }
  //   return {
  //     lessonId,
  //     moduleIndex,
  //     nextLessonNumber,
  //     nextModuleId,
  //   };
  // }

  const lessonCompletionHandler = async () => {
    if (!lessonCompletion) {
      await CourseService.updateProgress(
        userAuth,
        enrollmentData.enrollment_id,
        currentLessonId,
      );
      toast.success("Lesson completed");

      const enrollment = await CourseService.getEnrollment(userAuth, courseId);

      // 3. Course Enrollment check
      // if (enrollment.data) {
      const progress = await CourseService.getProgress(
        userAuth,
        courseId,
        enrollmentData.enrollment_id,
      );
      setProgress(progress.data);
      const { completedLessonCount, totalLessonCount, lessonProgress } =
        calculateLessonProgress(progress.data);

      setCompletedLessonCount(completedLessonCount);
      setTotalLessonCount(totalLessonCount);
      setLessonProgress(lessonProgress);
      setLessonCompletion(true);
      // }

      // if (nextModuleId && nextLessonIndex) {
      //   router.push(
      //     `/courses/${courseId}/modules/${nextModuleId}/lessons/${nextLessonIndex}`
      //   );
      // }
    }
  };

  const nextLessonHandler = async () => {
    console.log(
      "nextLessonIndex",
      nextLessonIndex,
      "nextModuleId",
      nextModuleId,
    );
    if (nextModuleId !== -1 && nextLessonIndex !== -1) {
      router.push(
        `/courses/${courseId}/modules/${nextModuleId}/lessons/${nextLessonIndex}`,
      );
    }
  };

  return (
    <div className="pt-[69px] h-full w-full">
      <div className="h-full grid grid-cols-12 grid-rows-6 gap-2">
        <Toaster position="top-center" />
        <div className="col-span-9 overflow-auto row-span-6   ">
          <main className="h-full">{children}</main>
        </div>
        {!isLoading && (
          <div className="col-span-3 row-span-1 border-2 border-gray-200 rounded-md mr-4 pl-3 pr-3 mt-2 flex flex-col justify-around">
            <LessonInfo title={courseData.title} />
            {enrollmentData && completedLessonCount && totalLessonCount && (
              <Progressbar
                completedLessonCount={completedLessonCount}
                totalLessonCount={totalLessonCount}
              />
            )}
          </div>
        )}
        {!isLoading && courseData && (
          <div className="col-span-3 row-span-4 overflow-x-hidden mr-4 border-2 rounded-md">
            <CourseSidebar
              courseData={courseData.module}
              courseId={courseId}
              lessonIndex={lessonIndex}
              moduleId={moduleId}
              enrollmentData={enrollmentData}
              userProgress={enrollmentData ? progress : undefined}
              lessonProgress={enrollmentData ? lessonProgress : undefined}
              lessonLengths={lessonLengths}
              currentModuleId={moduleId}
            />
          </div>
        )}
        {!isLoading && (
          <div className="col-span-3 row-span-1 mr-4 flex flex-col justify-around ">
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
              className={`p-1 pl-2 pr-2 rounded-lg  w-full text-white transition-all duration-700 font-semibold flex justify-center items-center ${nextLessonIndex === -1 && nextModuleId === -1 ? "bg-blue-200 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 hover:shadow-md"} ${enrollmentData ? "h-2/5" : "h-3/5"} `}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
