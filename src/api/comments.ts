import axios from "axios";

export const getComments = async (postId: string) => {
  const response = await axios.get(`http://localhost:5000/comments/${postId}`, {
  });
  return response
}

export const saveComment = async (content: string) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Access token is missing.");

  const response = await axios.post(
    "http://localhost:5000/comments/",
    { content },
    {
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    }
  );
  return response      
};   