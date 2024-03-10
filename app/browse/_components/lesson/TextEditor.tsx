import { useState, useEffect } from "react";
import { Block, BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import "./TextEditor.css";
import { lessonContent } from "../mockData/lessonContent";

export default function TextEditor({ content }: { content: any }) {
  console.log("CONTENTTTT", content);
  console.log("type", typeof content);
  const [blocks, setBlocks] = useState<any>(JSON.parse(content));

  const editor: BlockNoteEditor = useBlockNote({
    editable: false,
    initialContent: blocks,

    onEditorContentChange: (editor) =>
      // Converts the editor's contents to an array of Block objects.
      // JSON.stringify(editor.topLevelBlocks)
      // setBlocks()
      setBlocks(editor.topLevelBlocks),
  });
  return (
    <div>
      <BlockNoteView editor={editor} theme="light" />
    </div>
  );
}
