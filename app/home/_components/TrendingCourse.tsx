"use client";
import CourseCard from "../_components/CourseCard";
import { TrendingItems } from "@algolia/recommend-react";
import recommend from "@algolia/recommend";
import { index, appId, apiKey, userToken } from "../../../helper";
import Link from "next/link";
import Image from "next/image";

const recommendClient = recommend(appId, apiKey);

type ItemProps = {
  category: string;
  created_at: string;
  desc: string;
  objectID: string;
  price: number;
  name: string;
};

function TrendingItem({ item }: { item: ItemProps }) {
  return (
    <Link href={`/browse/${item.objectID}`}>
      <div className="">
        <CourseCard
          key={item.objectID}
          name={item.name}
          category={item.category}
          created_at={item.created_at}
          desc={item.desc}
          objectID={item.objectID}
          price={item.price}
        />
      </div>
    </Link>
  );
}

export default function TrendingCourse() {
  return (
    <>
      <TrendingItems
        maxRecommendations={6}
        recommendClient={recommendClient}
        indexName={index}
        itemComponent={TrendingItem}
        classNames={{
          root: "m-10",
          list: "w-[80vw] mx-auto grid gap-10 grid-cols-3",
          item: "",
          title: "hidden",
        }}
      />
    </>
  );
}
