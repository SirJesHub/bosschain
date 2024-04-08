"use client";
import { useRouter } from "next/navigation";

export default function LessonItem({
  lesson,
  courseId,
  userProgress,
}: {
  lesson: any;
  courseId: number;
  userProgress?: any;
}) {
  const router = useRouter();

  return (
    <div className="bg-blue-100  mx-auto mb-5 p-5  rounded-lg border-2 border-blue-300 text-black flex flex-col ">
      <h2 className="font-semibold mb-3 text-base">
        Lesson {lesson.index+1}: {lesson.title}
      </h2>
      <h3 className="text-sm">{lesson.description}</h3>
      <p></p>
      <button
        onClick={() =>
          router.push(`/courses/${courseId}/modules/${lesson.module_id}/lessons/${lesson.index}`)
        }
        className={`p-3 pl-5 pr-5 mt-3 rounded-lg shadow-xl hover:shadow-2xl ${userProgress ? "bg-blue-500 hover:bg-blue-700": "bg-blue-500 hover:bg-blue-700"}   transition-all duration-800 text-white font-semibold self-end mr-5`}
      >
        {userProgress ? "Completed" : "Start Learning"}
      </button>
    </div>
  );
}
