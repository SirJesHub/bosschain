import React, { useState } from "react";
import { CheckSquare2, Square, ChevronDown, ChevronUp } from "lucide-react";
import CourseSidebarLessonItem from "./course-side-bar-lesson-item";
import Link from "next/link";

export default function ModuleItem({
  lessonVisibility,
  index,
  title,
  completedLessonCount,
  totalLessonCount,
  lesson,
  courseId,
  lessonIndex,
  weeklyProgress,
  toggleLesson,
  module_id,
  moduleId,
  enrollmentData,
}: {
  lessonVisibility: boolean;
  index: number;
  title: string;
  lesson: any;
  courseId: number;
  lessonIndex: number;
  weeklyProgress?: any;
  toggleLesson: Function;
  module_id: number;
  moduleId: number;
  enrollmentData: any;
  lessonProgress?: any;
  completedLessonCount?: any;
  totalLessonCount?: any;
}) {
  const [lessonVisibilityState, setLessonVisibilityState] =
    useState(lessonVisibility);

  return (
    <div
      className={`w-full mx-auto flex flex-wrap border-b-2 border-gray-200 relative   hover:shadow-3xl transition-all duration-700 cursor-pointer `}
    >
      <div
        onClick={() => {
          toggleLesson(module_id);
        }}
        className={`h-full w-full ${moduleId === module_id && lessonVisibility !== true ? "bg-blue-500 text-white hover:shadow-md" : "hover:shadow-lg"}`}
      >
        <h1 className="text-base mb-2 m-4 w-4/5">
          {index + 1}.{title}
        </h1>
        {enrollmentData && (
          <h1 className="text-xs flex w-full mb-2 mx-4">
            {`Lessons : ${completedLessonCount}/${totalLessonCount}`}
          </h1>
        )}
        {!enrollmentData && (
          <h1 className="text-xs flex w-full mb-2 mx-4">
            {`${totalLessonCount} Lessons `}
          </h1>
        )}
        {!lessonVisibility ? (
          <ChevronDown className="absolute right-4 top-4" />
        ) : (
          <ChevronUp className="absolute right-4 top-4" />
        )}
      </div>

      <div
        className={`grid w-full overflow-hidden transition-all duration-300 ease-in-out ${
          lessonVisibility
            ? "grid-rows-[1fr] opacity-100"
            : " grid-rows-[0fr] opacity-0"
        } `}
      >
        <div className="overflow-hidden">
          {lesson.map((lesson: any, index: any) => {
            if (enrollmentData) {
              return (
                <div>
                  <CourseSidebarLessonItem
                    courseId={courseId}
                    module_id={lesson.module_id}
                    lessonProgress={
                      weeklyProgress.lesson[index].lesson_progress[0].completed
                    }
                    currentLessonIndex={lessonIndex}
                    lessonIndex={lesson.index}
                    title={lesson.title}
                    enrollmentData={enrollmentData}
                  />
                </div>
              );
            } else {
              return (
                <div>
                  <CourseSidebarLessonItem
                    courseId={courseId}
                    module_id={lesson.module_id}
                    currentLessonIndex={lessonIndex}
                    lessonIndex={lesson.index}
                    title={lesson.title}
                    enrollmentData={enrollmentData}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
