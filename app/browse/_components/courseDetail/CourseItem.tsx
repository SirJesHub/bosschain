"use client";
import WeekItem from "./WeekItem";


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

type userProgressProps = {};

export default function CourseItem({
  courseInfo,
  userProgress,
  courseId,
  filter,
}: {
  courseInfo: any;
  userProgress: any;
  courseId: number;
  filter: string;
}) {
  return (
    <div >
      <ul>
        {courseInfo.weeks.map((week: weekInfoProps, index: any) => {
          const completedLessons = userProgress[
            week.weekNumber - 1
          ].lessons.filter(
            (lesson: any) => lesson.status === "completed"
          ).length;
          const totalLessons = userProgress[week.weekNumber - 1].lessons.length;
          return filter === "all" ||
            (filter === "completed" && completedLessons === totalLessons) ||
            (filter === "not-started" && completedLessons === 0) ||
            (filter === "in-progress" &&
              completedLessons > 0 &&
              completedLessons < totalLessons) ? (
            <WeekItem
              key={week.weekNumber}
              weekInfo={week}
              userProgress={userProgress[index]}
              courseId={courseId}
              filter={filter}
              completedLessons={completedLessons}
              totalLessons={totalLessons}
            />
            
          ) : null;
        })}
      </ul>
    </div>
  );
}


  /* {courseInfo.weeks.map((week: weekInfoProps, index:any) =>
          filter === "all" ||
          (filter === "completed" &&
            userProgress[week.weekNumber - 1].lessons.every(
              (lesson: any) => lesson.status === "completed"
            )) ||
          (filter === "not-started" &&
            userProgress[week.weekNumber - 1].lessons.every(
              (lesson: any) => lesson.status === "not-started"
            )) ||
          (filter === "in-progress" &&
            userProgress[week.weekNumber - 1].lessons.some(
              (lesson: any) => lesson.status === "not-started"
            ) &&
            userProgress[week.weekNumber - 1].lessons.some(
              (lesson: any) => lesson.status === "completed"
            )) ? (
            <WeekItem
              
              key={week.weekNumber}
              weekInfo={week}
              userProgress={userProgress[index]}
              courseId={courseId}
              filter={filter}
            />
          ) : null
        )} */

