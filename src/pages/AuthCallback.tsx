import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/stores/userStore";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code");

    if (code) {
      const handleLoginSuccess = async (code: string) => {
        try {
          console.log("GitHub 인증 코드:", code);

          const response = await fetch(
            `http://localhost:5000/auth/github/callback?code=${code}`
          );

          if (response.ok) {
            const data = await response.json();
            console.log("로그인 성공 데이터:", data);
            
            localStorage.setItem("accessToken", data.token.accessToken);
            localStorage.setItem("userInfo", JSON.stringify(data.user));

            useUserStore.setState({
              username: data.user.username,
              id: data.user.id,
              avatar_url: data.user.avatar_url,
              userStatus: "SIGNED_IN",
            });

            console.log(data.token.accessToken, data.user);
            navigate("/profile");

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