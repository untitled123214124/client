import axios from "axios";

export const getPosts = async (boardId: string, currentPage: number) => {
  const response = await axios.get(`http://localhost:5000/boards/${boardId}/posts`, {
    params: { currentPage },
  });
  return response.data;   
};

export const getPost = async (boardId: string, postId: string) => {
  const response = await axios.get(
    `http://localhost:5000/boards/${boardId}/posts/${postId}`
  );
  return response.data;
};

export const savePost = async (boardId: string, title: string, content: string) => {
  if (!boardId) throw new Error("Board ID is required.");
  if (!title.trim()) throw new Error("Title cannot be empty.");
  if (!content.trim()) throw new Error("Content cannot be empty.");

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Access token is missing.");

  const response = await axios.post(
    `http://localhost:5000/boards/${boardId}/posts/`,
    { title, content },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    }
  );
  return response.data;
};

export const editPost = async (
  postId: string,
  title: string,
  content: string
) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) throw new Error("Access token is missing.");

  try {
    const response = await axios.put(
      `http://localhost:5000/posts/${postId}`,
      { title, content },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing post:", error);
    throw error; 
  }
};

export const deletePost = async (boardId: string, postId: string) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Access token is missing.");

  try {
    const response = await axios.delete(
      `http://localhost:5000/boards/${boardId}/posts/${postId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      return true;
    }
    throw new Error("Failed to delete post.");
  } catch (err) {
    console.error("Error deleting post:", err);
    throw err;
  }
};
