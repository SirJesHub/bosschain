import React, { useEffect } from "react";
import { courseInformation } from "../mockData/courseInformation";
import { userLearningData } from "../mockData/userLearningData";
import { useState } from "react";
import Router, { useRouter } from "next/navigation";
import { CheckSquare2, Square, ChevronDown, ChevronUp } from "lucide-react";
import CourseSidebarSkeleton from "./CourseSidebarSkeleton";
import Progressbar from "./Progressbar";

export default function CourseSidebar({
  courseId,
  lessonId,
  nextLessonIdHandler
}: {
  courseId: Number;
  lessonId: Number;
  nextLessonIdHandler: Function
}) {
  const router = useRouter();
  const progress = userLearningData.progress;
  const initialLessonVisibility = courseInformation.weeks.reduce(
    (acc: any, week: any) => {
      acc[week.weekNumber] = week.lessons.some(
        (lesson: any) => lesson.lessonNumber == lessonId
      );
      return acc;
    },
    {}
  );
  // change name lessonVisibility => weekVisibility
  const [isLoading, setIsLoading] = useState(true);
  const [lessonVisibility, setLessonVisibility] = useState(
    initialLessonVisibility
  );
  const [completedLessonCount, setCompletedLessonCount] = useState<number>(0);
  const [totalLessonCount, setTotalLessonCount] = useState<number>(0);
  const [lessonProgress, setLessonProgress] = useState<
    { completedLesson: number; totalLesson: number }[]
  >([]);

  useEffect(() => {
    let completedLessonCount: number = 0;
    let totalLessonCount: number = 0;
    let lessonProgress: { completedLesson: number; totalLesson: number }[] = [];
    progress.map((week: any) => {
      let completedWeekLessonsCount: number = 0;
      let totalWeekLessonsCount: number = 0;
      week.lessons.map((lesson: any) => {
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
      setCompletedLessonCount(completedLessonCount);
      setTotalLessonCount(totalLessonCount);
      setLessonProgress(lessonProgress);
    });
    setIsLoading(false);
  }, [progress]);

  useEffect(() => {

    let nextLessonNumber = null;
    let foundCurrentLesson = false;

    for (let week of courseInformation.weeks) {
      for (let lesson of week.lessons) {
          if (foundCurrentLesson) {
              nextLessonNumber = lesson.lessonNumber;
              break;
          }
          if (lesson.lessonNumber == lessonId) {
              foundCurrentLesson = true;
          }
      }
      if (foundCurrentLesson && nextLessonNumber !== null) {
          break;
      }
  }

  nextLessonIdHandler(nextLessonNumber, completedLessonCount, totalLessonCount)

  }, [completedLessonCount, totalLessonCount]);

  // change toggleLesson => toggleWeek
  const toggleLesson = (weekNumber: any) => {
    setLessonVisibility((prevState: any) => ({
      ...prevState,
      [weekNumber]: !prevState[weekNumber],
    }));
  };

  if (isLoading) {
    return <CourseSidebarSkeleton />;
  }

  return (
    <div className="w-full pr-4 relative">
     

      <div className="relative z-11">
        {courseInformation.weeks.map((week, index) => {
          const weeklyProgress = progress[index];

          return (
            <div
              className="bg-blue-300 mb-3 w-full mx-auto p-4 flex flex-wrap rounded-xl relative hover:bg-blue-400  hover:shadow-3xl transition-all duration-700 cursor-pointer"
              key={week.weekNumber}
              onClick={() => toggleLesson(week.weekNumber)}
            >
              <div className="">
                <h1 className="text-base  mb-2">
                  Week {week.weekNumber} : {week.weekTitle}
                </h1>
                <h1 className="text-xs flex w-full mb-2">{`Lesson : ${lessonProgress[index].completedLesson}/${lessonProgress[index].totalLesson}`}</h1>

                {lessonVisibility[week.weekNumber] === false ? (
                  <ChevronDown className="absolute right-4 top-4 " />
                ) : (
                  <ChevronUp className="absolute right-4 top-4 " />
                )}
              </div>
              <div
                className={`grid w-full overflow-hidden transition-all duration-500 ease-in-out ${
                  lessonVisibility[week.weekNumber]
                    ? "grid-rows-[1fr] opacity-100"
                    : " grid-rows-[0fr] opacity-0"
                } `}
              >
                <div className="overflow-hidden">
                  {week.lessons.map((lesson, index) => {
                    // if (lessonVisibility[week.weekNumber]) {
                    return (
                      <div
                        className={`w-full text-xs flex flex-wrap items-center p-3 mb-2  hover:bg-slate-300 transition-colors rounded-lg 
                     ${
                       lessonId == lesson.lessonNumber
                         ? "bg-neutral-300"
                         : "bg-slate-100"
                     }`}
                        key={lesson.lessonNumber}
                        onClick={() =>
                          router.push(
                            `/browse/${courseId}/${lesson.lessonNumber}`
                          )
                        }
                      >
                        {weeklyProgress.lessons[index].status ===
                        "completed" ? (
                          <CheckSquare2 />
                        ) : (
                          <Square />
                        )}
                        <p className="ml-2">{`${lesson.lessonNumber} . ${lesson.lessonTitle}`}</p>
                      </div>
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
