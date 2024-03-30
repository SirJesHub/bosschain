"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import ReactJson from "react-json-view";
import { ChangeEvent, useEffect, useState } from "react";
import { useRoleContext } from "@/context/roleContext";
import { CourseService } from "@/lib/supabase/courseRequests";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import { SupabaseResponse } from "@/models/requestModels";
import { Database } from "@/types/supabase";
import Form, { FormProps } from "react-bootstrap/Form";
import { BucketService } from "@/lib/supabase/BucketRequests";

export default function Home() {
  const { role } = useRoleContext();

  const { user, isSignedIn } = useUser();
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";

  const [course, setCourse] =
    useState<
      SupabaseResponse<
        Array<Database["public"]["Tables"]["course"]["Row"] | null>
      >
    >();

  const [loading, setLoading] = useState(true);

  const [imageUrlList, setImageUrlList] = useState<Array<String>>([]);
  const [file, setFile] = useState<File>();
  const [queryParam, setQueryParam] = useState<string>(
    `?timestamp=${new Date().getTime()}`,
  ); // temporary hack to trigger reload image

  useEffect(() => {
    const initializePage = async () => {
      try {
        const token = await getToken({ template: "supabase" });

        const course = await EnrollmentService.getFullCourse({ userId, token });
        setCourse(course); // may require frontend side to filter null -> can use Array.filter
        console.log("course ->", course);

        const fullCourse = await EnrollmentService.getFullCourse({
          userId,
          token,
        });
        console.log("FULL COURSE -> ", fullCourse);

        // const fetchedImages = await BucketService.getImageList({
        //   token,
        //   folderPath: "3/course",
        //   // This is relative course_assets bucket
        //   // To get the public url for an image -> process.env.NEXT_PUBLIC_COURSE_ASSETS_BASE_URL + courseId + <course|lesson> + image name
        // });

        setLoading(false);
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
      }
    };

    initializePage();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const token = await getToken({ template: "supabase" });
    const createdCourse = await CourseService.createCourse({
      userId,
      token,
      title: event.target[0].value,
      description: null,
    });
    setCourse(createdCourse);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const enrollUser = async (event: any) => {
    event.preventDefault();
    const token = await getToken({ template: "supabase" });
    const createdCourse = await EnrollmentService.enrollByCourseId({
      userId,
      token,
      courseId: event.target[0].value as number,
    });
  };

  const saveFile = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      setFile(fileList[0]);
    } else {
      console.log("No file is chosen");
    }
  };

  const uploadImage = async () => {
    console.log("start upload");
    if (file) {
      console.log("uploading");
      const token = await getToken({ template: "supabase" });
      await BucketService.uploadFile({
        token,
        userId,
        courseId: 3,
        file,
      });
      setQueryParam(`?timestamp=${new Date().getTime()}`);
    } else {
      console.log("There is no file selected");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <UserButton afterSignOutUrl="/" />
      <div>isLoaded: {isLoaded.toString()}</div>
      <div>sessionId: {sessionId}</div>
      <h2>
        Your role is <b>{role}</b>
      </h2>
      {isSignedIn ? (
        <div className="p-3">
          <p className="text-3xl font-medium text-sky-700">
            A backend playground for testing supabase DB call
          </p>
          <br />
          Course of this user: {userId}
          <br />
          {/* {course?.data?.map((row) => (
            <ReactJson src={row || {}} key={row?.course_id} />
          ))} */}
          <br />
          <br />
          <h1 className="text-3xl font-medium text-sky-700">
            Teacher functions
          </h1>
          <h3>
            Add course - this function shoud be guarded by frontend using
            roleContext
          </h3>
          <form onSubmit={handleSubmit}>
            <Input placeholder="course title [IF WANT TO TEST DESCRIPTION -> NEED TO CREATE A FORM]" />
            <Button>Add course</Button>
          </form>
          <h1>Student functions</h1>
          <h3>Enroll the user in a course</h3>
          <form onSubmit={enrollUser}>
            <Input placeholder="course id" />
            <Button>Enroll</Button>
          </form>
          <hr className="mt-5 mb-5 h-1 bg-slate-400" />
          <h1 className="text-3xl font-medium text-green-700">
            Image create and get DEMO
          </h1>
          <Form.Group>
            <Form.Control
              type="file"
              onChange={(e) => saveFile(e as ChangeEvent<HTMLInputElement>)}
            ></Form.Control>
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={uploadImage}
            >
              Save image
            </button>
          </Form.Group>
          <img
            src={
              process.env.NEXT_PUBLIC_COURSE_ASSETS_BASE_URL +
              "3/course/cover" +
              queryParam
            }
          ></img>
        </div>
      ) : (
        <div>
          <p>please sign in</p>
          <SignInButton mode="modal" />
        </div>
      )}
    </>
  );
}
