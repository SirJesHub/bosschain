import { useState, useEffect } from "react";
import { Block, BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import "./TextEditor.css";
import { lessonContent } from "../mockData/lessonContent";
import pako from "pako";

export default function App() {
  // Stores the editor's contents as an array of Block objects.
  const x = JSON.stringify(lessonContent);
  const compressed = pako.deflate(x, { to: "string" });
  const y = pako.inflate(compressed, { to: "string" });
  const z = JSON.parse(y)
  const [blocks, setBlocks] = useState<any>(z);

  //  const y = pako.inflate(compressed, {to:"string"})
  //  console.log("deflated:",y)

  // useEffect(() => {
  //   // Fetch your block data (this is just a dummy example)
  //   const fetchedBlocks = [
  //     {
  //       id: "4727ab91-dc61-46eb-99f8-f86a498a1da0",
  //       type: "paragraph",
  //       props: {
  //         textColor: "default",
  //         backgroundColor: "default",
  //         textAlignment: "left",
  //       },
  //       content: [{ type: "text", text: "adsfasf", styles: {} }],
  //       children: [],
  //     },
  //     {
  //       id: "b69e06c7-d6d8-4105-a1e1-3bc96fcc9ad7",
  //       type: "paragraph",
  //       props: {
  //         textColor: "default",
  //         backgroundColor: "default",
  //         textAlignment: "left",
  //       },
  //       content: [{ type: "text", text: "asdfas", styles: {} }],
  //       children: [],
  //     },
  //     {
  //       id: "2e8bb802-5563-44e5-86a0-10d5569942fa",
  //       type: "paragraph",
  //       props: {
  //         textColor: "default",
  //         backgroundColor: "default",
  //         textAlignment: "left",
  //       },
  //       content: [],
  //       children: [],
  //     },
  //   ];

  //   setBlocks(fetchedBlocks);
  // }, []); // Empty dependency array to run this effect only once

  const editor: BlockNoteEditor = useBlockNote({
    editable: true,
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
