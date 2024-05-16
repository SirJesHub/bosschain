import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CourseService } from "@/lib/supabase/courseRequests";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import Progressbar from "./Progressbar";

type courseProps = {
  title: string;
  category: string;
  description: string;
  cover_image: string;
  course_id: number;
  enrollment_id: number;
};

export default function CourseCard({
  category,
  description,
  cover_image,
  title,
  course_id,
  enrollment_id,
}: courseProps) {
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<number>(0);
  const [totalLessons, setTotalLessons] = useState<number>(0);
  const [queryParam, setQueryParam] = useState<string>(
    `?timestamp=${new Date().getTime()}`,
  ); // temporary hack to trigger reload image

  useEffect(() => {
    const initializePage = async () => {
      const token = await getToken({ template: "supabase" });
      setToken(token || "");
      const userAuth = { userId: userId, token: token };
      const courseProgress = await CourseService.getProgress(
        userAuth,
        course_id,
        enrollment_id,
      );

      if (courseProgress.data) {
        let completedLessons = 0;
        let totalLessons = 0;

        courseProgress.data.map((module: any) => {
          module.lesson.map((lesson: any) => {
            if (lesson.lesson_progress[0].completed) {
              completedLessons += 1;
            }
            totalLessons += 1;
          });
        });
        setCompletedLessons(completedLessons);
        setTotalLessons(totalLessons);
      }
      // console.log("course progress:" , courseProgress)
    };
    initializePage();
  }, []);

  return (
    <div className="group relative h-[350px] bg-white rounded-lg">
      <div className="cursor-pointer transition duration shadow-xl -z-10 rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 flex flex-col h-full">
        <div className=" h-4/6 rounded-md bg-slate-200 relative overflow-hidden">
          <img
            className="absolute inset-0 object-cover w-full h-full shadow-xl"
            src={
              process.env.NEXT_PUBLIC_COURSE_ASSETS_BASE_URL +
              "" +
              course_id +
              "/course/cover" +
              queryParam
            }
            alt="course image"
          />
        </div>
        <div className="p-2 flex flex-col flex-grow ">
          <div className="my-1">
            <Progressbar
              completedLessonCount={completedLessons}
              totalLessonCount={totalLessons}
            />
          </div>
          <div>
            <h2 className="font-bold line-clamp-1">{title}</h2>
            <h3 className="text-sm font-semibold my-1 line-clamp-1">
              • {category}
            </h3>
          </div>
        </div>

        {/* <p>
    <Highlight attribute="desc" hit={hit} />
  </p> */}
      </div>

      <div className="group opacity-0 absolute top-0 trasition duration-200 z-20 invisible sm:visible delay-300 w-full scale-0 group-hover:scale-110 group-hover:opacity-100 h-[450px]">
        <img
          className="cursor-pointer object-cover transition duration-300 shadow-xl rounded-t-md w-full h-1/2 bg-slate-200"
          src={
            process.env.NEXT_PUBLIC_COURSE_ASSETS_BASE_URL +
            "" +
            course_id +
            "/course/cover" +
            queryParam
          }
          alt="course image"
        />

        <div className="p-2 flex flex-col  h-1/2 justify-between  bg-white shadow-2xl rounded-b-md ">
          <div className="my-1">
            <Progressbar
              completedLessonCount={completedLessons}
              totalLessonCount={totalLessons}
            />
            <h2 className="font-bold line-clamp-2">{title}</h2>
            <h3 className="text-sm font-semibold my-1 line-clamp-2">
              • {category}
            </h3>
            <p className="text-sm m-1 line-clamp-4">{description}</p>
          </div>

          <div className="my-3">
            <Link
              href={`/browse/${course_id}`}
              className=" bg-gradient-to-br hover:scale-105 from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-800 hover:shadow-2xl transition-all duration-500 text-white font-semibold px-4 py-3 rounded-full"
            >
              Start Learning
            </Link>
          </div>
        </div>

        {/* <div className="z-10 lg:p-2 absolute w-full transition shadow-md rounded-b-md text-slate-100       p-2 flex flex-col flex-grow h-2/6 justify-between">
          <h3 className="text-base font-black m-1">{title}</h3>
          <p className="text-sm m-1">{description}</p>
          <ul className="text-xs flex m-1 text-"></ul>
        
        </div> */}
      </div>
    </div>
  );
}
