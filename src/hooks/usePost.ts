import { useState, useEffect } from "react";
import { Post } from "@/types/post.type";
import { getPosts, getPost, editPost, deletePost } from "@/api/posts";

export const usePost = (boardId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const HandleGetPosts = async (boardId: string, currentPage: number = 1) => {
    if (!boardId) return { posts: [], total: 0 };

    try {
      setLoading(true);
      setError(null);
      const response = await getPosts(boardId, currentPage);
      if (response) {
        setPosts(response.posts);
        setTotalPosts(response.total);
      } else {
        throw new Error("Invalid response format or missing posts/total");
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setError(error.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    HandleGetPosts(boardId, currentPage);
  }, [boardId, currentPage]);

  const HandleGetPost = async (boardId: string, postId: string) => {
    if (!boardId || !postId) return;

    try {
      setLoading(true);
      const response = await getPost(boardId, postId);
      return response;
      console.log(response)
    } catch (error: any) {
      console.error("Error fetching post:", error);
      setError(error.message || "Failed to load the post");
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
      return await editPost(postId, title, content);
    } catch (error: any) {
      console.error("Error editing post:", error);
      setError(error.message || "Failed to edit the post");
    } finally {
      setLoading(false);
    }
  };

  const HandleDeletePost = async (postId: string, navigate: any) => {
    if (!boardId || !postId) return;

    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      setLoading(true);
      const success = await deletePost(boardId, postId);
      if (success) {
        alert("Post deleted successfully.");
        HandleGetPosts(boardId, currentPage);
        navigate(`/boards/${boardId}`);
      }
    } catch (error: any) {
      console.error("Error deleting post:", error);
      alert(error.message || "An error occurred while deleting the post.");
    } finally {
      setLoading(false);
    }
  };

  return { 
    HandleGetPosts, HandleGetPost, HandleEditPost, HandleDeletePost, 
    posts, totalPosts, currentPage, setCurrentPage, loading, error 
  };
};
