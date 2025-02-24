import { useRef, useEffect, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { useNavigate } from "react-router-dom";
import { savePost } from "@/api/posts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

function NewPost() {
  const editorRef = useRef<EditorJS | null>(null);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [boardId, setBoardId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const editor = new EditorJS({
      holder: "editor",
      tools: {},
      placeholder: "Write your content here...",
    });

    editorRef.current = editor;

    return () => {
      editorRef.current?.isReady
        .then(() => {
          editorRef.current?.destroy();
          editorRef.current = null;
        })
        .catch(console.error);
    };
  }, []);

  const handleSave = async () => {
    if (!editorRef.current) return setError("Editor is not ready.");

    setIsSaving(true);
    try {
      const savedData = await editorRef.current.save();
      const content =
        savedData?.blocks
          .filter((block) => block.type === "paragraph")
          .map((block) => block.data.text)
          .join("\n") || "";

      await savePost(boardId!, title, content);
      navigate(`/boards/${boardId}/posts`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen p-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded p-4">
        <input
          type="text"
          placeholder="Enter your post title..."
          className="w-full border border-gray-300 rounded p-2 mb-4 text-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Select onValueChange={setBoardId}>
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select a board category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="study">스터디 모집</SelectItem>
              <SelectItem value="toy">토이 프로젝트</SelectItem>
              <SelectItem value="code">코드 리뷰</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div id="editor" className="border border-gray-300 rounded p-4"></div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          onClick={handleSave}
          className={`mt-4 px-4 py-2 text-white rounded ${
            isSaving ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export default NewPost;
