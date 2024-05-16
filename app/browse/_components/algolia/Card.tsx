"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import aa from "search-insights";
import { index, appId, apiKey, userToken } from "../../../../helper";
import { Router } from "lucide-react";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";

aa("init", {
  appId: appId,
  apiKey: apiKey,
});

type EnrollHandlerParams = {
  courseId: number;
  queryID: string;
};

export default function Card({
  courseId,
  enrollmentData,
  enrollmentHandler,
}: {
  courseId: any;
  enrollmentData: any;
  enrollmentHandler: Function;
}) {
  courseId = courseId.toString();
  const searchParams = useSearchParams();
  const queryID: any = searchParams?.get("queryID") ?? "No token";

  const enrollEventHandler = async ({
    courseId,
    queryID,
  }: EnrollHandlerParams) => {
    aa("convertedObjectIDsAfterSearch", {
      userToken: userToken,
      index: index,
      eventName: "Course Enrolled",
      queryID: queryID,
      objectIDs: [`${courseId}`],
    });
    enrollmentHandler();
  };

  return (
    <div>
      {!enrollmentData && (
        <button
          className="bg-gradient-to-br hover:scale-105 cursor-pointer from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-800 hover:shadow-2xl transition-all duration-500 text-white font-semibold px-10 py-4 rounded-lg w-fit"
          onClick={() => enrollEventHandler({ courseId, queryID })}
        >
          ENROLL THIS COURSE
        </button>
      )}
      {enrollmentData && (
        <div className="bg-gradient-to-br hover:scale-105 from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-800 hover:shadow-2xl transition-all duration-500 text-white font-semibold px-10 py-4 rounded-lg w-fit">
          <p>Already Enrolled</p>
        </div>
      )}
      {/* <button onClick={() => router.push(`/browse/${objectId}/e`)}>
        RESUME LEARNING
      </button> */}
    </div>
  );
}
