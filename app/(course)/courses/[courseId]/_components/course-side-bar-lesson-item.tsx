import React from "react";
import Link from "next/link";
import { CheckSquare2, Square, BookmarkCheck, Bookmark } from "lucide-react";

export default function CourseSidebarLessonItem({
  courseId,
  module_id,
  lessonProgress,
  title,
  currentLessonIndex,
  lessonIndex,
  enrollmentData,
  currentModuleId,
}: {
  courseId: number;
  module_id: number;
  lessonProgress?: string;
  title: string;
  currentLessonIndex: number | undefined;
  lessonIndex: number;
  enrollmentData: any;
  currentModuleId: number;
}) {
  return (
    <div>
      <Link
        href={`/courses/${courseId}/modules/${module_id}/lessons/${lessonIndex}`}
      >
        <div
          className={`w-full text-xs flex flex-wrap items-center p-3 border-t-2 border-white transition-colors ${
            currentLessonIndex == lessonIndex && currentModuleId == module_id
              ? "bg-blue-500 text-white font-bold"
              : "bg-gray-200 hover:bg-blue-300"
          }`}
          key={lessonIndex}
        >
          {lessonProgress ? <BookmarkCheck /> : <Bookmark />}
          <p className="ml-2">{`${lessonIndex + 1} . ${title}`}</p>
        </div>
      </Link>
    </div>
  );
}
