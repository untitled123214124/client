import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate, useParams } from "react-router-dom";

interface Post {
  _id: string;
  boardId: string;
  title: string;
  content: string;
  createdAt: string;
}

function Board() {
  const { boardId } = useParams(); // boardId를 URL 파라미터로 받습니다.
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 10;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const navigate = useNavigate();

  const handlePost = () => {
    navigate("/newpost");
  };

  const handleViewPost = (postId: string) => {
    navigate(`/board/${postId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!boardId) {
      console.error("boardId is undefined!"); // boardId가 undefined일 경우 경고
      return;
    }

    console.log("Requesting posts for boardId:", boardId); // boardId 값 확인

    axios
      .get(`http://localhost:5000/boards/${boardId}/posts`, {
        params: {
          currentPage: currentPage,
          limit: postsPerPage,
        },
      })
      .then((response) => {
        if (
          response.data &&
          Array.isArray(response.data.posts) &&
          typeof response.data.total === "number"
        ) {
          setPosts(response.data.posts);
          setTotalPosts(response.data.total);
        } else {
          throw new Error("Invalid response format");
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error); // 실제 오류 메시지 출력
        setError(error.message);
      });
  }, [boardId, currentPage]); // boardId나 currentPage가 바뀌면 데이터 새로 불러오기

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap h-[1000px] p-8 justify-start gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card
              key={post._id}
              className="w-[600px] h-[270px] mb-6 cursor-pointer"
              onClick={() => handleViewPost(post._id)}
            >
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.content}</CardDescription>
              </CardHeader>
              <CardContent>
                <small>{new Date(post.createdAt).toLocaleString()}</small>
              </CardContent>
            </Card>
          ))
        ) : (
          <div>No posts available</div>
        )}
      </div>
      <div className="flex w-screen justify-center items-center">
        <Button onClick={handlePost}>Write New Post</Button>
      </div>
      <div className="flex justify-center mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevPage}
                className={currentPage === 1 ? "disabled" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                className={currentPage === totalPages ? "disabled" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default Board;