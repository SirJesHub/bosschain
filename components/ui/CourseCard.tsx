import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type courseProps = {
  category: string;
  created_at: string;
  desc: string;
  objectID: string;
  price: number;
  name: string;
};

export default function CourseCard({
  created_at,
  desc,
  objectID,
  price,
  name,
  category,
}: courseProps) {
  const [queryParam, setQueryParam] = useState<string>(
    `?timestamp=${new Date().getTime()}`,
  ); // temporary hack to trigger reload image
  return (
    <div className="group relative h-[300px] bg-white rounded-lg">
      <div className="cursor-pointer transition duration shadow-xl rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 flex flex-col h-full z-20">
        {/* before zoom */}
        <div className="h-4/6 rounded-md bg-slate-200 relative overflow-hidden">
          <img
            className="absolute inset-0 object-cover w-full h-full shadow-xl"
            src={
              process.env.NEXT_PUBLIC_COURSE_ASSETS_BASE_URL +
              "" +
              objectID +
              "/course/cover" +
              queryParam
            }
            alt="course image"
          />
        </div>
        {/* Description */}
        <div className="p-2 flex flex-col flex-grow ">
          <div>
            <h2 className="font-bold line-clamp-2">{name}</h2>
            <h3 className="text-sm font-semibold my-1 line-clamp-2">
              • {category}
            </h3>
          </div>
        </div>
      </div>

      <div className="group opacity-0 absolute top-0 trasition duration-200 invisible sm:visible delay-300 w-full scale-0 group-hover:scale-110 group-hover:opacity-100 h-[450px] z-40">
        {/* <Image
          className="cursor-pointer object-cover transition duration shadow-xl rounded-t-md w-full"
          src={"/online-course-cover.webp"}
          alt="course image"
          width={400}
          height={400}
        /> */}

        <img
          className="cursor-pointer object-cover transition duration-300 shadow-xl rounded-t-md w-full h-1/2 bg-slate-200"
          src={
            process.env.NEXT_PUBLIC_COURSE_ASSETS_BASE_URL +
            "" +
            objectID +
            "/course/cover" +
            queryParam
          }
          alt="course image"
        />

        {/* <div className="h-4/6 rounded-md bg-slate-300 relative overflow-hidden">
          <img
            className="absolute inset-0 object-cover w-full h-full shadow-xl"
            src={
              process.env.NEXT_PUBLIC_COURSE_ASSETS_BASE_URL +
              "" +
              objectID +
              "/course/cover" +
              queryParam
            }
            alt="course image"
          />
        </div> */}

        <div className="p-2 flex flex-col  h-1/2 justify-between  bg-white shadow-2xl rounded-b-md ">
          <div>
            <h2 className="font-bold line-clamp-2">{name}</h2>
            <h3 className="text-sm font-semibold my-1 line-clamp-2">
              • {category}
            </h3>
            <p className="text-sm m-1 line-clamp-4">{desc}</p>
          </div>
          <div className="my-3">
            <Link
              href={`/browse/${objectID}`}
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
  //   return (
  //     <div className="group relative h-[300px]">
  //       <div className="cursor-pointer transition duration shadow-xl rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 flex flex-col h-full">
  //         <div className="h-4/6 rounded-md bg-slate-300 relative overflow-hidden ">
  //           <Image
  //             src={"/online-course-cover.webp"}
  //             alt="course image"
  //             // width={400}
  //             // height={400}
  //             layout="fill"
  //             objectFit="cover"
  //             // className="w-full rounded-md"
  //           />
  //         </div>
  //         <div className="p-2 flex flex-col flex-grow">
  //           <h2 className="font-bold">{name}</h2>
  //           <h3>Creator: Siraprop Jesdapiban</h3>
  //         </div>

  //         {/* <p>
  //   <Highlight attribute="desc" hit={hit} />
  // </p> */}
  //       </div>

  //       <div className="group opacity-0 absolute top-0 trasition duration-200 z-10 invisible sm:visible delay-300 w-full scale-0 group-hover:scale-110 group-hover:opacity-100">
  //         <Image
  //           className="cursor-pointer object-cover transition duration shadow-xl rounded-t-md w-full"
  //           src={"/online-course-cover.webp"}
  //           alt="course image"
  //           width={400}
  //           height={400}
  //         />
  //         <div className="z-10 bg-gray-100 text-black lg:p-2 absolute w-full transition shadow-2xl rounded-b-md overflow-hidden">
  //           <h3 className="text-base font-black m-1">{name}</h3>
  //           <h3 className="m-1 text-sm font-bold">{`${category}`}</h3>
  //           <p className="text-sm m-1">{desc}</p>
  //           <ul className="text-xs flex m-1 text-"></ul>
  //           <button className=" m-1 p-1 pl-2 pr-2 rounded-3xl bg-blue-600 text-white focus:outline-none focus:ring focus:ring-orange-300">
  //             Start Learning
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
}
