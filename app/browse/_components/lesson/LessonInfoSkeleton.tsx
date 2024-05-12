import React from "react";

export default function LessonInfoSkeleton() {
  return (
    <div className="flex flex-col justify-between h-full pb-3">
      <div className="flex flex-row">
        <div className="mt-4 mr-3 bg-gray-300 h-10 w-10  rounded-full   animate-pulse "></div>
        <div className="flex flex-col">
          <div className="mt-4 mb-2 bg-gray-300 h-5 w-56 rounded-full  animate-pulse "></div>
          <div className=" bg-gray-300 h-3 w-20 rounded-full  animate-pulse "></div>
        </div>
      </div>
      <div className=" bg-gray-300 h-3 w-full rounded-full  animate-pulse "></div>
    </div>
  );
}
