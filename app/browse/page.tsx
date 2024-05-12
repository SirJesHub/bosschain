"use client";

import Search from "./_components/algolia/Search";
import TrendingCourse from "./_components/algolia/TrendingCourse";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import NavBar from "@/components/nav-bar";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./page.css";
import Image from "next/image";
import FullDescriptionCourseCard from "./_components/browse/FullDescriptionCourseCard";
import { setting } from "./_components/browse/carousalSetting";

export default function BrowsePage() {
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [token, setToken] = useState<string>("");
  const [latestAccessCourse, setLatestAccessCourse] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
      const token = await getToken({ template: "supabase" });
      setToken(token || "");
      const userAuth = { userId: userId, token: token };
      const latestAccessCourse =
        await EnrollmentService.getLatestAccessEnrollment(userAuth);
      console.log("latest access course", latestAccessCourse);

      if (latestAccessCourse.data) {
        setLatestAccessCourse(latestAccessCourse.data);
      }
      setIsLoading(false);
    };
    initializePage();
  }, []);

  if (isLoading) {
    return <div>loading</div>;
  }
  return (
    <div className=" mt-28">
      <div>
        <h1 className="ml-[10vw] text-lg font-extrabold mt-10">
          Continue Learning
        </h1>

        <div className="m-10 w-[83vw] mx-auto mb-28">
          <Slider {...setting}>
            {latestAccessCourse.map((course: any) => (
              <div className="w-[340px] h-[450px]">
                <FullDescriptionCourseCard
                  course_id={course.course_id.course_id}
                  title={course.course_id.title}
                  category={course.course_id.category}
                  description={course.course_id.description}
                  cover_image={course.course_id.cover_image}
                  enrollment_id={course.enrollment_id}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <TrendingCourse />
      <Search />
    </div>
  );
}
