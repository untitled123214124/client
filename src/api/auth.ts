import axios from "axios";

export const loginWithGithub = async (code: string) => {
  const response = await axios.get(`http://localhost:5000/auth/github/callback`, {
    params: { code },
  });
  return response.data;
};
