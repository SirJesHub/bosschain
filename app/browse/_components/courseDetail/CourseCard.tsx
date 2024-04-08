import React from "react";
import Image from "next/image";

type courseProps = {
  category: string;
  created_at: string;
  desc: string;
  objectID: string;
  price: number;
  name: string;
};

export default function CourseCard({
  category,
  created_at,
  desc,
  objectID,
  price,
  name,
}: courseProps) {
  return (
    <div className="group relative h-full">
      <div className="cursor-pointer transition duration shadow-xl rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 h-full flex flex-col">
        <div className="flex-grow ">
          <Image
            src={"/YouTube-Thumbnail-Dimensions.webp"}
            alt="course image"
            width={400}
            height={400}
            className="w-full rounded-md"
          />
          <div className="p-2 h-full">
            <h2 className="font-bold">{name}</h2>
            <h3>Creator: Siraprop Jesdapiban</h3>
          </div>
        </div>

        {/* <p>
    <Highlight attribute="desc" hit={hit} />
  </p> */}
      </div>

      <div className="group opacity-0 absolute top-0 trasition duration-200 z-10 invisible sm:visible delay-300 w-full scale-0 group-hover:scale-110 group-hover:opacity-100">
        <Image
          className="cursor-pointer object-cover transition duration shadow-xl rounded-t-md w-full"
          src={"/YouTube-Thumbnail-Dimensions.webp"}
          alt="course image"
          width={400}
          height={400}
        />
        <div className="z-10 bg-blue-400 lg:p-2 absolute w-full transition shadow-md rounded-b-md text-slate-100">
          <h3 className="text-base font-black m-1">{name}</h3>
          <p className="text-sm m-1">{desc}</p>
          <ul className="text-xs flex m-1 text-">
            <li className="mr-2">2.5 total hours</li>
            <li className="mr-2">beginner</li>
            <li className="mr-2">videos</li>
          </ul>
          <button className=" m-1 p-1 pl-2 pr-2 rounded-3xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 focus:outline-none focus:ring focus:ring-orange-300">
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
}
