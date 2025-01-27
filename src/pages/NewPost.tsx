import { useRef, useEffect, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";

function NewPost() {
  const editorRef = useRef<EditorJS | null>(null);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [boardId, setBoardId] = useState<string | null>(null); // boardId 상태 추가
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
      if (editorRef.current) {
        editorRef.current.isReady
          .then(() => {
            editorRef.current?.destroy();
            editorRef.current = null;
          })
          .catch((error) => console.error("Editor cleanup error:", error));
      }
    };
  }, []);

  const validateForm = () => {
    if (!title.trim()) {
      setError("Title cannot be empty.");
      return false;
    }
    if (!boardId) {
      setError("Board ID is required.");
      return false;
    }
    if (!editorRef.current) {
      setError("Editor is not ready.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setError("");

    try {
      const savedData = await editorRef.current.save();

      let accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Access token is missing.");
      }

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content: JSON.stringify(savedData.blocks),
        }),
      };

      let response = await fetch(`http://localhost:5000/boards/${boardId}/posts/`, requestOptions);

      if (response.status === 401) {
        const refreshResponse = await fetch("http://localhost:5000/auth/refresh-token", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          accessToken = data.accessToken;
          localStorage.setItem("accessToken", accessToken);

          requestOptions.headers["Authorization"] = `Bearer ${accessToken}`;
          response = await fetch(`http://localhost:5000/boards/${boardId}/posts/`, requestOptions);
        } else {
          throw new Error("Failed to refresh access token.");
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save the post.");
      }

      navigate(`/boards/${boardId}/posts`);
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
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
        <div>
          <Select onValueChange={(value) => setBoardId(value)}>
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Select a board category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="toy">Toy</SelectItem>
                <SelectItem value="code">Code</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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