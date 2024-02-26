"use client";
import { useRouter } from "next/navigation";
import { userLearningData } from "../../_components/mockData/userLearningData";
import { courseInformation } from "../../_components/mockData/courseInformation";
import { useState } from "react";
import CourseSidebar from "../../_components/lesson/CourseSidebar";
import Content from "../../_components/lesson/Content";
import TextEditor from "../../_components/lesson/TextEditor";
import Image from "next/image";
import NextVideo from "next-video";
import Wildlife_Sample from "../../../../videos/Wildlife_Sample.mp4.json";
import Link from "next/link";
import Progressbar from "../../_components/lesson/Progressbar";

export default function LessonPage({
  params: { lessonId, courseId },
}: {
  params: { lessonId: number; courseId: number };
}) {
  const router = useRouter();
  const [nextLessonId, setNextLessonId] = useState<number>();
  const [completedLessonCount, setCompletedLessonCount] = useState<number>();
  const [totalLessonCount, setTotalLessonCount] = useState<number>();
  const lessonType = false;

  const lessonCompletionHandler = () => {
    // set current learning progress to completed
    userLearningData.progress[0].lessons[0].status = "completed";
    //navigate to the next lesson
    router.push(`/browse/${courseId}/${nextLessonId}`);
  };
  
  const nextLessonIdHandler = (
    nextlessonId: number,
    completedLessonCount: number,
    totalLessonCount: number
  ) => {
    setNextLessonId(nextlessonId);
    setCompletedLessonCount(completedLessonCount);
    setTotalLessonCount(totalLessonCount);
  };

  // Initialize lesson visibility state
  // const initialLessonVisibility = courseInformation.weeks.reduce((acc:any, week:any) => {
  //   acc[week.weekNumber] = false;
  //   return acc;
  // }, {});

  // const [lessonVisibility, setLessonVisibility] = useState(
  //   initialLessonVisibility
  // );

  // const toggleLesson = (weekNumber:any) => {
  //   setLessonVisibility((prevState:any) => ({
  //     ...prevState,
  //     [weekNumber]:!prevState[weekNumber]

  //   }));
  // };

  // console.log(lessonVisibility, "from page.tsx")

  return (
    <div className="grid grid-cols-12 grid-rows-5 h-screen gap-2 ">
      <div className=" col-span-9 row-span-5 overflow-auto px-4  mt-4">
        {!lessonType && (
          <div className="flex flex-col items-end ">
            <TextEditor />
            {nextLessonId != null && (
              <button
                className="p-1 pl-2 pr-2 my-5 h-10 rounded-3xl bg-blue-500 w-48"
                onClick={lessonCompletionHandler}
              >
                Mark lesson complete
              </button>
            )}
          </div>
        )}

        <div className="w-75% overflow-hidden">
          {lessonType && (
            <NextVideo src={Wildlife_Sample} accentColor="#539FFF" />
          )}
        </div>
      </div>

      <div className="col-span-3 row-span-1 bg-gray-100  rounded-xl mr-4 mt-4 pl-3 pr-3 flex flex-col justify-between">
        <div className="flex items-center mt-2">
          <Image
            src={"/longtunman.jpeg"}
            alt="course image"
            width={20}
            height={20}
            className="h-8 w-auto rounded-full mr-3 "
          />
          <div className="flex-row">
            <h1 className="">Siraprop Jesdapiban</h1>
            <h3 className="text-xs">12/03/2024</h3>
          </div>
        </div>
        <Progressbar
          completedLessonCount={completedLessonCount}
          totalLessonCount={totalLessonCount}
        />
      </div>

      <div className="col-span-3 row-span-4 overflow-auto mb-2 ">
        <CourseSidebar
          courseId={courseId}
          lessonId={lessonId}
          nextLessonIdHandler={nextLessonIdHandler}
        />
      </div>
    </div>
  );
}
