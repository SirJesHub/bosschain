import { useState, useEffect } from "react";
import { Block, BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/react/style.css";
import "./TextEditor.css";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { supabaseClient } from "../../../../lib/supabase/supabaseClient";

export default function TextEditor({
  content,
  userAuth,
}: {
  content: any;
  userAuth: any;
}) {
  const [blocks, setBlocks] = useState<any>(JSON.parse(content));

  async function uploadFile(file: File): Promise<any> {
    if (!userAuth.token)
      return {
        data: null,
        statusCode: StatusCodes.UNAUTHORIZED,
        statusMessage: ReasonPhrases.UNAUTHORIZED,
        error: "Where is your Clerk token?!!",
      };

    const supabase = await supabaseClient(userAuth.token);

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

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: blocks,
    // uploadFile,

    // Converts the editor's contents to an array of Block objects.
    // JSON.stringify(editor.topLevelBlocks)
    // setBlocks()
  });
  return (
    <div>
      <BlockNoteView editor={editor} editable={false} theme="light" />
    </div>
  );
}
