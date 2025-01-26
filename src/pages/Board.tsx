import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/stores/userStore';

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

function AllBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [postsPerPage] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  const handlePost = () => {
   navigate("/newpost")
  };

  const handleViewPost = (postId: string) => {
    navigate(`/board/${postId}`)
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const startPost = (currentPage - 1) * postsPerPage;
  const endPost = startPost + postsPerPage;

  useEffect(() => {
    axios
      .get('http://localhost:5000/boards/1/posts/', {
        params: {
          page: currentPage,
          limit: postsPerPage,
        }
      })
      .then(response => {
        console.log('Response data:', response.data);
        if (response.data && Array.isArray(response.data.posts) && typeof response.data.total === 'number') {
          setPosts(response.data.posts);
          setTotalPosts(response.data.total);
          console.log(totalPosts)
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setError(error.message);
      });
  }, [currentPage, postsPerPage]); 

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentPosts = posts.slice(startPost, endPost);

  return (
    <div>
      <div className="flex flex-wrap h-[1000px] p-8 justify-start gap-8">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <Card
              key={post._id}
              className="w-[600px] h-[270px] mb-6 cursor-pointer"
              style={{ boxSizing: 'border-box' }}
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
                href="#"
                onClick={handlePrevPage}
                className={currentPage === 1 ? 'disabled' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={handleNextPage}
                className={currentPage === totalPages ? 'disabled' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default AllBoard;