"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Banner } from "@/components/banner";
import ReactJson from "react-json-view";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRoleContext } from "@/context/roleContext";
import { SupabaseResponse } from "@/models/requestModels";
import { BucketService } from "@/lib/supabase/BucketRequests";
import Form, { FormProps } from "react-bootstrap/Form";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import VideoForm from "./_components/video-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Trash } from "lucide-react";
import TextEditor from "./_components/TextEditor";
import { CourseService } from "@/lib/supabase/courseRequests";
import { LessonService } from "@/lib/supabase/lessonRequests";
import content from "@/app/browse/_components/lesson/Content";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Quiz from "react-quiz-component";
import QuizForm from "./_components/QuizForm";
import { QuizComponentForm } from "./_components/quiz-form";

const LessonIdPage = ({
  params: { lessonId, courseId, moduleId },
}: {
  params: { lessonId: number; courseId: number; moduleId: number };
}) => {
  const { role } = useRoleContext();
  const { user, isSignedIn } = useUser();
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [lesson, setLesson] = useState<SupabaseResponse<Array<any>>>();
  const [token, setToken] = useState<string>("");
  const [imageUrlList, setImageUrlList] = useState<Array<String>>([]);
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(true); // State for loading status
  const [queryParam, setQueryParam] = useState<string>(
    `?timestamp=${new Date().getTime()}`,
  ); // temporary hack to trigger reload image
  const [lessonContent, setLessonContent] = useState<any>();
  const [isModified, setIsModified] = useState<boolean>(false);
  const [result, setResult] = useState<any>(); // Define result state

  useEffect(() => {
    const initializePage = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken({ template: "supabase" });
          setToken(token || "");
          // const lessonId = window.location.pathname.split("/").pop() || "";
          const lessonData = await EnrollmentService.getLessonById({
            userId,
            lessonId,
            token,
          });
          setLesson(lessonData);
          console.log(lessonData.data);

          const userAuth = { userId: userId, token: token };
          // get lesson content based with (ModuleId,  LessonId)

          const lessonContent = await CourseService.getLessonContentById(
            userAuth,
            moduleId,
            lessonId,
          );
          console.log("lesson content:", lessonContent.data);
          if (lessonContent.data) {
            setLessonContent(lessonContent.data);
          }

          setIsLoading(false);
        }
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
        setIsLoading(false);
      }
    };
    initializePage();
  }, [isSignedIn, user]);

  const handleTitleUpdate = (updatedTitle: string) => {
    setLesson((prevLesson: SupabaseResponse<any[]> | undefined) => ({
      ...prevLesson!,
      data: [{ ...(prevLesson?.data?.[0] ?? {}), title: updatedTitle }],
    }));
  };

  const handleQuizContentUpdate = (updatedQuizContent: string) => {
    setLesson((prevLesson: SupabaseResponse<any[]> | undefined) => ({
      ...prevLesson!,
      data: [{ ...(prevLesson?.data?.[0] ?? {}), content: updatedQuizContent }],
    }));
  };

  const handleDescriptionUpdate = (updatedDescription: string) => {
    setLesson((prevLesson: SupabaseResponse<any[]> | undefined) => ({
      ...prevLesson!,
      data: [
        { ...(prevLesson?.data?.[0] ?? {}), description: updatedDescription },
      ],
    }));
  };

  const onPublishUpdate = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }

      const newPublishStatus = !lesson?.data?.[0]?.is_published; // Invert the current publish status

      const data = await EnrollmentService.updateLessonPublishStatus({
        lessonId: Number(lessonId),
        userId,
        is_published: newPublishStatus,
        token,
      });

      if (data.error) {
        console.error(data.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      } else {
        // Success case, handle as needed
        console.log(
          "Lesson is now",
          newPublishStatus ? "published" : "unpublished",
        );
        toast.success(
          `Lesson is now ${newPublishStatus ? "published" : "unpublished"}`,
        );
        const lessonData = await EnrollmentService.getLessonById({
          userId,
          lessonId,
          token,
        });
        setLesson(lessonData);
      }
    } catch (error) {
      console.error("[updateLessonPublishStatus ERROR]: ", error);
      toast.error("Something went wrong while updating the publish status");
    }
  };

  const onDeleteLesson = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }

      const data = await EnrollmentService.deleteLesson({
        lessonId: Number(lessonId),
        userId,
        token,
      });

      if (data.error) {
        console.error(data.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      } else {
        // Success case, handle as needed
        console.log("Lesson is now deleted");
        toast.success("Lesson is now deleted");
        window.location.href = `/teacher/courses/${courseId}/modules/${moduleId}`;
      }
    } catch (error) {
      console.error("[deleteLesson ERROR]: ", error);
      toast.error("Something went wrong while deleting the lesson");
    }
  };

  const handleContentUpdate = async (content: string) => {
    const userAuth = { userId: userId, token: token };
    console.log("to be update content: ", content);
    const updatedContent = await LessonService.updateLessonContent(
      userAuth,
      moduleId,
      lessonId,
      content,
    );
    console.log("after update : ", updatedContent);
    setLessonContent(updatedContent.data);
  };

  const handleContentTypeUpdate = async (
    event: any,
    newContentType: string,
  ) => {
    const userAuth = { userId: userId, token: token };
    if (newContentType !== null) {
      if (
        window.confirm(
          "By changes content type all data will be deleted, Are you sure you want to change",
        )
      ) {
        const updatedContent = await LessonService.updateLessonContentType(
          userAuth,
          moduleId,
          lessonId,
          newContentType,
        );
        console.log("updated Content", updatedContent.data);
        setLessonContent(updatedContent.data);
      } else {
        // do nothing
      }
    }
  };

  const handleIsModified = (value: boolean) => {
    setIsModified(value);
  };

  const handleSubmit = (formData: any) => {
    // Handle form submission here, formData contains the quiz data
    console.log("Quiz data:", formData);
    setResult(formData); // Set the result state
  };

  if (isLoading) {
    // Render skeleton loading UI while data is being fetched
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-screen-md p-8 bg-white rounded shadow-md">
          {/* Main content area */}
          <div className="animate-pulse">
            {/* Placeholder for main content */}
            <div className="h-12 mb-6 bg-gray-200 rounded"></div>
            <div className="h-8 mb-4 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderCustomResultPage = (obj: any) => {
    console.log(obj);
    return (
      <div>
        This is a custom result page. You can use obj to render your custom
        result page
      </div>
    );
  };

  const setQuizResult = (obj: any) => {
    console.log(obj);
    // YOUR LOGIC GOES HERE
  };

  const quiz = lesson?.data?.[0]?.content;

  let parsedQuiz = {};

  if (Object(parsedQuiz).length > 0) {
    try {
      parsedQuiz = JSON.parse(quiz);
    } catch (error) {
      console.error("Error parsing quiz JSON:", error);
    }
  }

  return (
    <div className="pt-[68px]">
      {!lesson?.data?.[0]?.is_published && (
        <Banner label="This lesson is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6 mt-6 flex flex-col md:flex-row">
        {" "}
        {/* Add mt-6 and flex classes */}
        <div className="md:w-1/2 md:pr-6">
          {" "}
          {/* Adjust width and padding for medium screens */}
          <div className="flex items-center gap-x-2">
            <h2 className="text-xl">Customize your lesson</h2>
            <Button
              onClick={onPublishUpdate}
              disabled={false}
              variant="outline"
              size="sm"
            >
              {lesson?.data?.[0]?.is_published ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDeleteLesson}>
              <Button size="sm" disabled={false}>
                <Trash className="h-4 w-4" />
              </Button>
            </ConfirmModal>
          </div>
          <TitleForm
            initialData={{ title: lesson?.data?.[0]?.title || "" }}
            lessonId={lessonId}
            token={token}
            userId={userId}
            onTitleUpdate={handleTitleUpdate} // Pass the callback function
          />
          <DescriptionForm
            initialData={{
              description: lesson?.data?.[0]?.description || "",
            }}
            lessonId={lessonId}
            token={token}
            userId={userId}
            onDescriptionUpdate={handleDescriptionUpdate} // Pass the callback function
          />
          {/* <VideoForm userId={userId} courseId={courseId} /> */}
        </div>
      </div>

      {/* <div className="rounded-md p-4 box-border m-6 h-full bg-red-600 py-10"> */}
      <div className=" mx-6  bg-slate-100 rounded-md">
        {/* <p>Is Modified: {isModified ? "true" : "false"}</p>
          <p>Content Type: {lessonContent.content_type}</p> */}
        <div className="border gray-200 rounded-md p-3">
          <h3 className="font-medium ">Content Type</h3>
          <Stack spacing={4} className="my-4">
            <ToggleButtonGroup
              value={lessonContent.content_type}
              exclusive
              onChange={handleContentTypeUpdate}
            >
              <ToggleButton value="article">Article</ToggleButton>
              <ToggleButton value="video">Video</ToggleButton>
              <ToggleButton value="quiz">Quiz</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </div>
        <div className="box-border m-6 min-h-[700px] flex flex-col ">
          <div>
            {lessonContent.content_type === "article" && (
              <div className="h-full flex-grow bg-slate-100 rounded-md border border-t-0 border-gray-200  mt-3">
                <TextEditor
                  token={token}
                  content={lessonContent.content}
                  handleContentUpdate={handleContentUpdate}
                  handleIsModified={handleIsModified}
                  isModified={isModified}
                />
              </div>
            )}
            {lessonContent.content_type === "video" && (
              <VideoForm userId={userId} courseId={courseId} />
            )}
            {lessonContent.content_type === "quiz" && (
              <QuizComponentForm
                initialData={{ content: lesson?.data?.[0]?.content || "" }}
                lessonId={lessonId}
                token={token}
                userId={userId}
                onQuizContentUpdate={handleQuizContentUpdate} // Pass the callback function
              />
            )}
          </div>
          <div>
            {Object.keys(parsedQuiz).length > 0 && (
              <Quiz
                quiz={parsedQuiz}
                showDefaultResult={true}
                onComplete={setQuizResult}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonIdPage;
