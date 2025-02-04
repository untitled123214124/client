import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Main = () => {
  const navigate = useNavigate();

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  const handleBoard = () => {
    navigate(`/boards/`);
  };

  const boardImages = {
    study: "/study.jpg",
    toy: "/toy.jpg",
    code: "/code.jpg",
  };

  const boardDescriptions = {
    study: "A place for focused learning and study sessions, share resources and study together.",
    toy: "A fun space for exploring creative toy projects and ideas.",
    code: "Share your coding projects and get feedback from peers in the community.",
  };

  const handleCardClick = (boardId) => {
    navigate(`/boards/${boardId}/posts`);
  };

  return (
    <div className="w-full h-full">
      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center h-[50vh] p-12">
        <h1 className="text-5xl text-center font-bold leading-tight mb-4">
          Welcome to <br />
          <span className="text-blue-500">Dev</span>Mate <br />
          Where Young <br /> Developers Grow Together!
        </h1>
        <h3 className="text-center text-xl mb-8">
          Join our friendly community of young programmers. <br /> Share projects, learn together, and get helpful feedback from peers.
        </h3>
        <div className="flex space-x-4">
          <Button className="w-[215px]" onClick={handleGitHubLogin}>
            <img src="/github.png" alt="GitHub logo" className="w-5 h-5 inline mr-2"/>
            Get Started with Github
          </Button>
          <Button className="w-[215px] bg-gray-50 text-black" onClick={handleBoard}>
            View Boards
          </Button>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="py-8">
        <Carousel plugins={[Autoplay({ delay: 8000 })]}>
          <CarouselContent>
            {['study', 'toy', 'code'].map((boardId, index) => (
              <CarouselItem key={index}>
                <div className="p-4" onClick={() => handleCardClick(boardId)}>
                  <Card className="cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out">
                    <CardContent className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg">
                      <img
                        src={boardImages[boardId]}
                        alt={boardId}
                        className="w-[400px] h-[400px] object-cover rounded-lg shadow-md mb-4"
                      />
                      <div className="text-center">
                        <span className="text-3xl font-semibold text-gray-800">{boardId.charAt(0).toUpperCase() + boardId.slice(1)}</span>
                        <p className="mt-4 text-gray-600">{boardDescriptions[boardId]}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default Main;
