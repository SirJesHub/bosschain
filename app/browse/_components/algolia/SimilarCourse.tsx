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
    <Link href={`/browse/${item.objectID}`}>
      <article>
        <Image
          src={"/course_photo.jpeg"}
          alt="course image"
          width={300}
          height={300}
        />
        <h1>{item.name}</h1>
        <h2>{item.objectID}</h2>
      </article>
    </Link>
  );
}

export default function RecommendComponent({ objectId }: { objectId: string }) {
  return (
    <RelatedProducts
      recommendClient={recommendClient}
      indexName={index}
      objectIDs={[`${objectId}`]}
      itemComponent={RelatedItem}
      maxRecommendations={5}
    />
  );
}
