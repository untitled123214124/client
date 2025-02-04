import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/stores/userStore";

const useAuth = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const handleLogin = useCallback(
    async (code: string) => {
      try {
        const response = await fetch(
          `http://localhost:5000/auth/github/callback?code=${code}`
        );

        if (response.ok) {
          const data = await response.json();

          localStorage.setItem("accessToken", data.token.accessToken);
          localStorage.setItem("userInfo", JSON.stringify(data.user));

          const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

          setUser(
            userInfo.username,
            userInfo.id,
            userInfo.avatar_url,
            userInfo.bio,
            "SIGNED_IN"
          );

          navigate("/boards/study/posts");
        } else {
          console.error("Login callback failed:", await response.text());
          alert("로그인 실패");
        }
      } catch (error) {
        console.error("Error during login callback:", error);
        alert("로그인 중 에러가 발생했습니다.");
      }
    },
    [navigate, setUser]
  );

  return { handleLogin };
};

export default useAuth;
