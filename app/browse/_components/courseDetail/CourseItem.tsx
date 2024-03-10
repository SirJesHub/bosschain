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
        {courseInfo.map((module: any, index: any) => {
          const completedLessons = userProgress[
            module.index
          ].lesson.filter(
            (lesson: any) => lesson.status === "completed"
          ).length;
          const totalLessons = userProgress[module.index].lesson.length;
          return filter === "all" ||
            (filter === "completed" && completedLessons === totalLessons) ||
            (filter === "not-started" && completedLessons === 0) ||
            (filter === "in-progress" &&
              completedLessons > 0 &&
              completedLessons < totalLessons) ? (
            <WeekItem
              key={module.index}
              moduleInfo={module}
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
