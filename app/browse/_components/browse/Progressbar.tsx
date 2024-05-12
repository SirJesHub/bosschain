import React, { useEffect, useState } from "react";

export default function Progressbar({
  completedLessonCount,
  totalLessonCount,
}: {
  completedLessonCount: number;
  totalLessonCount: number;
}) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<number | undefined>();
  useEffect(() => {
    const progress = Math.round(
      (completedLessonCount / totalLessonCount) * 100,
    );
    setProgress(progress);
    setLoading(false);
  }, [completedLessonCount, totalLessonCount]);
  return (
    <div className="h-5 flex justify-between items-center text-blue-600 font-bold">
      {!loading && (
        <>
          <div className="h-2 rounded-full bg-gray-100 w-4/5 ">
            <div
              className={`bg-blue-500 h-full  rounded-full`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs">{`${progress}%`}</p>
        </>
      )}
    </div>
  );
}
