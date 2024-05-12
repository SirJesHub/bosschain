import React from "react";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <div className="group relative h-[300px] bg-white rounded-lg">
      <div className="cursor-pointer transition duration shadow-xl rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 flex flex-col h-full">
        <div className="h-4/6 rounded-md bg-slate-300 relative overflow-hidden">
          <Image
            src={"/online-course-cover.webp"}
            alt="course image"
            // width={400}
            // height={400}
            layout="fill"
            objectFit="cover"
            // className="object-cover"
          />

          {/* {cover_image && (
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
        )} */}
        </div>
        <div className="p-2 flex flex-col flex-grow ">
          <div className="my-1">
            {/* <Progressbar
            completedLessonCount={completedLessons}
            totalLessonCount={totalLessons}
          /> */}
          </div>
          <div>
            <h2 className="font-bold">{name}</h2>
            {/* <h3 className="font-md">{category}</h3> */}
          </div>
        </div>

        {/* <p>
  <Highlight attribute="desc" hit={hit} />
</p> */}
      </div>

      <div className="group opacity-0 absolute top-0 trasition duration-200 z-10 invisible sm:visible delay-300 w-full scale-0 group-hover:scale-110 group-hover:opacity-100">
        <Image
          className="cursor-pointer object-cover transition duration shadow-xl rounded-t-md w-full"
          src={"/online-course-cover.webp"}
          alt="course image"
          width={400}
          height={400}
        />
        {/* {cover_image && (
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
      )} */}

        <div className="p-2 flex flex-col flex-grow h-2/6 justify-between  bg-white shadow-2xl rounded-md">
          <div className="my-1"></div>
          <div>
            <h2 className="font-bold">{name}</h2>
            <h3 className="text-sm font-semibold my-1">• {category}</h3>
            <p className="text-sm m-1">{desc}</p>
          </div>
          <div className="my-3">
            <Link
              href={`/browse/${objectID}`}
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
