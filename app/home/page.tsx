import React from "react";
import Image from "next/image";
import TrendingCourse from "./_components/TrendingCourse";

export default function page() {
  return (
    <div className="bg-blue-600 h-full box-border w-full">
      <div className="bg-gradient-to-r from-black to-blue-700  h-full p-10 flex flex-row text-blue-900">
        <div className="w-1/2 p-10 text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-500 flex flex-col justify-center items-start">
          <h2 className="text-lg font-semibold mb-8">• Welcome to Bosschain</h2>
          <div className=" text-transparent bg-clip-text bg-gradient-to-br from-blue-100 to-blue-500">
            <h1 className="text-7xl mb-8 font-bold ">
              Crypto and Blockchain Learning Platform
            </h1>
          </div>
          <h1 className="text-xl mb-8 text-transparent">
            Explore our platform for comprehensive education on cryptocurrency
            and blockchain technology fundamentals.
          </h1>
          <button className="bg-gradient-to-br hover:scale-105 from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-800 hover:shadow-2xl transition-all duration-500 text-white font-semibold px-10 py-4 rounded-lg">
            Get Started
          </button>
        </div>
        <div className=" w-1/2 my-auto">
          <Image
            src={"/Demo-Website-Cover.webp"}
            height={500}
            width={500}
            alt="Image Cover"
            className=" w-full"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-black to-blue-700 bg-blue-700 h-full p-10 flex flex-row ">
        <div className="w-1/2 p-10 flex flex-col justify-end items-center box-border">
          <Image
            src={"/coin-home-cover.png"}
            height={725}
            width={680}
            alt="Image Cover"
            className=" max-w-full max-h-full object-contain rounded-3xl"
          />
        </div>
        <div className="w-1/2 p-10 flex flex-col justify-end text-transparent bg-clip-text bg-gradient-to-tl from-blue-300 to-white">
          <h1 className="text-7xl mb-8 font-bold ">Discover, Learn, Quiz</h1>
          <h1 className="text-xl">
            Dive into our curated courses, master crypto, and blockchain with
            interactive quizzes.
          </h1>
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-100 to-gray-200  h-max p-10 ">
        <div className="w-full p-10 pt-32 flex flex-col items-center box-border text-transparent bg-clip-text bg-gradient-to-br from-blue-800 to-blue-700 ">
          <hr className="text-black"></hr>
          <h2 className="text-5xl mb-8 font-extrabold ">
            Trending Courses to Explore{" "}
          </h2>
          <p className="text-lg font-medium">
            Dive into the latest and most sought-after content to enhance your
            learning journey.
          </p>
        </div>
        <TrendingCourse />
      </div>

      <div className="bg-gradient-to-br from-gray-100 to-white p-10 flex flex-row h-max">
        <div className="w-full p-10 pt-24 flex flex-col justify-start items-center box-border text-white text-transparent bg-clip-text bg-gradient-to-br from-blue-800 to-blue-700">
          <h2 className="text-lg font-semibold mb-8">• Let's get started •</h2>
          <h1 className="text-7xl mb-24 font-bold  ">Pages</h1>
          <div>
            <div className="grid grid-cols-3 grid-rows-1 gap-10 text-blue-800">
              <div className="flex flex-col items-center text-center gap-5 group ">
                <Image
                  className="object-cover transition duration shadow-xl rounded-md w-full group-hover:scale-105 overflow-hidden"
                  src={"/YouTube-Thumbnail-Dimensions.webp"}
                  alt="course image"
                  width={400}
                  height={400}
                />
                <h3 className="text-2xl font-bold">Browse</h3>
                <p>Explore subjects, find your interests</p>
                <button className="bg-gradient-to-br hover:scale-105 from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-800 hover:shadow-2xl transition-all duration-500 text-white font-semibold px-10 py-4 rounded-lg">
                  Explore Courses
                </button>
              </div>

              <div className="flex flex-col items-center text-center gap-5 group">
                <Image
                  className="object-cover transition duration shadow-xl rounded-md w-full group-hover:scale-105"
                  src={"/YouTube-Thumbnail-Dimensions.webp"}
                  alt="course image"
                  width={400}
                  height={400}
                />
                <h3 className="text-2xl font-bold">News & Information</h3>
                <p>
                  Stay updated with the latest information and blockchain
                  insights.
                </p>
                <button className="bg-gradient-to-br hover:scale-105 from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-800 hover:shadow-2xl transition-all duration-500 text-white font-semibold px-10 py-4 rounded-lg">
                  News & Updates
                </button>
              </div>

              <div className="flex flex-col items-center text-center gap-5 group">
                <Image
                  className="object-cover transition duration shadow-xl rounded-md w-full group-hover:scale-105 "
                  src={"/YouTube-Thumbnail-Dimensions.webp"}
                  alt="course image"
                  width={400}
                  height={400}
                />
                <h3 className="text-2xl font-bold">Dashboard</h3>
                <p>Track your progress, manage your courses</p>
                <button className="bg-gradient-to-br from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-800 hover:shadow-2xl transition-all duration-500 text-white font-semibold px-10 py-4 rounded-lg hover:scale-105">
                  My Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-black to-blue-800  h-full p-10 flex flex-row shadow-2xl">
        <div className="w-1/2 p-10 flex flex-col justify-end items-center box-border">
          <Image
            src={"/2Demo-Website-Cover.webp"}
            height={725}
            width={680}
            alt="Image Cover"
            className=" max-w-full max-h-full object-contain"
          />
        </div>
        <div className="w-1/2 p-10 flex flex-col justify-end items-start gap-5 text-gray-200 ">
          <h1 className="text-7xl mb-8 font-bold">Teacher Mode</h1>
          <h1 className="text-xl">
            Unlock the potential of knowledge-sharing on our platform to enable
            learning for all.
          </h1>
          {/* accordion */}
          <div className="bg-gradient-to-bl from-white to-blue-200 text-blue-700 h-max rounded-2xl flex flex-col justify-around  p-6 w-full">
            <div>
              <h1 className="text-2xl font-bold my-2">Text</h1>
              <p>
                Craft engaging lesson plans and instructional materials
                effortlessly.
              </p>
            </div>
            <hr className="border-1 border-blue-600 my-2"></hr>
            <div>
              <h1 className="text-2xl font-bold my-2">Videos</h1>
              <p>
                Enhance learning experiences with multimedia content to
                illustrate concepts effectively.
              </p>
            </div>
            <hr className="border-1 border-blue-600 my-2"></hr>
            <div>
              <h1 className="text-2xl font-bold my-2">Quiz Maker</h1>
              <p>
                Create interactive quizzes to assess student comprehension and
                enhance learning.
              </p>
            </div>
          </div>
          {/* accordion */}

          <button className="bg-gradient-to-br text-lg from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 hover:shadow-2xl transition-all duration-500 text-white font-semibold px-10 py-4 rounded-lg">
            Share Knowledge
          </button>
        </div>
      </div>
    </div>
  );
}
