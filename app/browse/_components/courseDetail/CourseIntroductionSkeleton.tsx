import React from 'react'

export default function CourseIntroductionSkeleton() {
    return (
        <div className="mx-44 flex flex-col justify-around animate-pulse">
      
            <div className="w-[50vw] mx-5 mt-8 mb-3 transition-all duration-1000 h-8 bg-gray-300 rounded-full"></div>
            <div className="w-[20vw]  mx-5 mb-10 transition-all duration-1000 h-8 bg-gray-300 rounded-full"></div>
             
            <div className='w-[50vw] mx-5 my-1 transition-all duration-1000 h-3 bg-gray-300 rounded-full'></div>
            <div className='w-[50vw] mx-5 my-1 transition-all duration-1000 h-3 bg-gray-300 rounded-full'></div>
            <div className='w-[50vw] mx-5 my-1 transition-all duration-1000 h-3 bg-gray-300 rounded-full'></div>
            <div className='w-[50vw] mx-5 my-1 transition-all duration-1000 h-3 bg-gray-300 rounded-full'></div>

            <div className=' mx-5 w-40 my-1 transition-all duration-1000 h-10 bg-gray-300 rounded-full mt-5'></div>
          
            
             
            
     

          <div className="m-5 "></div>
        </div>
   
      );
    };