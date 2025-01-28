import { Button } from "../ui/button";
import useUserStore from "@/stores/userStore";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";
import useSignOut from "@/hooks/useSignOut";
import useNotifications from "@/hooks/useNotifications";

const Header = () => {
  useAuth();

  const { username, userStatus } = useUserStore();
  const navigate = useNavigate();

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  const handleMain = () => {
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleBoardChange = (boardId: string) => {
    navigate(`/boards/${boardId}/posts`);
  };

  const handleSignOut = useSignOut();
  const { notifications } = useNotifications();

  return (
    <div className="flex border-b w-screen fixed top-0 p-4 bg-white">
      <h1
        className="text-lg font-bold text-left pt-1 hover:cursor-pointer"
        onClick={handleMain}
      >
        DevMate
      </h1>
      <span className="text-black mt-2 ml-6">|</span>
      <div className="grow">
        <Button variant="link" onClick={() => handleBoardChange("study")}>
          Study
        </Button>
        <Button variant="link" onClick={() => handleBoardChange("toy")}>
          Toy
        </Button>
        <Button variant="link" onClick={() => handleBoardChange("code")}>
          Code
        </Button>
      </div>
      <div className="place-self-end">
        {userStatus === "SIGNED_IN" ? (
          <>
            <Button className="mr-2 bg-white text-black" variant="outline">
              <span aria-hidden="true" onClick={handleProfile}>
                {username}
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="relative mr-2"
                  variant="outline"
                  size="icon"
                  style={{ transform: "translateY(2px)" }}
                >
                  <div
                    className={`absolute -top-2 -right-1 h-3 w-3 rounded-full my-1 ${
                      notifications.find((x: any) => x.read === true)
                        ? "bg-green-500"
                        : "bg-neutral-200"
                    }`}
                  ></div>
                  <Bell className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {notifications.map((item: any, key: number) => (
                  <DropdownMenuItem
                    key={key}
                    className="py-2 px-3 cusor-pointer hover:bg-neutral-50 transition flex items-start gap-2"
                  >
                    <div
                      className={`h-3 w-3 rounded-full my-1 ${
                        !item.read ? "bg-green-500" : "bg-neutral-200"
                      }`}
                    ></div>
                    <div>
                      <p>{item.text}</p>
                      <p className="text-ts text-neutral-500">{item.date}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
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