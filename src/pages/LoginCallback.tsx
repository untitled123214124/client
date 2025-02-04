import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useSearchParams } from "react-router-dom";

const LoginCallback = () => {
  const [searchParams] = useSearchParams();
  const { handleLogin } = useAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleLogin(code);
    } else {
      console.error("GitHub 인증 코드가 URL에 없습니다.");
    }
  }, [searchParams, handleLogin]);

  return <div>로그인 중입니다...</div>;
};

export default LoginCallback;
