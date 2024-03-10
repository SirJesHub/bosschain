"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import aa from "search-insights";
import { index, appId, apiKey, userToken } from "../../../../helper";
import { Router } from "lucide-react";

aa("init", {
  appId: appId,
  apiKey: apiKey,
});

type EnrollHandlerParams = {
  objectId: number;
  queryID: string;
};

export default function Card({ objectId }: { objectId: any }) {
  const [isEnrolled, setIsEnrolled] = useState<boolean>(true);

  objectId = objectId.toString();
  const searchParams = useSearchParams();
  const queryID: any = searchParams.get("queryID");
  const router = useRouter();

  function enrollHandler({ objectId, queryID }: EnrollHandlerParams) {
    aa("convertedObjectIDsAfterSearch", {
      userToken: userToken,
      index: index,
      eventName: "Course Enrolled",
      queryID: queryID,
      objectIDs: [`${objectId}`],
    });
    setIsEnrolled(true);
  }

  return (
    <div>
      {!isEnrolled && (
        <button
          className="bg-white text-blue-500 py-2 px-3 rounded-2xl "
          onClick={() => enrollHandler({ objectId, queryID })}
        >
          ENROLL THIS COURSE
        </button>
      )}
      {isEnrolled && (
        <p className="bg-white text-blue-500 py-2 px-3 rounded-2xl w-fit ">
          Already enrolled
        </p>
      )}
      {/* <button onClick={() => router.push(`/browse/${objectId}/e`)}>
        RESUME LEARNING
      </button> */}
    </div>
  );
}
