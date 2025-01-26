import { Button } from "../ui/button";
import useUserStore from "@/stores/userStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BellIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
  const { username, userStatus } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    console.log(userInfo)
    let authToken = localStorage.getItem("authToken");

    if (userInfo && authToken) {
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

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  const handleBoard = () => {
    navigate("/board");
  };

  const handleMain = () => {
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    useUserStore.setState({ username: "", userStatus: "SIGNED_OUT" });
    navigate("/")
  };

  const [notifications, setNotifications] = useState<any>([
    {
        text: "This is a notification",
        date: "02-01-25",
        read: true,
    },
    {
        text: "This is another notification",
        date: "02-01-25",
        read: false,
    }
])

  return (
    <div className="flex border-b w-screen fixed top-0 p-4 bg-white">
      <h1
        className="text-lg font-bold grow text-left pt-1 hover:cursor-pointer"
        onClick={handleMain}
      >
        DevMate
      </h1>
      <div className="place-self-end">
        <Button variant="link" onClick={handleBoard}>
          Board
        </Button>
        <span className="text-black mr-6">|</span>
        {userStatus === "SIGNED_IN" ? (
          <>
            <Button className="mr-2 bg-white text-black" variant="outline">
              <span aria-hidden="true" onClick={handleProfile}>
                {username}
              </span>
            </Button>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="relative mr-2" variant="outline" size="icon" style={{ transform: 'translateY(2px)' }}>
                    <div className={`absolute -top-2 -right-1 h-3 w-3 rounded-full my-1 ${notifications.find((x: any) => x.read === true) ? 'bg-green-500' : 'bg-neutral-200'}`}></div>
                    <BellIcon className="h-4 w-4"></BellIcon>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {notifications.map((item: any, key: number) => <DropdownMenuItem key={key} className="py-2 px-3 cusor-pointer hover:bg-neutral-50 transition flex items-start gap-2">
                    <div className={`h-3 w-3 rounded-full my-1 ${!item.read ? 'bg-green-500' : 'bg-neutral-200'}`}></div>
                    <div>
                    <p>{item.text}</p>
                    <p className="text-ts text-neutral-500">{item.date}</p>
                    </div>
                </DropdownMenuItem>)}
            </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleSignOut}>Log Out</Button>
          </>
        ) : (
          <Button className="mr-2" onClick={handleGitHubLogin}>
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;