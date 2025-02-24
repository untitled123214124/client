import axios from "axios";
import useUserStore from "@/stores/userStore";

export const like = async (boardId: string, postId: string) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Access token is missing.");

  const { id } = useUserStore.getState();
  if (!id) throw new Error("User ID is missing.");

  const response = await axios.post(
    `http://localhost:5000/boards/${boardId}/posts/like/${postId}`,
    { userId: id },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    }
  );
  return response;
};
