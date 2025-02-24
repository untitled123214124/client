import axios from "axios";

export const login = async (code: string) => {
  const response = await axios.get(`http://localhost:5000/auth/github/callback`, {
    params: { code },
  });
  return response.data;
};
