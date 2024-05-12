"use client";

import { RelatedProducts } from "@algolia/recommend-react";
import recommend from "@algolia/recommend";
import { index, appId, apiKey } from "../../../../helper";
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

function RelatedItem({ item }: { item: ItemProps }) {
  return (
    <div className="w-full my-5 shadow-lg overflow-hidden rounded-md ">
      <Link href={`/browse/${item.objectID}`}>
        <div className="text-wrap">
          <Image
            src={"/online-course-cover.webp"}
            alt="course image"
            width={300}
            height={300}
            className="w-full rounded-md"
          />
          <div className="p-2 ">
            <h1 className="text-sm">{item.name}</h1>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function SimilarCourse({ objectId }: { objectId: number }) {
  return (
    <div>
      <h2 className="font-md text-md text-blue-600">Related Course</h2>
      <RelatedProducts
        classNames={{
          root: "w-[20vw]",
          title: "hidden",
          container: "w-full",
          list: "w-full",
          item: "overflow-auto w-full",
        }}
        recommendClient={recommendClient}
        indexName={index}
        objectIDs={[`${objectId}`]}
        itemComponent={RelatedItem}
        maxRecommendations={3}
      />
    </div>
  );
}
