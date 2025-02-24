import { useNavigate } from "react-router-dom";
import useUserStore from "@/stores/userStore";

const useSignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    useUserStore.setState({ username: "", userStatus: "SIGNED_OUT" });
    navigate("/");
  };

  return handleSignOut;
};

export default useSignOut;
