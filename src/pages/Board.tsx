import { useState, useEffect } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/breadcrumb";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Post } from "@/types/post.type";
import { usePost } from "@/hooks/usePost";

export default function Board() {
  const { boardId } = useParams<{ boardId: string }>();
  const { HandleGetPosts } = usePost();
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const boardNames: Record<string, string> = {
    study: "스터디 모집",
    toy: "토이 프로젝트",
    code: "코드 리뷰",
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!boardId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await HandleGetPosts(boardId, currentPage);
        setPosts(response.posts);
        setTotalPosts(response.total);
      } catch (err: any) {
        console.error("Failed to load posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);  
      }
    };

    fetchPosts();
  }, [boardId, currentPage, HandleGetPosts]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pt-8">
      <div className="ml-12">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">홈</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <Link to={`/boards/${boardId}/posts`}>
                  {boardId ? boardNames[boardId] || "알 수 없음" : "알 수 없음"}
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
                <CardTitle className="flex">
                  {post.title}
                  <div className="text-[15px] text-gray-500 self-center ml-5">
                    {post.username}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardFooter className="mt-6 flex justify-between items-center gap-4">
                <small>
                  게시일 : {new Date(post.createdAt).toLocaleString()}
                </small>
                <div className="flex items-center gap-1">
                  <Heart
                    className={`w-3 h-3 ${
                      post.likeCount
                        ? "fill-red-500 text-red-500"
                        : "text-black"
                    }`}
                  />
                  <small>
                    {post.likeCount !== undefined && post.likeCount !== null
                      ? post.likeCount
                      : 0}
                  </small>
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
                onClick={currentPage === 1 ? undefined : handlePrevPage}
                className={
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index + 1} className="cursor-pointer">
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
                onClick={
                  currentPage === totalPages ? undefined : handleNextPage
                }
                className={
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};