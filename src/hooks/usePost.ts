import { useState } from "react";
import { getPosts, getPost, editPost, deletePost } from "@/api/posts";

export const usePost = () => {
  const [loading, setLoading] = useState(false);  // 로딩 상태
  const [error, setError] = useState<string | null>(null);  // 에러 상태

  const HandleGetPosts = async (boardId: string, currentPage: number) => {
    if (!boardId) return { posts: [], total: 0 };

    try {
      setLoading(true);
      const response = await getPosts(boardId, currentPage);
      if (response) {
        return response;
      } else {
        throw new Error("Invalid response format or missing posts/total");
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setError(error.message || "Failed to load posts");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const HandleGetPost = async (boardId: string, postId: string) => {
    if (!boardId || !postId) return;

    try {
      setLoading(true);
      const response = await getPost(boardId, postId);
      if (response) {
        return response;
      } else {
        throw new Error("Invalid response format or missing boardId/postId");
      }
    } catch (error: any) {
      console.error("Error fetching post:", error);
      setError(error.message || "Failed to load the post");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const HandleEditPost = async (postId: string, title: string, content: string) => {
    if (!title || !content) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      const updatedPost = await editPost(postId, title, content);
      return updatedPost;
    } catch (error: any) {
      console.error("Error editing post:", error);
      setError(error.message || "Failed to edit the post");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const HandleDeletePost = async (boardId: string, postId: string, navigate: any) => {
    if (!boardId || !postId) return;

    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      setLoading(true);
      const success = await deletePost(boardId, postId);
      if (success) {
        alert("Post deleted successfully.");
        navigate(`/boards/${boardId}`);
      }
    } catch (error: any) {
      console.error("Error deleting post:", error);
      alert(error.message || "An error occurred while deleting the post.");
    } finally {
      setLoading(false);
    }
  };

  return { HandleGetPosts, HandleGetPost, HandleEditPost, HandleDeletePost, loading, error };
};
