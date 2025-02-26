import { useState } from "react";
import { like } from "@/api/likes";

export const HandleLike = (boardId: string, postId: string, initialLikeCount: number) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);
  const [error, setError] = useState<string | null>(null);

  const handleLike = async () => {
    try {
      const response = await like(boardId, postId);
      
      if (response) {
        setLiked((prevLiked) => {
          const newLikedState = !prevLiked;
          setLikeCount((prevCount) => (newLikedState ? prevCount + 1 : prevCount - 1));
          return newLikedState;
        });
      } else {
        throw new Error("Failed to update the like status.");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
    }
  };

  return {
    liked,
    likeCount,
    error,
    handleLike,
  };
};
