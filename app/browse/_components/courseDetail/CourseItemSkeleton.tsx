import React from 'react'

export default function CourseItemSkeleton() {
    return (
        <div>{   Array.from({ length: 5 }).fill(null).map((_, index) => (
            <div key={index} className="p-4 rounded-2xl shadow-2xl w-[48vw]  animate-pulse my-4 ">
              <div className="h-5 bg-gray-300 rounded-full mb-3 w-3/5 "></div>
              <div className="h-3 bg-gray-300 rounded-full my-6  w-2/5  "></div>
              <div className="h-3 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded-full mb-2"></div>
            </div>
          ))}</div>
      );
    };