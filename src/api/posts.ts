import axios from "axios";
import { Post } from "@/types/post.type";

export const getPosts = async (boardId: string, currentPage: number) => {
  try {
    const response = await axios.get(`http://localhost:5000/boards/${boardId}/posts`, {
      params: { currentPage },
    });

    if (
      response.data &&
      Array.isArray(response.data.posts) &&
      typeof response.data.total === "number"
    ) {
      return {
        posts: response.data.posts as Post[],
        total: response.data.total as number,
      };
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getPost = async (boardId: string, postId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/boards/${boardId}/posts/${postId}`
    );
    
    if (response.data && response.data.post) {
      return {
        success: true,
        post: response.data.post,
      };
    } else {
      throw new Error("Post not found");
    }
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return {
      success: false,
      error: error.message || "Failed to load the post",
    };
  }
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

export const deletePost = async (boardId: string, postId: string) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    if (!accessToken) {
      throw new Error("User is not authenticated.");
    }

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
    } else {
      throw new Error("Failed to delete post.");
    }
  } catch (err) {
    console.error("Error deleting post:", err);
    alert("Failed to delete post.");
    return false;
  }
};
