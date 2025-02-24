import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/stores/userStore";
import { loginWithGithub } from "@/api/auth";

const useAuth = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const handleLogin = useCallback(
    async (code: string) => {
      try {
        const { token, user } = await loginWithGithub(code);

        localStorage.setItem("accessToken", token.accessToken);
        localStorage.setItem("userInfo", JSON.stringify(user));

        setUser(user.username, user.id, user.avatar_url, user.bio, "SIGNED_IN");

        navigate("/boards/study/posts");
      } catch (error) {
        console.error("로그인 오류:", error);
        alert("로그인 중 문제가 발생했습니다.");
      }
    },
    [navigate, setUser]
  );

  return { handleLogin };
};

export default useAuth;
