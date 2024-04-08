"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import aa from "search-insights";
import { index, appId, apiKey, userToken } from "../../../../helper";
import { Router } from "lucide-react";
import { getEnrollment, createEnrollment } from "@/lib/supabase/courseRequests";
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
  const queryID: any = searchParams.get("queryID");

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
          className="bg-blue-600 text-slate-100 py-2 px-5 rounded-xl shadow-xl"
          onClick={() => enrollEventHandler({ courseId, queryID })}
        >
         ENROLL THIS COURSE
        </button>
      )}
      {enrollmentData && (
        <div className="bg-blue-600 text-slate-100 py-2 px-5 rounded-xl w-fit font-semibold">
          <p>Already Enrolled</p>
        </div>
      )}
      {/* <button onClick={() => router.push(`/browse/${objectId}/e`)}>
        RESUME LEARNING
      </button> */}
    </div>
  );
}
