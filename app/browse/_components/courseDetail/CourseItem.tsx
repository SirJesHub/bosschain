"use client";
import { useEffect } from "react";
import WeekItem from "./WeekItem";
import { MouseEventHandler } from "react";

type weekInfoProps = {
  weekNumber: number;
  weekTitle: string;
  lessons: LessonInfoProps[];
};

type LessonInfoProps = {
  lessonNumber: number;
  lessonTitle: string;
  description: string;
};

export default function CourseItem({
  courseInfo,
  progress,
  courseId,
  filter,
  enrollment,
  enrollmentHandler,
}: {
  courseInfo: any;
  progress?: any;
  courseId: number;
  filter: string;
  enrollment: any;
  enrollmentHandler: MouseEventHandler<HTMLButtonElement>;
}) {
  function calculateLessonProgress(module: any, index: number) {
    const completedLessons = progress[index].lesson.filter(
      (lesson: any) => lesson.lesson_progress[0].completed === true,
    ).length;
    const totalLessons = progress[index].lesson.length;
    return { completedLessons, totalLessons };
  }

  function shouldRenderWeekItem(
    filter: string,
    completedLessons: number,
    totalLessons: number,
  ) {
    switch (filter) {
      case "completed":
        return completedLessons === totalLessons;
      case "not-started":
        return completedLessons === 0;
      case "in-progress":
        return completedLessons > 0 && completedLessons < totalLessons;
      case "all":
      default:
        return true;
    }
  }

  const Item = () => {
    if (enrollment) {
      const renderedModules = courseInfo.map((module: any, index: number) => {
        const { completedLessons, totalLessons } = calculateLessonProgress(
          module,
          index,
        );
        return shouldRenderWeekItem(filter, completedLessons, totalLessons) ? (
          <WeekItem
            key={module.index}
            moduleInfo={module}
            courseId={courseId}
            userProgress={enrollment ? progress[index] : undefined}
            completedLessons={enrollment ? completedLessons : undefined}
            totalLessons={enrollment ? totalLessons : undefined}
            enrollment={enrollment}
          />
        ) : (
          false
        );
      });
      const allFalse = renderedModules.every(
        (element: any) => element === false,
      );
      if (allFalse) {
        return (
          <div className=" m-auto flex flex-col items-center justify-start bg-gray-100 rounded-xl h-screen">
            <h1 className="font-medium text-xl m-10">Are you a quitter?! 😲</h1>
            <p className="text-center m-5 ">
              You have not completed any courses yet so there are none listed
              here. Complete what you start! A quitter never wins and a winner
              never quits. 💪 For now, please choose a different filter.
            </p>
          </div>
        );
      } else {
        return renderedModules;
      }
    } else {
      if (filter === "all") {
        const renderedModules = courseInfo.map((module: any, index: number) => {
          return (
            <WeekItem
              key={module.index}
              moduleInfo={module}
              courseId={courseId}
              userProgress={enrollment ? progress[index] : undefined}
              enrollment={enrollment}
            />
          );
        });
        return renderedModules;
      } else {
        return (
          <div className=" h-96 m-auto flex flex-col items-center justify-center">
            <h1 className="  font-medium text-xl">
              Enroll to unlock progress tracking
            </h1>
            <button
              onClick={enrollmentHandler}
              className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition-all duration-300 "
            >
              Unlock Tracking, Enroll
            </button>
          </div>
        );
      }
    }
  };

  return (
    <div>
      <ul>{Item()}</ul>
    </div>
  );
}
