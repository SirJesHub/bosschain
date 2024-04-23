"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Banner } from "@/components/banner";
import { TitleForm } from "./_components/title-form";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRoleContext } from "@/context/roleContext";
import { SupabaseResponse } from "@/models/requestModels";
import { DescriptionForm } from "./_components/description-form";
import { CategoryForm } from "./_components/category-form";
import { BucketService } from "@/lib/supabase/BucketRequests";
import Form, { FormProps } from "react-bootstrap/Form";
import ImageForm from "./_components/image-form";
import { ModulesForm } from "./_components/modules-form";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import toast from "react-hot-toast";

const CourseIdPage = () => {
  const { role } = useRoleContext();
  const { user, isSignedIn } = useUser();
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [course, setCourse] = useState<SupabaseResponse<Array<any>>>();
  const [token, setToken] = useState<string>("");
  const [imageUrlList, setImageUrlList] = useState<Array<String>>([]);
  const [file, setFile] = useState<File>();
  const [queryParam, setQueryParam] = useState<string>(
    `?timestamp=${new Date().getTime()}`,
  ); // temporary hack to trigger reload image
  const [isLoading, setIsLoading] = useState(true); // State for loading status

  useEffect(() => {
    const initializePage = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken({ template: "supabase" });
          setToken(token || "");
          const courseId = window.location.pathname.split("/").pop() || "";
          const courseData = await EnrollmentService.getCourseById({
            userId,
            courseId,
            token,
          });
          const moduleData = await EnrollmentService.getModuleByCourseId({
            userId,
            courseId,
            token,
          });
          console.log(moduleData.data);
          setCourse(courseData);
          setIsLoading(false); // Set loading state to false when data is fetched
        }
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
        setIsLoading(false); // Set loading state to false in case of error
      }
    };
    initializePage();
  }, [isSignedIn, user]);

  const courseId = window.location.pathname.split("/").pop() || "";

  // Callback function to handle title update
  // Change the type of `prevCourse` to `SupabaseResponse<any[]> | undefined`
  // Change the type of `prevCourse` to `SupabaseResponse<any[]> | undefined`
  const handleTitleUpdate = (updatedTitle: string) => {
    setCourse((prevCourse: SupabaseResponse<any[]> | undefined) => ({
      ...prevCourse!,
      data: [{ ...(prevCourse?.data?.[0] ?? {}), title: updatedTitle }],
    }));
  };

  const handleDescriptionUpdate = (updatedDescription: string) => {
    setCourse((prevCourse: SupabaseResponse<any[]> | undefined) => ({
      ...prevCourse!,
      data: [
        { ...(prevCourse?.data?.[0] ?? {}), description: updatedDescription },
      ],
    }));
  };

  const handleCategoryUpdate = (updatedCategory: string) => {
    setCourse((prevCourse: SupabaseResponse<any[]> | undefined) => ({
      ...prevCourse!,
      data: [{ ...(prevCourse?.data?.[0] ?? {}), category: updatedCategory }],
    }));
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

  const onPublishUpdate = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }

      const newPublishStatus = !course?.data?.[0]?.is_published; // Invert the current publish status

      const data = await EnrollmentService.updateCoursePublishStatus({
        courseId: Number(courseId),
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
          "Course is now",
          newPublishStatus ? "published" : "unpublished",
        );
        toast.success(
          `Course is now ${newPublishStatus ? "published" : "unpublished"}`,
        );

        const date = new Date();
        const isoString = date.toISOString();

        const datePart = isoString.substring(0, 10);
        const timePart = isoString.substring(11, 23);

        const formattedDate = `${datePart} ${timePart}+00`;

        const data = await EnrollmentService.updateCourseLastUpdateAt({
          courseId: Number(courseId),
          userId,
          last_updated_at: formattedDate,
          token,
        });

        const courseData = await EnrollmentService.getCourseById({
          userId,
          courseId,
          token,
        });
        setCourse(courseData);
      }
    } catch (error) {
      console.error("[updateCoursePublishStatus ERROR]: ", error);
      toast.error("Something went wrong while updating the publish status");
    }
  };

  const onDeleteCourse = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }

      const data = await EnrollmentService.deleteCourse({
        courseId: Number(courseId),
        userId,
        token,
      });

      if (data.error) {
        console.error(data.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      } else {
        // Success case, handle as needed
        console.log("Course is now deleted");
        toast.success("Course is now deleted");
        window.location.href = `/teacher/courses/`;
      }
    } catch (error) {
      console.error("[deleteCourse ERROR]: ", error);
      toast.error("Something went wrong while deleting the course");
    }
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

  return (
    <div>
      {!course?.data?.[0]?.is_published && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6 mt-6 flex flex-col md:flex-row">
        {" "}
        {/* Add mt-6 and flex classes */}
        <div className="md:w-1/2 md:pr-6">
          {" "}
          {/* Adjust width and padding for medium screens */}
          <div className="flex items-center gap-x-2">
            <h2 className="text-xl">Customize your course</h2>
            <Button
              onClick={onPublishUpdate}
              disabled={false}
              variant="outline"
              size="sm"
            >
              {course?.data?.[0]?.is_published ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDeleteCourse}>
              <Button size="sm" disabled={false}>
                <Trash className="h-4 w-4" />
              </Button>
            </ConfirmModal>
          </div>
          <TitleForm
            initialData={{ title: course?.data?.[0]?.title || "" }}
            courseId={courseId || ""}
            token={token}
            userId={userId}
            onTitleUpdate={handleTitleUpdate} // Pass the callback function
          />
          <DescriptionForm
            initialData={{
              description: course?.data?.[0]?.description || "",
            }}
            courseId={courseId || ""}
            token={token}
            userId={userId}
            onDescriptionUpdate={handleDescriptionUpdate} // Pass the callback function
          />
          <CategoryForm
            initialData={{
              category: course?.data?.[0]?.category || "",
            }}
            courseId={courseId || ""}
            token={token}
            userId={userId}
            onCategoryUpdate={handleCategoryUpdate} // Pass the callback function
          />
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0">
          {" "}
          {/* Adjust width and margin for medium screens */}
          <h2 className="text-xl">&nbsp;</h2>
          <p className="h-2 w-2">&nbsp;</p>
          <ModulesForm
            initialData={{
              modules: [
                {
                  module_id: "1",
                  title: "Module 1",
                  isPublished: true,
                  isFree: false,
                },
                {
                  module_id: "2",
                  title: "Module 2",
                  isPublished: false,
                  isFree: true,
                },
                // Add more modules as needed
              ],
            }}
            courseId={courseId || ""}
            token={token}
            userId={userId}
          />
          <ImageForm userId={userId} courseId={courseId} />
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
