import React from "react";
import Image from "next/image";

export default function LessonInfo({ title }: { title: any }) {
  return (
    <div className="items-center h-fit flex flex-col font-semibold text-blue-600 text-lg text-center mt-2 overflow-hidden">
      <h1>{title}</h1>
    </div>
  );
}
