import React, { useState, useEffect, ChangeEvent } from "react";
import { BucketService } from "@/lib/supabase/BucketRequests";
import Form from "react-bootstrap/Form";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "react-hot-toast";

interface DropzoneProps {
  previews: React.ReactNode; // Adjust the type as per your previews content
  submitButton: React.ReactNode; // Adjust the type as per your submitButton content
  input: React.ReactNode; // Adjust the type as per your input content
  files: any[]; // Adjust the type according to your files array
  dropzoneProps: {
    ref: React.RefObject<HTMLDivElement>;
    className: string;
    style?: React.CSSProperties; // Make style property optional
  };
}

const NoDropzoneLayout: React.FC<DropzoneProps> = ({
  previews,
  submitButton,
  input,
  files,
  dropzoneProps,
}) => {
  const { ref, className, style } = dropzoneProps;
  return (
    <div ref={ref} className={className} style={style || {}}>
      {previews}
      {input}
      {files.length > 0 && submitButton}
    </div>
  );
};

interface VideoFormProps {
  userId: string;
  courseId: string;
}

const VideoForm: React.FC<VideoFormProps> = ({ userId, courseId }) => {
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const [isUploading, setIsUploading] = useState(false);
  const [queryParam, setQueryParam] = useState<string>(
    `?timestamp=${new Date().getTime()}`,
  ); // temporary hack to trigger reload video

  const getUploadParams = () => {
    return { url: "https://httpbin.org/post" };
  };

  const pathParts = window.location.pathname.split("/");
  const moduleIndex = pathParts.indexOf("modules") + 1;
  const lessonIndex = pathParts.indexOf("lessons") + 1;

  const moduleId = pathParts[moduleIndex];
  const lessonId = pathParts[lessonIndex];

  const handleChangeStatus = (file: any, status: any, allFiles: any): void => {
    if (status === "done") {
      console.log("File uploaded successfully:", file.meta);
      const formData = new FormData();
      formData.append("file", file.file);

      console.log("start upload");
      console.log("uploading");
      setIsUploading(true); //If this code is removed, There will not be the progress bar appearing on screen. Confusing!

      getToken({ template: "supabase" })
        .then((token) => {
          BucketService.uploadVideoFile({
            token,
            userId,
            courseId: Number(courseId),
            moduleId: Number(moduleId),
            lessonId: Number(lessonId),
            file: file.file,
          })
            .then(() => {
              console.log("successful");
              toast.success("Video updated successfully!");
              setQueryParam(`?timestamp=${new Date().getTime()}`);
              toggleEdit();
              setIsUploading(false);
              // Clear the files in the Dropzone component after upload
              allFiles.forEach((f: any) => f.remove());
            })
            .catch((error) => {
              console.error("Error uploading file:", error);
              toast.error("Something went wrong. Please try again");
            });
        })
        .catch((error) => {
          console.error("Error getting token:", error);
          toast.error("Something went wrong. Please try again");
        });
    } else if (status === "error") {
      console.error("File upload error:", file.meta);
      toast.error("Something went wrong. Please try again");
    }
  };

  const handleSubmit = (
    files: Array<{ meta: any }>,
    allFiles: Array<{ remove: () => void }>,
  ) => {
    console.log(files.map((f) => f.meta));
    allFiles.forEach((f) => f.remove());
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lesson video
        {!isUploading && ( // Render cancel button if not uploading
          <Button onClick={toggleEdit} variant="ghost">
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit video
              </>
            )}
          </Button>
        )}
      </div>
      {isEditing && (
        <div className="mt-2">
          {/* <Dropzone
            getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            maxFiles={1}
            multiple={false}
            canCancel={false}
            LayoutComponent={NoDropzoneLayout}
            inputContent="Click to Choose a File"
            styles={{
              dropzone: { width: 400, height: 200 },
              dropzoneActive: { borderColor: "green" },
            }}
          /> */}
        </div>
      )}
      {!isEditing && (
        <div className="flex justify-center">
          <video
            src={
              process.env.NEXT_PUBLIC_COURSE_ASSETS_BASE_URL +
              "" +
              courseId +
              "/" +
              moduleId +
              "/" +
              lessonId +
              "/video" +
              queryParam
            }
            className="mx-auto"
            controls
          />
        </div>
      )}
    </div>
  );
};

export default VideoForm;
