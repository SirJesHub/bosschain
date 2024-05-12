"use client";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import NavBar from "@/components/nav-bar";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import { useEffect, useState } from "react";
import CourseCard from "./_components/CourseCard";
import Carousel from "./_components/Carousel";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./page.css";
import Image from "next/image";
import FullDescriptionCourseCard from "./_components/FullDescriptionCourseCard";

export default function UserDashboardPage() {
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [token, setToken] = useState<string>("");
  const [userEnrollment, setUserEnrollment] = useState<any>();
  const [latestAccessCourse, setLatestAccessCourse] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: false,
    speed: 800,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 2300,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1900,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const initializePage = async () => {
      const token = await getToken({ template: "supabase" });
      setToken(token || "");
      const userAuth = { userId: userId, token: token };

      const userEnrollment = await EnrollmentService.getAllEnrollment(userAuth);
      const latestAccessCourse =
        await EnrollmentService.getLatestAccessEnrollment(userAuth);
      console.log("latest access course", latestAccessCourse);

      if (userEnrollment.data) {
        setUserEnrollment(userEnrollment.data);
        console.log(userEnrollment.data);
      }

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
    <div className="pt-[60px] w-screen pb-[120px]">
      <div>
        <h1 className="ml-[10vw] text-lg font-extrabold mt-10">
          Continue Learning
        </h1>

        <div className="m-10 w-[83vw] mx-auto mb-28">
          <Slider {...settings}>
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

      <div>
        <h1 className="ml-[10vw] text-lg font-extrabold mt-10">
          My Learning List
        </h1>
        <div className="m-10 w-[80vw] mx-auto grid gap-10 grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
          {userEnrollment.map((course: any) => (
            <div className="h-[300px]">
              <CourseCard
                course_id={course.course_id.course_id}
                title={course.course_id.title}
                category={course.course_id.category}
                description={course.course_id.description}
                cover_image={course.course_id.cover_image}
                enrollment_id={course.enrollment_id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* <div className="h-[500px] w-[300px] bg-slate-600 ">
        <div className="h-1/2 relative">
          <Image
            className="cursor-pointer object-cover  shadow-xl  "
            src={"/YouTube-Thumbnail-Dimensions.webp"}
            alt="course image"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="relative h-1/2">
          <div >
            <h2 className="font-bold line-clamp-2 mb-2">
              Models Blohain Gvernance Models of Blocels Blohain Gvernance
              Models ofain Governance Models oels Blohain Gvernance Models off
              Blockchain Governance
            </h2>

            <h3 className="text-sm font-semibold my-1 line-clamp-2 mb-2">
              • Decentralized finance Decentralized finance Decentralized
              finance Decentralized finance
            </h3>
            <p className="text-sm m-1 line-clamp-4">
              It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with It
              was popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with
            </p>
          </div>
          <div className="my-3  absolute bottom-2 right-4 line">
            <Link
              href={`/browse`}
              className=" bg-gradient-to-br hover:scale-105 from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-800 hover:shadow-2xl transition-all duration-500 text-white font-semibold px-8 py-2 rounded-full"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
}
