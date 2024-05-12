import React from "react";

export default function CourseSidebarSkeleton() {
  return (
    <div>
      {Array.from({ length: 6 })
        .fill(null)
        .map((_, index) => (
          <div className="p-4 mb-4 bg-slate-100 rounded-2xl mr-4  animate-pulse ">
            <div className="h-4 bg-gray-300 rounded-full mb-3 w-4/5 "></div>
            <div className="h-4 bg-gray-300 rounded-full mb-3 w-4/5 "></div>
            <div className="h-3 bg-gray-300 rounded-full mb-3  w-2/5  "></div>
          </div>
        ))}
    </div>
    // Use Array.from with fill(null) to create an array of length 5
  );
}
