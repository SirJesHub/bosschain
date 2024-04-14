import React from 'react'
import Link from 'next/link'

export default function NextLessonButton({courseId, nextModuleId, nextLessonIndex}:{courseId:number, nextModuleId:number, nextLessonIndex:number}) {
  return (
    <Link
    href={`/courses/${courseId}/modules/${nextModuleId}/lessons/${nextLessonIndex}`}
  >
    <button
      className="p-1 pl-2 pr-2 my-5 h-10 rounded-lg bg-blue-500 w-48 text-white font-normal"
    >
      Next Lesson
    </button>
  </Link>
  )
}
