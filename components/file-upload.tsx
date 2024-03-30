import React from "react";
import axios from "axios";
import { useDropzone, DropzoneOptions } from "@uploadthing/react";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: string; // Endpoint URL for file upload
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  endpoint,
}: FileUploadProps) => {
  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        const response = await axios.post(endpoint, formData);
        onChange(response.data.url);
        toast.success("File uploaded successfully!");
      } catch (error) {
        toast.error(`Error uploading file: ${(error as Error).message}`);
      }
    },
    [onChange, endpoint],
  );

  // Define the accept property as a string array
  const accept: string[] = ["image/*"];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept, // Use the defined type for the accept property
    multiple: false, // Set to true if you want to allow multiple file uploads
  });

  return (
    <div {...getRootProps()} style={dropzoneStyle}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here...</p>
      ) : (
        <p>Drag drop a file here, or click to select a file</p>
      )}
    </div>
  );
};

const dropzoneStyle: React.CSSProperties = {
  border: "2px dashed #ccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  margin: "20px 0",
};
