// 로그인 로직
import { useEffect } from "react";
import useUserStore from "@/stores/userStore";

const useAuth = () => {
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const accessToken = localStorage.getItem("accessToken");

    if (userInfo && accessToken) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        useUserStore.setState({
          username: parsedUserInfo.username,
          userStatus: "SIGNED_IN",
        });
      } catch (error) {
        console.error("Failed to parse userInfo:", error);
        useUserStore.setState({
          userStatus: "SIGNED_OUT",
          username: "",
        });
      }
    } else {
      useUserStore.setState({
        userStatus: "SIGNED_OUT",
        username: "",
      });
    }
  }, []);
};

export default useAuth;
