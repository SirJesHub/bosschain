import React, { useEffect } from "react";
import { courseInformation } from "../mockData/courseInformation";
import { userLearningData } from "../mockData/userLearningData";
import { useState } from "react";
import Router, { useRouter } from "next/navigation";
import { CheckSquare2, Square, ChevronDown, ChevronUp } from "lucide-react";
import CourseSidebarSkeleton from "./CourseSidebarSkeleton";
import Progressbar from "./Progressbar";
import Link from "next/link";

export default function CourseSidebar({
  courseId,
  lessonIndex,
  courseInfo,
  userProgress,
  lessonProgress,
  // totalLesson,
  // completedLesson,
  // nextLessonIdHandler,
  // moduleId,
}: {
  courseInfo: any;
  userProgress: any;
  courseId: number;
  lessonIndex: number;
  // moduleId: number;
  completedLesson: number;
  totalLesson: number;
  lessonProgress: number;
  // nextLessonIdHandler: Function;
}) {
  const router = useRouter();
  const [progress, setProgress] = useState(userProgress);
  const [courseData, setCourseData] = useState(courseInfo);
  const [lessonProgressState, setLessonProgressState] = useState(lessonProgress)
  const [courseIdState, setCourseIdState] = useState(courseId)
  const initialLessonVisibility = courseInfo.reduce((acc: any, module: any) => {
    acc[module.module_id] = module.lesson.some(
      (lesson: any) => lesson.index == lessonIndex
    );
    return acc;
  }, {});
  // const [isLoading, setIsLoading] = useState(true);
  const [lessonVisibility, setLessonVisibility] = useState(
    initialLessonVisibility
  );
  // const [completedLessonCount, setCompletedLessonCount] = useState<number>(0);
  // const [totalLessonCount, setTotalLessonCount] = useState<number>(0);
  // const [lessonProgress, setLessonProgress] = useState<
  //   { completedLesson: number; totalLesson: number }[]
  // >([]);

  // useEffect(() => {
  //   let completedLessonCount: number = 0;
  //   let totalLessonCount: number = 0;
  //   let lessonProgress: { completedLesson: number; totalLesson: number }[] = [];
  //   progress.map((module: any) => {
  //     let completedWeekLessonsCount: number = 0;
  //     let totalWeekLessonsCount: number = 0;
  //     module.lesson.map((lesson: any) => {
  //       totalWeekLessonsCount += 1;
  //       totalLessonCount += 1;
  //       if (lesson.status === "completed") {
  //         completedLessonCount += 1;
  //         completedWeekLessonsCount += 1;
  //       }
  //     });
  //     lessonProgress.push({
  //       completedLesson: completedWeekLessonsCount,
  //       totalLesson: totalWeekLessonsCount,
  //     });
  //     setCompletedLessonCount(completedLessonCount);
  //     setTotalLessonCount(totalLessonCount);
  //     setLessonProgress(lessonProgress);
  //   });
  //   setIsLoading(false);
  // }, [progress]);

  // useEffect(() => {
  //   let nextLessonNumber = null;

  //   let foundCurrentLesson = false;
  //   for (let module of courseInfo) {
  //     for (let lesson of module.lesson) {
  //       if (foundCurrentLesson) {
  //         nextLessonNumber = lesson.index;

  //         break;
  //       }
  //       if (lesson.index == lessonIndex) {
  //         foundCurrentLesson = true;
  //       }
  //     }
  //     if (foundCurrentLesson && nextLessonNumber !== null) {
  //       break;
  //     }
  //   }
  //   nextLessonIdHandler(
  //     nextLessonNumber,
  //     completedLessonCount,
  //     totalLessonCount
  //   );
  // }, [completedLessonCount, totalLessonCount]);

  // change toggleLesson => toggleWeek
  const toggleLesson = (weekNumber: any) => {
    setLessonVisibility((prevState: any) => ({
      ...prevState,
      [weekNumber]: !prevState[weekNumber],
    }));
  };

  // if (isLoading) {
  //   return <CourseSidebarSkeleton />;
  // }
  return (
    <div className="w-full pr-4 relative">
      <div className="relative z-11">
        {courseData.map((module: any, index: any) => {
          const weeklyProgress = progress[index];
          return (
            <div
              className="bg-blue-300 mb-3 w-full mx-auto p-4 flex flex-wrap rounded-xl relative hover:bg-blue-400  hover:shadow-3xl transition-all duration-700 cursor-pointer"
              key={module.module_id}
              onClick={() => toggleLesson(module.module_id)}
            >
              <div>
                <h1 className="text-base mb-2">
                  Module {module.index} : {module.title}
                </h1>
                {/* IMPORTANT!!!! : Not sure what this is so comment for now */}
                {/* <h1 className="text-xs flex w-full mb-2">{`Lesson : ${lessonProgressState[index].completedLesson}/${lessonProgressState[index].totalLesson}`}</h1> */}
                {!lessonVisibility[module.module_id] ? (
                  <ChevronDown className="absolute right-4 top-4 " />
                ) : (
                  <ChevronUp className="absolute right-4 top-4 " />
                )}
              </div>
              <div
                className={`grid w-full overflow-hidden transition-all duration-500 ease-in-out ${
                  lessonVisibility[module.module_id]
                    ? "grid-rows-[1fr] opacity-100"
                    : " grid-rows-[0fr] opacity-0"
                } `}
              >
                <div className="overflow-hidden">
                  {module.lesson.map((lesson: any, index: any) => {
                    // if (lessonVisibility[week.weekNumber]) {
                    return (
                      <Link href ={`/courses/${courseId}/modules/${lesson.module_id}/lessons/${lesson.index}`}>
                      <div
                        className={`w-full text-xs flex flex-wrap items-center p-3 mb-2  hover:bg-slate-300 transition-colors rounded-lg 
                     ${
                       lessonIndex == lesson.index
                         ? "bg-neutral-300"
                         : "bg-slate-100"
                     }`}
                        key={lesson.index}
                      >
                        {weeklyProgress.lesson[index].status == "completed" ? (
                          <CheckSquare2 />
                        ) : (
                          <Square />
                        )}
                        <p className="ml-2">{`${lesson.index} . ${lesson.title}`}</p>
                      </div>
                      </Link>
                    );
                    // }
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
