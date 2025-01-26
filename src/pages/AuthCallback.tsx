import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/stores/userStore";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code");
    const getCookieValue = (cookieName) => {
      const cookies = document.cookie.split("; ");
      const cookie = cookies.find((row) => row.startsWith(cookieName + "="));
      return cookie ? cookie.split("=")[1] : null;
    };

    if (code) {
      const handleLoginSuccess = async (code: string) => {
        try {
          console.log("GitHub 인증 코드:", code);

          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/auth/github/callback?code=${code}`
          );

          if (response.ok) {
            const data = await response.json();
            console.log("로그인 성공 데이터:", data);
            const accessToken = getCookieValue("accessToken");
            const refreshToken = getCookieValue("refreshToken");

            if (accessToken) {
              localStorage.setItem("accessToken", accessToken);
            }

            if (refreshToken) {
              localStorage.setItem("refreshToken", refreshToken);
            }         
            localStorage.setItem("userInfo", JSON.stringify(data.user));

            useUserStore.setState({
              username: data.user.username,
              id: data.user.id,
              avatar_url: data.user.avatar_url,
              userStatus: "SIGNED_IN",
            });

            console.log(accessToken, refreshToken, data.user)

            navigate("/board");
          } else {
            console.error("Login callback failed:", await response.text());
            alert("로그인 실패");
          }
        } catch (error) {
          console.error("Error during login callback:", error);
          alert("로그인 중 에러가 발생했습니다.");
        }
      };

      handleLoginSuccess(code);
    } else {
      console.error("GitHub 인증 코드가 URL에 없습니다.");
      alert("GitHub 인증 코드가 없습니다.");
    }
  }, [navigate]);

  return <div>처리 중입니다...</div>;
};

export default AuthCallback;