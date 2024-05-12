"use client";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDownCircle,
  ChevronUpCircle,
  ChevronUpCircleIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import LessonItem from "./LessonItem";
import WeekProgressbar from "./WeekProgressbar";

type LessonInfoProps = {
  lessonNumber: number;
  lessonTitle: string;
  description: string;
};

type weekInfoProps = {
  weekNumber: number;
  weekTitle: string;
  lessons: LessonInfoProps[];
};

export default function WeekItem({
  moduleInfo,
  userProgress,
  courseId,
  completedLessons,
  totalLessons,
  enrollment,
}: {
  moduleInfo: any;
  enrollment: any;
  courseId: number;
  userProgress?: any;
  completedLessons?: number;
  totalLessons?: number;
}) {
  const [showWeek, setShowWeek] = useState(false);

  const toggleWeek = () => {
    setShowWeek(!showWeek);
  };

  return (
    <div className="group relative w-full transition-all duration-500">
      <div
        className="cursor-pointer bg-slate-200 mb-5 p-5 rounded-md"
        onClick={toggleWeek}
      >
        <button onClick={toggleWeek}>
          {showWeek ? (
            <ChevronUp
              size={30}
              className="absolute right-7 top-5 font-2xl hover:cursor-pointer "
            />
          ) : (
            <ChevronDown
              size={30}
              className="absolute right-7 top-5 font-2xl hover:cursor-pointer "
            />
          )}
        </button>
        <strong className=" font-extrabold text-lg">
          {`Module ${moduleInfo.index + 1} : ${moduleInfo.title}`}
        </strong>
        <ul className="flex mt-2  text-sm"></ul>
        <p className="mt-2 mr-4 text-sm ">{`${moduleInfo.description}`}</p>

        {enrollment && (
          <WeekProgressbar
            completedLessons={completedLessons}
            totalLessons={totalLessons}
          />
        )}
      </div>

      <div
        className={`grid overflow-hidden transition-all duration-500 ease-in-out text-slate-600 text-sm ${
          showWeek
            ? "grid-rows-[1fr] opacity-100"
            : " grid-rows-[0fr] opacity-0"
        }
   `}
      >
        <div className="overflow-hidden">
          {enrollment &&
            moduleInfo.lesson.map(
              (lesson: any, index: any) => (
                <LessonItem
                  key={lesson.lesson_id}
                  userProgress={
                    userProgress.lesson[index].lesson_progress[0].completed
                  }
                  lesson={lesson}
                  courseId={courseId}
                />
              ),
              // ) : null,
            )}

          {!enrollment &&
            moduleInfo.lesson.map(
              (lesson: any, index: any) => (
                <LessonItem
                  key={lesson.lesson_id}
                  lesson={lesson}
                  courseId={courseId}
                />
              ),

              // ) : null,
            )}
        </div>
      </div>
    </div>
  );
}
