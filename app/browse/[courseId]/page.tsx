"use client";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { userLearningData } from "../_components/mockData/userLearningData";

import CourseItem from "../_components/courseDetail/CourseItem";
import SimilarCourse from "../_components/algolia/SimilarCourse";
import Card from "../_components/algolia/Card";
import ButtonFilter from "../_components/courseDetail/ButtonFilter";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { courseInformation } from "../_components/mockData/courseInformation";
import { useRouter } from "next/navigation";
import FAQ from "../_components/FAQ";
import CourseItemSkeleton from "../_components/courseDetail/CourseItemSkeleton";
import CourseIntroductionSkeleton from "../_components/courseDetail/CourseIntroductionSkeleton";
import { SupabaseResponse } from "@/models/requestModels";
import {
  createCourse,
  getCourse,
  getFullCourse,
  getFullCurrentCourse,
} from "@/lib/supabase/courseRequests";
import { Database } from "@/types/supabase";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";

type courseDataProps = {
  name: string;
  desc: string;
  price: number;
  objectID: string;
  category: string;
  image: string | null;
  created_at: string;
};

type userDataProps = {
  username: string;
  progress: [];
};

type progressProps = {
  weekNumber: number;
  lesson: [lesson: number, status: "completed" | "not-started"];
};

const getUserProgress = () => {
  return userLearningData.progress;
};

export default function CourseDetailPage({
  params: { courseId },
}: {
  params: { courseId: number };
}) {
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<any>();
  const [userProgress, setUserProgress] = useState<any>();
  const [completionFilter, setCompletionFilter] = useState("all");
  const [course, setCourse] =
    useState<
      SupabaseResponse<
        Array<Database["public"]["Tables"]["course"]["Row"] | null>
      >
    >();
  const {isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";

  const router = useRouter();

  useEffect(() => {
    const initializePage = async () => {
      //getCourse data
      try {
        const token = await getToken({ template: "supabase" });
        const userAuth = { userId: userId, token: token };
        console.log(userAuth, courseId);
        const response = await getFullCurrentCourse(userAuth, courseId);
        console.log("full current course data", response);

        if (response.data) {
          setCourseData(response.data);
          console.log("courseData has been updated with:", response.data);
        } else {
          console.log("No course data found in the response");
        }
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
      }
      //get user progress
      try {
        const userProgress = getUserProgress();
        setUserProgress(userProgress);
        console.log("user progress",userProgress)
        console.log("current courseData: ", courseData);
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
      }
      setLoading(false);
    };
    initializePage();
  }, [courseId]);

  function completionfilterHandler(value: string) {
    setCompletionFilter(value);
  }

  return (
    <div className="">
      <div className="bg-blue-500 min-h-[280px] text-white font-medium flex flex-col mb-5">
        <div className="mx-44 flex flex-col justify-around">
          {!loading && (
            <>
              <h1 className="w-[50vw] m-5 mt-8 transition-all duration-1000 text-3xl">
                {courseData.title}
              </h1>
              <h1 className="w-[50vw] m-5 transition-all duration-1000 text">
                {courseData.description}
              </h1>
              <div className="m-5">
                <Card objectId={courseId} />
              </div>
            </>
          )}
        </div>

        {loading && <CourseIntroductionSkeleton />}
      </div>

      <div className="ml-48 w-[48vw] min-h-[220px]">
        <button
          onClick={() => router.push("/browse")}
          className="cursor-pointer flex text-sm items-center"
        >
          <ChevronLeft />
          <h2 className="">Back to Browse </h2>
        </button>
        <hr className="w-[48vw] my-2 "></hr>

        <ButtonFilter filterHandler={completionfilterHandler} />

        {loading && <CourseItemSkeleton />}
        {!loading && (
          <CourseItem
            courseInfo={courseData.module}
            userProgress={userProgress}
            courseId={courseId}
            filter={completionFilter}
          />
        )}
        {/* <SimilarCourse objectId={data[0].objectID} /> */}
      </div>
    </div>
  );
}
