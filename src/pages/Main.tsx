import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const Main = () => {
  const navigate = useNavigate();

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  const handleBoard = () =>  {
    navigate(`/boards/`);
  }

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
    <div>
      <div className="flex w-screen h-1/2 p-8 pl-12">
        <div className="w-1/2">
          <h1 className="text-5xl">Welcome to <br /> 
          <span className="text-blue-500">Dev</span>Mate <br /> Where Young <br /> Developers Grow Together! </h1>
          <h3 className="mt-10 text-left">
                Join our friendly community of young programmers. <br /> Share projects, learn together, and get helpful feedback from peers.
          </h3>
        </div>
        <div className="flex flex-col w-1/2 justify-center place-items-center">
          <Button className="w-[200px] mb-4" onClick={handleGitHubLogin}>
            <img src="/github.png" alt="" className="w-5 h-5"/>
            Get Started with Github
          </Button>
          <Button className="w-[200px] bg-gray-50 text-black" onClick={handleBoard}>View Boards</Button>  
        </div>
      </div>

      <div className="p-8 h-[600px]">
        <Carousel plugins={[
        Autoplay({
          delay: 8000,
        }),
      ]}>
          <CarouselContent>
            {['study', 'toy', 'code'].map((boardId, index) => (
              <CarouselItem key={index}>
                <div className="p-1" onClick={() => handleCardClick(boardId)}>
                  <Card className="h-[600px] cursor-pointer">
                    <CardContent className="flex p-6 items-center justify-center">
                    <img 
                        src={boardImages[boardId]} 
                        alt={boardId} 
                        className="w-[500px] h-[500px]"
                      />
                      <div className="place-items-center">
                      <span className="text-4xl font-semibold ">{boardId.charAt(0).toUpperCase() + boardId.slice(1)}</span>
                      <p className="mt-2 text-center text-gray-600 mt-8">{boardDescriptions[boardId]}</p>
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
}

export default Main;