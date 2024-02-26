import React, { useEffect, useState} from 'react'

export default function WeekProgressbar({totalLessons, completedLessons}:{totalLessons:any, completedLessons: any}) {

  
console.log(totalLessons)
const progress = completedLessons/totalLessons*100
console.log(progress)

  return (
    <div className="mt-5">
        <div className='flex justify-between text-sm'>
        <p>{`${(completedLessons / totalLessons) * 100}% completed `}</p>
        <p>{`${completedLessons}/${totalLessons} lessons`}</p>
        </div>
      
    <div className="h-2 rounded-full bg-gray-200">
      <div className={`bg-orange-500 h-full  rounded-full`} style={{width: `${progress}%`}} >

      </div>
    </div>
  </div>
  )
}
