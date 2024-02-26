import React, { useEffect, useState} from 'react'

export default function Progressbar(totalLessonCount: any, completedLessonCount: any) {

  
console.log(totalLessonCount.totalLessonCount)
const progress = totalLessonCount.completedLessonCount/totalLessonCount.totalLessonCount*100
console.log(progress)

  return (
    <div className="h-8 flex justify-between items-center">
    <div className="h-3 rounded-full bg-gray-200 w-4/5 ">
      <div className={`bg-orange-500 h-full  rounded-full`} style={{width: `${progress}%`}} >
      </div>
    </div>
    <p className='text-xs'>{`${progress}%`}</p>
  </div>
  )
}
