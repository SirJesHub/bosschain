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

export default function FullDescriptionCourseCard({
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
    <div className="h-full  bg-gray-50 rounded-lg overflow-hidden hover:opacity-90 hover:shadow-sm">
      <Link href={`/browse/${course_id}`}>
        <div className="bg-slate-200 overflow-hidden h-3/6 relative">
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

        <div className="p-2 h-3/6 relative ">
          <div className="my-1">
            <Progressbar
              completedLessonCount={completedLessons}
              totalLessonCount={totalLessons}
            />
          </div>
          <div>
            <h2 className="font-bold line-clamp-1 mb-2">{title}</h2>

            <h3 className="text-sm font-semibold my-1 line-clamp-1 mb-2">
              • {category}
            </h3>
            <p className="text-sm m-1 line-clamp-3">{description}</p>
          </div>
          {/* <div className="my-3  absolute bottom-2 right-4 line">
            <Link
              href={`/browse`}
              className=" bg-gradient-to-br  from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-800 hover:shadow-2xl transition-all duration-1000 text-white font-semibold px-6 py-3 rounded-full"
            >
              Learn
            </Link>
          </div> */}
        </div>
      </Link>
    </div>
  );
}
