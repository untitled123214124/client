import { getComments, saveComment } from "@/api/comments";

export const HandleGetComments = async (
    postId: string,
  ) => {
    if (!postId) return;
  
    try {
      const response = await getComments(postId);
      if (response) {
        return response
      } else {
        throw new Error("Invalid response format or missing postId.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
};

export const HandleSaveComment = async (content: string) => {
  try {
    const response = await saveComment(content);
    if (response) {
      return response;
    } else {
      throw new Error("Invalid response format or missing comment content.");
    }
  } catch (error) {
    console.error("Error saving comment:", error);
    throw error;
  }
};