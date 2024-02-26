"use client";

import React from "react";
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

function enrollHandler({ objectId, queryID }: EnrollHandlerParams) {
  aa("convertedObjectIDsAfterSearch", {
    userToken: userToken,
    index: index,
    eventName: "Course Enrolled",
    queryID: queryID,
    objectIDs: [`${objectId}`],
  });
}

export default function Card({ objectId }: { objectId: any }) {
  objectId = objectId.toString();
  const searchParams = useSearchParams();
  const queryID: any = searchParams.get("queryID");
  const router = useRouter();

  return (
    <div>
      <button onClick={() => enrollHandler({ objectId, queryID })}>
        ENROLL COURSE
      </button>
      {/* <button onClick={() => router.push(`/browse/${objectId}/e`)}>
        RESUME LEARNING
      </button> */}
    </div>
  );
}
