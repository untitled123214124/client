import { useRef, useEffect, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { useNavigate } from "react-router-dom";

function NewPost() {
  const editorRef = useRef<EditorJS | null>(null);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
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

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title cannot be empty.");
      return;
    }

    if (!editorRef.current) {
      setError("Editor is not ready.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const savedData = await editorRef.current.save();

      let response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/boards/1/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content: JSON.stringify(savedData.blocks),
        }),
      });

      if (response.status === 401) {
        const refreshResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/auth/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        });

        const refreshData = await refreshResponse.json();
        
        if (refreshData.message === "액세스 토큰이 재발급되었습니다") {
          response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/boards/1/posts/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
              title,
              content: JSON.stringify(savedData.blocks),
            }),
          });
        } else {
          throw new Error("Token refresh failed.");
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save the post.");
      }

      navigate(`/board`);
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
