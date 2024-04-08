//import PropTypes from 'props-types';
import Link from "next/link";
import { Highlight } from "react-instantsearch";
import Image from "next/image";
import CourseCard from "../courseDetail/CourseCard";

type HitProps = {
  category: string;
  created_at: string;
  desc: string;
  image: any;
  name: string;
  objectID: string;
  price: number;
  __position: number;
  __queryID: string;
};

export default function Hit({
  hit,
  sendEvent,
}: {
  hit: HitProps;
  sendEvent: any;
}) {
  return (
    <Link
      href={`/browse/${hit.objectID}?queryID=${hit.__queryID}`}
      onClick={() => sendEvent("click", hit, "Course Clicked")}
    >
      <CourseCard
        key={hit.objectID}
        name={hit.name}
        category={hit.category}
        created_at={hit.created_at}
        desc={hit.desc}
        objectID={hit.objectID}
        price={hit.price}
      />
    </Link>
  );
}
