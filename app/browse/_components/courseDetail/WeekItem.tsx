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
  filter,
  completedLessons,
  totalLessons,
}: {
  moduleInfo: any;
  userProgress: any;
  courseId: number;
  filter: string;
  completedLessons: number;
  totalLessons: number;
}) {
  const [showWeek, setShowWeek] = useState(false);

  const toggleWeek = () => {
    setShowWeek(!showWeek);
  };

  return (
    <div className="group relative w-[48vw]   transition-all duration-500   ">
      <div
        className="cursor-pointer bg-slate-200 mb-5 p-5 rounded-2xl"
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
          {moduleInfo.title}
        </strong>
        <ul className="flex mt-2  text-sm">
          <li className="pr-3">Week 1</li>
          <li className="pr-3">3 hours to complete</li>
          <li className="pr-3">4 lessons</li>
        </ul>
        <p className="mt-2 mr-4 text-sm ">
          {moduleInfo.description}
        </p>

        {completedLessons > 0 && (
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
          {moduleInfo.lesson.map(
            (lesson:any, index:any) => (
              <LessonItem
                key={lesson.lesson_id}
                userProgress={userProgress.lesson[index]}
                lesson={lesson}
                courseId={courseId}
                filter={filter}
              />
            )
            // ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
