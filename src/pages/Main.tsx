import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { BoardId } from "@/types/board.type";

const Main = () => {
  const navigate = useNavigate();

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  const handleBoard = () => {
    navigate(`/boards`);
  };

  const boardImages: Record<BoardId, string> = {
    study: "/study.jpg",
    toy: "/toy.jpg",
    code: "/code.jpg",
  };

  const boardDescriptions: Record<BoardId, string> = {
    study:
      "A place for focused learning and study sessions, share resources and study together.",
    toy: "A fun space for exploring creative toy projects and ideas.",
    code: "Share your coding projects and get feedback from peers in the community.",
  };

  const handleCardClick = (boardId: BoardId) => {
    navigate(`/boards/${boardId}/posts`);
  };

  return (
    <div className="relative w-full items-center justify-center">
      <div className="flex flex-col justify-center items-center min-h-[50vh]">
        <h1 className="text-5xl text-center font-bold leading-tight mb-4">
          Welcome to <br />
          <span className="text-blue-500">Dev</span>Mate <br />
          Where Young <br /> Developers Grow Together!
        </h1>
        <h3 className="text-center text-xl mb-8">
          Join our friendly community of young programmers. <br /> Share
          projects, learn together, and get helpful feedback from peers.
        </h3>
        <div className="flex space-x-4">
          <Button className="w-[215px]" onClick={handleGitHubLogin}>
            <img
              src="/github.png"
              alt="GitHub logo"
              className="w-5 h-5 inline mr-2"
            />
            Get Started with Github
          </Button>
          <Button
            className="w-[215px] bg-gray-50 text-black"
            onClick={handleBoard}
          >
            View Boards
          </Button>
        </div>
      </div>

      <Carousel plugins={[Autoplay({ delay: 8000 })]}>
        <CarouselContent>
          {["study", "toy", "code"].map((boardId) => (
            <CarouselItem key={boardId}>
              <div
                className="p-8"
                onClick={() => handleCardClick(boardId as BoardId)}
              >
                <Card className="cursor-pointer  hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-in-out">
                  <CardContent className="flex flex-col items-center justify-center rounded-lg">
                    <img
                      src={boardImages[boardId as BoardId]}
                      alt={boardId}
                      className="w-[300px] h-[300px] object-cover rounded-lg "
                    />
                    <div className="text-center">
                      <span className="text-3xl font-semibold text-gray-800">
                        {boardId.charAt(0).toUpperCase() + boardId.slice(1)}
                      </span>
                      <p className="mt-4 text-gray-600">
                        {boardDescriptions[boardId as BoardId]}
                      </p>
                    </div>
                  </CardContent>
                  <CarouselNext />
                  <CarouselPrevious />
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Main;
