import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardFooter,
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useNavigate, useParams, Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface Post {
  _id: string;
  boardId: string;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
}

function Board() {
  const { boardId } = useParams<{ boardId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const navigate = useNavigate();

  const handlePost = () => {
    navigate("/newpost");
  };

  const handleViewPost = (postId: string) => {
    navigate(`/boards/${boardId}/${postId}`);
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
      console.error("boardId is undefined!"); 
      return;
    }

    console.log("Requesting posts for boardId:", boardId);

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
        console.error("Error fetching posts:", error);
        setError(error.message);
      });
  }, [boardId, currentPage]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="ml-12 ">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Main</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
          <BreadcrumbPage>
                <Link to={`/boards/${boardId}/posts`}>
                 {boardId.charAt(0).toUpperCase() + boardId.slice(1)}
                </Link>
              </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      </div>
            <div className="p-8 flex flex-col justify-start">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card
              key={post._id}
              className="flex h-[120px] mb-6 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-transform duration-200 items-center justify-between px-3"
              onClick={() => handleViewPost(post._id)}
            >
              <CardHeader>
                <CardTitle>
                  {post.title}  
                </CardTitle>
              </CardHeader>
              <CardFooter className="mt-6 flex justify-between items-center gap-4">
                <small>{new Date(post.createdAt).toLocaleString()}</small>
                <div className="flex items-center gap-1">
                <Heart 
                  className={`w-3 h-3 ${post.likeCount ? 'fill-red-500 text-red-500' : 'text-black'}`} 
                />
                <small>{post.likeCount !== undefined && post.likeCount !== null ? post.likeCount : 0}</small>
              </div>
              </CardFooter>
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