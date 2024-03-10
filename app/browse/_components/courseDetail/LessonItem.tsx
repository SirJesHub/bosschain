"use client";
import { useRouter } from "next/navigation";

export default function LessonItem({
  lesson,
  courseId,
  filter,
  userProgress,
}: {
  lesson: any;
  courseId: number;
  filter: any;
  userProgress: any;
}) {
  const router = useRouter();

  return (
    <div className="bg-blue-100  mx-auto mb-5 p-8 rounded-2xl">
      <h2 className="text-lg font-medium mb-4">
        Lesson {lesson.index}: {lesson.title}
      </h2>
      <h3 className="text-sm">Discription: {lesson.description}</h3>
      <p></p>
      <button
        onClick={() =>
          router.push(`/browse/${courseId}/${lesson.module_id}/${lesson.index}`)
        }
        className="p-1 pl-2 pr-2 mt-3 rounded-3xl bg-white border-2 border-blue-400 hover:bg-blue-400 transition-all duration-800 focus:outline-none focus:ring focus:ring-blue-300"
      >
        {userProgress.status==="not-started"?"start learning":"completed"}
      </button>
    </div>
  );
}
