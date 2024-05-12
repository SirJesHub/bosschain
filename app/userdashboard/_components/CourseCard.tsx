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
    <div className="group relative h-full">
      <div className="cursor-pointer transition duration shadow-xl rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 flex flex-col h-full">
        <div className="h-4/6 rounded-md bg-slate-300 relative overflow-hidden">
          {cover_image && (
            <Image
              src={cover_image}
              alt="course image"
              // width={400}
              // height={400}
              layout="fill"
              objectFit="cover"

              // className="object-cover"
            />
          )}

          {!cover_image && (
            <Image
              src={"/YouTube-Thumbnail-Dimensions.webp"}
              alt="course image"
              // width={400}
              // height={400}
              layout="fill"
              objectFit="cover"
              // className="object-cover"
            />
          )}
        </div>
        <div className="p-2 flex flex-col flex-grow ">
          <div className="my-1">
            <Progressbar
              completedLessonCount={completedLessons}
              totalLessonCount={totalLessons}
            />
          </div>
          <div>
            <h2 className="font-bold">{title}</h2>
            {/* <h3 className="font-md">{category}</h3> */}
          </div>
        </div>

        {/* <p>
    <Highlight attribute="desc" hit={hit} />
  </p> */}
      </div>

      <div className="group opacity-0 absolute top-0 trasition duration-200 z-10 invisible sm:visible delay-300 w-full scale-0 group-hover:scale-110 group-hover:opacity-100">
        {cover_image && (
          <div className="">
            <Image
              className="cursor-pointer object-cover transition duration shadow-xl rounded-t-md w-full"
              src={cover_image}
              alt="course image"
              width={400}
              height={400}
            />
          </div>
        )}
        {!cover_image && (
          <Image
            className="cursor-pointer object-cover transition duration shadow-xl rounded-t-md w-full"
            src={"/YouTube-Thumbnail-Dimensions.webp"}
            alt="course image"
            width={400}
            height={400}
          />
        )}

        <div className="p-2 flex flex-col flex-grow h-2/6 justify-between  bg-white shadow-2xl rounded-md">
          <div className="my-1">
            <Progressbar
              completedLessonCount={completedLessons}
              totalLessonCount={totalLessons}
            />
          </div>
          <div>
            <h2 className="font-bold">{title}</h2>
            <h3 className="text-sm font-semibold my-1">• {category}</h3>
            <p className="text-sm m-1">{description}</p>
          </div>
          <div className="my-3">
            <Link
              href={`/browse/${course_id}`}
              className=" bg-gradient-to-br hover:scale-105 from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-800 hover:shadow-2xl transition-all duration-500 text-white font-semibold px-8 py-2 rounded-full"
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
