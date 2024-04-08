"use client";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { userLearningData } from "../_components/mockData/userLearningData";
import Image from "next/image";
import CourseItem from "../_components/courseDetail/CourseItem";
import SimilarCourse from "../_components/algolia/SimilarCourse";
import Card from "../_components/algolia/Card";
import ButtonFilter from "../_components/courseDetail/ButtonFilter";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { courseInformation } from "../_components/mockData/courseInformation";
import { useRouter } from "next/navigation";
import FAQ from "../_components/FAQ";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import CourseItemSkeleton from "../_components/courseDetail/CourseItemSkeleton";
import CourseIntroductionSkeleton from "../_components/courseDetail/CourseIntroductionSkeleton";
import { SupabaseResponse } from "@/models/requestModels";
import { redirect } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import {
  createCourse,
  getCourse,
  getFullCourse,
  getFullCurrentCourse,
  getProgress,
  getEnrollment,
  createEnrollment,
  getCoverImage,
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
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [loading, setLoading] = useState(true);
  const [completionFilter, setCompletionFilter] = useState("all");
  const [courseData, setCourseData] = useState<any>();
  const [enrollmentData, setEnrollmentData] = useState<any>();
  const [progress, setProgress] = useState<any>();
  const [ImageCoverUrl, setImageCoverUrl] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const initializePage = async () => {
      const token = await getToken({ template: "supabase" });
      const userAuth = { userId: userId, token: token };
      try {
        try {
          const courseData = await getFullCurrentCourse(userAuth, courseId);

          // 1.Course Validity Check
          if (!courseData.data) {
            console.log("course is not found");
            return router.push("/browse");
          }
          setCourseData(courseData.data);

          // 2.Course Publishment check
          if (!courseData.data.is_published) {
            console.log("course is not published");
            return router.push("/browse");
          }
        } catch (error) {
          console.log("[ERROR while fetching courseData]: ", error);
        }

        try {
          const enrollment = await getEnrollment(userAuth, courseId);
          // 3. Course Enrollment check
          if (enrollment.data) {
            const progress = await getProgress(
              userAuth,
              courseId,
              enrollment.data.enrollment_id
            );
            console.log(progress.data);
            if (progress.data) {
              setProgress(progress.data);
              setEnrollmentData(enrollment.data);
            }
          } else {
            console.log("no user enrollment");
          }
        } catch (error) {
          console.log(
            "[ERROR while fetching enrollment and progress]: ",
            error
          );
        }

        const CoverImage = await getCoverImage(userAuth, courseId);
        if (CoverImage) {
          setImageCoverUrl(CoverImage);
        }
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
      }
      setLoading(false);
    };
    initializePage();
  }, []);

  const completionfilterHandler = (value: string) => {
    setCompletionFilter(value);
  };

  const enrollmentHandler = async () => {
    try {
      const token = await getToken({ template: "supabase" });
      const userAuth = { userId: userId, token: token };
      const enrollment = await createEnrollment(userAuth, courseId);

      if (enrollment) {
        const progress = await getProgress(
          userAuth,
          courseId,
          enrollment.data.enrollment_id
        );

        setEnrollmentData(enrollment.data);

        if (progress.data) {
          setProgress(progress.data);
          setEnrollmentData(enrollment);
          toast.success("enrolled successfully");
        }
      } else {
        console.log("no user enrollment");
      }
    } catch (error) {
      console.error("Error in enrollmentHandler:", error);
    }
  };

  return (
    <div className="">
      <Toaster position="top-center" />
      <div className="bg-gradient-to-br from-blue-300 to-blue-800 min-h-[280px] text-slate-100 font-medium mb-5 flex">
        {!loading && courseData && (
          <div className="grid grid-cols-12 gap-4">
            <Image
              src={"/longtunman.jpeg"}
              alt="course cover"
              width={100}
              height={100}
              className="rounded-xl self-center col-start-2 col-span-2 w-full my-10"
            />
            <div className=" flex flex-col col-span-6 justify-around h-full">
              <div>
                <h1 className="w-[50vw] mx-5 transition-all duration-1000 text-3xl">
                  {courseData.title}
                </h1>
                <h1 className="w-[50vw] m-5 transition-all duration-1000 text">
                  {courseData.description}
                </h1>
                <div className="mx-5">
                  <Card
                    courseId={courseId}
                    enrollmentData={enrollmentData}
                    enrollmentHandler={enrollmentHandler}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && <CourseIntroductionSkeleton />}
      </div>
      <div className="flex justify-around m-20 mt-5">
        <div className="w-[60vw] min-h-[220px] p-5 rounded-xl">
          <button
            onClick={() => router.push("/browse")}
            className="cursor-pointer flex items-center font-medium text-md text-blue-600"
          >
            <ChevronLeft />
            <h2 className="">Back to Browse </h2>
          </button>
          <hr className="w-[48vw] my-2 "></hr>

          <ButtonFilter filterHandler={completionfilterHandler} />

          {loading && <CourseItemSkeleton />}
          {!loading && courseData && (
            <CourseItem
              courseInfo={courseData.module}
              progress={enrollmentData ? progress : undefined}
              courseId={courseId}
              filter={completionFilter}
              enrollment={enrollmentData}
              enrollmentHandler={enrollmentHandler}
            />
          )}
        </div>
        <div className="mt-8">
          {!loading && <SimilarCourse objectId={courseId} />}
        </div>
      </div>
    </div>
  );
}
