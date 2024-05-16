import { useState, useEffect, useRef } from "react";
import { Block, BlockNoteEditor } from "@blocknote/core";
import { Button } from "@/components/ui/button";
import { BlockNoteView } from "@blocknote/mantine";
import toast from "react-hot-toast";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "./TextEditor.css";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { supabaseClient } from "../../../../../../../../../lib/supabase/supabaseClient";
import { LessonService } from "@/lib/supabase/lessonRequests";
import { Pencil } from "lucide-react";

export default function TextEditor({
  content,
  token,
  handleContentUpdate,
  handleIsModified,
  isModified,
}: {
  content: any;
  token: any;
  handleContentUpdate: Function;
  handleIsModified: Function;
  isModified: boolean;
}) {
  const [blocks, setBlocks] = useState<any>(JSON.parse(content));
  const editorRef = useRef<BlockNoteEditor>(null);
  const originalContent = useRef<any>(JSON.parse(content));
  const [isEditing, setIsEditing] = useState(false);

  // useEffect(()=>{
  //   setBlocks(JSON.parse(content));
  // },[content])
  // isEditing true
  const toggleEdit = () => {
    if (isEditing) {
      // If currently editing, cancel and restore original conten
      setBlocks(originalContent.current);
      console.log(originalContent.current);
    }

    setIsEditing((current) => !current);
  };

  async function uploadFile(file: File): Promise<any> {
    if (!token)
      return {
        data: null,
        statusCode: StatusCodes.UNAUTHORIZED,
        statusMessage: ReasonPhrases.UNAUTHORIZED,
        error: "Where is your Clerk token?!!",
      };

    const supabase = await supabaseClient(token);

    try {
      const { data, error } = await supabase.storage
        .from("course_assets")
        .upload(`/${file.name}`, file, {
          contentType: file.type,
        });

      if (error) {
        return {
          data: null,
          error: error.message,
        };
      }

      const uploadedFileUrl = supabase.storage
        .from("course_assets")
        .getPublicUrl(data.path);

      if (!uploadedFileUrl.data) {
        throw new Error("Failed to get public URL for uploaded file.");
      }

      return uploadedFileUrl.data.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  const saveChanges = () => {
    handleContentUpdate(blocks);
    handleIsModified(false);
    originalContent.current = blocks;
    setIsEditing(false);
    toast.success("Article updated successfully!");
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: blocks,
    uploadFile,

    // Converts the editor's contents to an array of Block objects.
    // JSON.stringify(editor.topLevelBlocks)
    // setBlocks()
  });

  // const editorChangeHandler()=>{

  //    onEditorContentChange: (editor:any) => {
  //     setBlocks(editor.topLevelBlocks);
  //     if (JSON.stringify(editor.topLevelBlocks) !== JSON.stringify(originalContent.current)) {
  //       handleIsModified(true); // Set isModified to true when content changes
  //     } else {
  //       handleIsModified(false); // Reset isModified if content is back to original state
  //     }
  //   },

  // }

  return (
    <div className="h-full flex flex-col flex-grow">
      <div className="sticky top-16 z-40 bg-white  rounded  overflow-hidden">
        <div className="font-medium flex items-center justify-between bg-slate-100 py-3 px-3 rounded-md  border border-gray-200">
          Article
          <div className=" flex flex-row gap-5">
            <Button onClick={toggleEdit} variant="ghost">
              {isEditing ? (
                <>Cancel</>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit article
                </>
              )}
            </Button>
            <Button disabled={!isModified} onClick={saveChanges}>
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className=" rounded-md flex-grow  ">
        <BlockNoteView
          className=""
          editor={editor}
          editable={isEditing ? true : false}
          theme="light"
          onChange={() => {
            // Saves the document JSON to state.

            if (
              JSON.stringify(editor.document) !==
              JSON.stringify(originalContent.current)
            ) {
              handleIsModified(true); // Set isModified to true when content changes
            } else {
              handleIsModified(false); // Reset isModified if content is back to original state
            }
            setBlocks(editor.document);
          }}
        />
      </div>
    </div>
  );
}
