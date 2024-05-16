import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckSquare2, Square, ChevronDown, ChevronUp } from "lucide-react";
import ModuleItem from "./course-side-bar-module-item";

export default function courseSidebar({
  courseData,
  courseId,
  userProgress,
  lessonIndex,
  lessonProgress,
  moduleId,
  enrollmentData,
  lessonLengths,
  currentModuleId,
}: {
  courseData: any;
  courseId: number;
  userProgress?: any;
  lessonIndex: number;
  lessonProgress?: any;
  moduleId: number;
  enrollmentData: any;
  lessonLengths: any;
  currentModuleId: number;
}) {
  const [lessonVisibility, setLessonVisibility] = useState();

  useEffect(() => {
    console.log("courseData from csb:", courseData);
    console.log("userProgress from csb:", userProgress);
    console.log("lesssonProgress from csb:", lessonProgress);
    const initialLessonVisibility = courseData.reduce(
      (acc: any, module: any) => {
        acc[module.module_id] = module.module_id === currentModuleId;
        return acc;
      },
      {},
    );
    console.log("43", initialLessonVisibility);
    setLessonVisibility(initialLessonVisibility);
  }, []);

  useEffect(() => {
    const nextLessonHandler = () => {
      setLessonVisibility((prevState: any) => ({
        ...prevState,
        [moduleId]: true,
      }));
    };
    nextLessonHandler();
  }, [lessonIndex]);

  const toggleLesson = (weekNumber: any) => {
    setLessonVisibility((prevState: any) => ({
      ...prevState,
      [weekNumber]: !prevState[weekNumber],
    }));
  };

  return (
    <div className=" border-gray-200 rounded-md w-full">
      {lessonVisibility &&
        courseData.map((module: any, index: any) => {
          if (enrollmentData) {
            const weeklyProgress = userProgress[index];

            return (
              <div>
                <div>
                  <ModuleItem
                    toggleLesson={toggleLesson}
                    lessonVisibility={lessonVisibility[module.module_id]}
                    index={module.index}
                    title={module.title}
                    module_id={module.module_id}
                    lesson={module.lesson}
                    courseId={courseId}
                    lessonIndex={lessonIndex}
                    moduleId={moduleId}
                    enrollmentData={enrollmentData}
                    weeklyProgress={weeklyProgress}
                    completedLessonCount={lessonProgress[index].completedLesson}
                    totalLessonCount={lessonLengths[index].lesson_length}
                    currentModuleId={currentModuleId}
                  />
                </div>
              </div>
            );
          } else {
            return (
              <div>
                <div>
                  <ModuleItem
                    toggleLesson={toggleLesson}
                    lessonVisibility={lessonVisibility[module.module_id]}
                    index={module.index}
                    title={module.title}
                    module_id={module.module_id}
                    lesson={module.lesson}
                    courseId={courseId}
                    lessonIndex={lessonIndex}
                    moduleId={moduleId}
                    totalLessonCount={lessonLengths[index].lesson_length}
                    enrollmentData={enrollmentData}
                    currentModuleId={currentModuleId}
                  />
                </div>
              </div>
            );
          }
        })}
    </div>
  );
}
