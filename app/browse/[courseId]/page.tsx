"use client";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { userLearningData } from "../_components/mockData/userLearningData";

import CourseItem from "../_components/courseDetail/CourseItem";
import SimilarCourse from "../_components/algolia/SimilarCourse";
import Card from "../_components/algolia/Card";
import ButtonFilter from "../_components/courseDetail/ButtonFilter";
import { ArrowLeft } from "lucide-react";
import { courseInformation } from "../_components/mockData/courseInformation";
import { useRouter } from "next/navigation";
import FAQ from "../_components/FAQ";
import CourseItemSkeleton from "../_components/courseDetail/CourseItemSkeleton";

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
  const [userProgress, setUserProgress] = useState(getUserProgress);
  const [completionFilter, setCompletionFilter] = useState("all");

  const router = useRouter();

  useEffect(() => {
    setUserProgress(getUserProgress());
    console.log("set user progress ran");
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  // const supabase = createClient(
  //   "https://zfsiwcwdijacmwuwwoyv.supabase.co",
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmc2l3Y3dkaWphY213dXd3b3l2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNTU4NDM4NSwiZXhwIjoyMDIxMTYwMzg1fQ.CopvlTWZl6gILB0U3lkEuGC-CyxQaY9VaYD4ANeFE9o"
  // );

  // const { data, error } = await supabase
  //   .from("e_product")
  //   .select()
  //   .eq("objectID", courseId);

  // if (error) {
  //   console.log("Supabase error:", error.message);
  //   return {
  //     notFound: true,
  //   };
  // }

  function completionfilterHandler(value: string) {
    setCompletionFilter(value);
  }

  return (
    <div className="">
      <br></br>
      {/* <h2>{data[0].name}</h2>
      <h3>{data[0].desc}</h3>
      <br></br> */}

      <div className="bg-blue-400 h-[280px] text-white font-medium flex flex-col mb-5">
        <div className="mx-44 flex flex-col justify-around">
          <h1 className="w-[50vw] m-5 transition-all duration-1000 text-blue-800">
            {courseInformation.title}
          </h1>
          <h1 className="w-[50vw] m-5 transition-all duration-1000  text-blue-800">
            {courseInformation.description}
          </h1>
          <div className="m-5">
            <Card objectId={courseId} />
          </div>
        </div>
      </div>

      <div className="mx-48">
        <button
          onClick={() => router.push("/browse")}
          className="cursor-pointer flex text-sm items-center"
        >
          <ArrowLeft />
          <h2 className="">Back to Browse </h2>
        </button>
        <hr className="w-[48vw] my-2 "></hr>

        <ButtonFilter filterHandler={completionfilterHandler} />

        {loading && <CourseItemSkeleton />}
        {!loading && (
          <CourseItem
            courseInfo={courseInformation}
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
