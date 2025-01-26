import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  const handleBoard = () => {
    navigate("/board");
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-[calc(100vh-8rem)] mt-[18px]">
      <h1 className="text-5xl">Welcome to DevMate <br /> Where Young <br /> Developers Grow <br /> Together! </h1>
      <h3 className="mt-10 text-left">
            Join our friendly community of young programmers. Share <br /> projects, learn together, and get helpful feedback from peers.
      </h3>
      <Button onClick={handleGitHubLogin}>Get Started with Github</Button>
      <Button className="bg-gray-50 text-black" onClick={handleBoard}>View Boards</Button>  
    </div>
  )
}

export default Main