import React, { useEffect, useState} from 'react'

export default function WeekProgressbar({totalLessons, completedLessons}:{totalLessons:any, completedLessons: any}) {

const progress = completedLessons/totalLessons*100

  return (
    <div className="mt-5">
        <div className='flex justify-between text-sm mb-2'>
        <p>{`${(completedLessons / totalLessons) * 100}% completed `}</p>
        <p>{`${completedLessons}/${totalLessons} lessons`}</p>
        </div>
      
    <div className="h-2 rounded-full bg-white">
      <div className={`bg-blue-500 h-full  rounded-full`} style={{width: `${progress}%`}} >

      </div>
    </div>
  </div>
  )
}
