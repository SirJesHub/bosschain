"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Banner } from "@/components/banner";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRoleContext } from "@/context/roleContext";
import { SupabaseResponse } from "@/models/requestModels";
import { BucketService } from "@/lib/supabase/BucketRequests";
import Form, { FormProps } from "react-bootstrap/Form";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { LessonsForm } from "./_components/lessons-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Trash } from "lucide-react";

const ModuleIdPage = () => {
  const { role } = useRoleContext();
  const { user, isSignedIn } = useUser();
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const [module, setModule] = useState<SupabaseResponse<Array<any>>>();
  const [token, setToken] = useState<string>("");
  const [imageUrlList, setImageUrlList] = useState<Array<String>>([]);
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(true); // State for loading status
  const [queryParam, setQueryParam] = useState<string>(
    `?timestamp=${new Date().getTime()}`,
  ); // temporary hack to trigger reload image

  useEffect(() => {
    const initializePage = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken({ template: "supabase" });
          setToken(token || "");
          const moduleId = window.location.pathname.split("/").pop() || "";
          const moduleData = await EnrollmentService.getModuleById({
            userId,
            moduleId,
            token,
          });
          setModule(moduleData);
          console.log(moduleData.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
        setIsLoading(false);
      }
    };
    initializePage();
  }, [isSignedIn, user]);

  const moduleId = window.location.pathname.split("/").pop() || "";
  const pathParts = window.location.pathname.split("/");
  const courseIdIndex = pathParts.indexOf("courses") + 1;
  const courseId = pathParts[courseIdIndex];

  // Callback function to handle title update
  // Change the type of `prevCourse` to `SupabaseResponse<any[]> | undefined`
  // Change the type of `prevCourse` to `SupabaseResponse<any[]> | undefined`
  const handleTitleUpdate = (updatedTitle: string) => {
    setModule((prevModule: SupabaseResponse<any[]> | undefined) => ({
      ...prevModule!,
      data: [{ ...(prevModule?.data?.[0] ?? {}), title: updatedTitle }],
    }));
  };

  const handleDescriptionUpdate = (updatedDescription: string) => {
    setModule((prevModule: SupabaseResponse<any[]> | undefined) => ({
      ...prevModule!,
      data: [
        { ...(prevModule?.data?.[0] ?? {}), description: updatedDescription },
      ],
    }));
  };

  const onPublishUpdate = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }

      const newPublishStatus = !module?.data?.[0]?.is_published; // Invert the current publish status

      const data = await EnrollmentService.updateModulePublishStatus({
        moduleId: Number(moduleId),
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
          "Module is now",
          newPublishStatus ? "published" : "unpublished",
        );
        toast.success(
          `Module is now ${newPublishStatus ? "published" : "unpublished"}`,
        );
        const moduleData = await EnrollmentService.getModuleById({
          userId,
          moduleId,
          token,
        });
        setModule(moduleData);
      }
    } catch (error) {
      console.error("[updateModulePublishStatus ERROR]: ", error);
      toast.error("Something went wrong while updating the publish status");
    }
  };

  const onDeleteModule = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }

      const data = await EnrollmentService.deleteModule({
        moduleId: Number(moduleId),
        userId,
        token,
      });

      if (data.error) {
        console.error(data.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      } else {
        // Success case, handle as needed
        console.log("Module is now deleted");
        toast.success("Module is now deleted");
        window.location.href = `/teacher/courses/${courseId}`;
      }
    } catch (error) {
      console.error("[deleteModule ERROR]: ", error);
      toast.error("Something went wrong while deleting the module");
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
      {!module?.data?.[0]?.is_published && (
        <Banner label="This module is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6 mt-6 flex flex-col md:flex-row">
        {" "}
        {/* Add mt-6 and flex classes */}
        <div className="md:w-1/2 md:pr-6">
          {" "}
          {/* Adjust width and padding for medium screens */}
          <div className="flex items-center gap-x-2">
            <h2 className="text-xl">Customize your module</h2>
            <Button
              onClick={onPublishUpdate}
              disabled={false}
              variant="outline"
              size="sm"
            >
              {module?.data?.[0]?.is_published ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDeleteModule}>
              <Button size="sm" disabled={false}>
                <Trash className="h-4 w-4" />
              </Button>
            </ConfirmModal>
          </div>
          <TitleForm
            initialData={{ title: module?.data?.[0]?.title || "" }}
            moduleId={moduleId || ""}
            token={token}
            userId={userId}
            onTitleUpdate={handleTitleUpdate} // Pass the callback function
          />
          <DescriptionForm
            initialData={{
              description: module?.data?.[0]?.description || "",
            }}
            moduleId={moduleId || ""}
            token={token}
            userId={userId}
            onDescriptionUpdate={handleDescriptionUpdate} // Pass the callback function
          />
          <LessonsForm
            initialData={{
              lessons: [
                {
                  lesson_id: "1",
                  title: "Module 1",
                  isPublished: true,
                  isFree: false,
                },
                {
                  lesson_id: "2",
                  title: "Module 2",
                  isPublished: false,
                  isFree: true,
                },
                // Add more modules as needed
              ],
            }}
            moduleId={moduleId || ""}
            courseId={courseId || ""}
            token={token}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
};

export default ModuleIdPage;
