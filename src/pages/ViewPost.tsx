import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useUserStore from '@/stores/userStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Heart } from 'lucide-react';

interface Post {
  _id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  userId: string;
  content: string;
  createdAt: string;
  parentId?: string | null;
}

interface Reply {
  success: boolean;
  comments: Comment[];
}

function ViewPost() {
  const { boardId, postId } = useParams<{ boardId: string; postId: string }>();
  const { commentId } = useParams<{ commentId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useUserStore();
  const [inputValue, setInputValue] = useState<string>('');
  const [replyInputValue, setReplyInputValue] = useState(""); // 대댓글 입력 상태
  const [parentId, setParentId] = useState<string | null>(null);
  const [isReplyInputVisible, setIsReplyInputVisible] = useState<{ [key: string]: boolean }>({});
  const [clickedCommentId, setClickedCommentId] = useState<string | null>(null);  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    if (!postId) {
      setError("Invalid post ID");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/boards/${boardId}/posts/${postId}`)
      .then(response => {
        if (response.data && response.data.post) {
          setPost(response.data.post);
          setEditedTitle(response.data.post.title);
          setEditedContent(response.data.post.content);
          setLikeCount(response.data.post.likeCount);
        } else {
          throw new Error("Post not found");
        }
      })
      .catch(err => {
        console.error("Error fetching post:", err);
        setError(err.message || "Failed to load the post");
      });

    // Fetch the comments data
    axios
      .get<{ success: boolean, comments: Comment[] }>(`http://localhost:5000/comments/${postId}`)
      .then(response => {
        if (response.data.success && response.data.comments) {
          setComments(response.data.comments);
        } else {
          throw new Error("No comments found for this post");
        }
      })
      .catch(err => {
        console.error("Error fetching comments:", err);
        setError(err.message || "Failed to load comments");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [postId]);

  useEffect(() => {
    if (commentId) {
      axios
        .get<Reply>(`http://localhost:5000/comments/${commentId}`)
        .then(response => {
          if (response.data.success) {
            setReplies(response.data.comments);
          } else {
            throw new Error("No replies found for this comment");
          }
        })
        .catch(err => {
          console.error("Error fetching replies:", err);
          setError(err.message || "Failed to load replies");
        });
    }
  }, [commentId]);

  const handleDeletePost = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(
        `http://localhost:5000/boards/${boardId}/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Post deleted successfully.");
        navigate(`/boards/${boardId}/posts`);
      } else {
        alert("Failed to delete post.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(
        `http://localhost:5000/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Comment deleted successfully.");
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete comment.");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment.");
    }
  };

  const handleLike = async () => {
    if (!id || !post) return;

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(
        `http://localhost:5000/boards/${boardId}/posts/like/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ userId: id }),
        }
      );

      if (response.ok) {
        setLiked(prevLiked => {
          const newLikedState = !prevLiked;
          setLikeCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);
          return newLikedState;
        });
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update the like status.");
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
    }
  };

  const handleCommentPost = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const commentContent = inputValue;

    if (!accessToken) {
      throw new Error("User is not authenticated.");
    }

    if (!commentContent) {
      throw new Error("Please enter a comment.");
    }

    const commentData = {
      content: commentContent,
      userId: id,
      postId: postId,
      parentId: parentId || null,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/comments/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify(commentData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to post the comment.");
      }

      const data = await response.json();
      setComments((prevComments) => [...prevComments, data.comment]);
      setInputValue("");
      setParentId(null);
      navigate(`/boards/${boardId}/${postId}`);
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
    }
  };

  const handleEditPost = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("User is not authenticated.");
    }

    if (!editedTitle || !editedContent) {
      throw new Error("Both title and content are required.");
    }

    const updatedPost = {
      title: editedTitle,
      content: editedContent,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/boards/${boardId}/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify(updatedPost),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update the post.");
      }

      const data = await response.json();
      setPost(data.post);
      setIsEditMode(false);
      navigate(`/boards/${boardId}/${postId}`);
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedTitle(post?.title || '');
    setEditedContent(post?.content || '');
  };

  const handleClickComment = (commentId: string, parentId: string | null) => {
    const comment = comments.find((comment) => comment._id === commentId);
    if (comment && parentId === null) {
      setClickedCommentId((prevId) => (prevId === commentId ? null : commentId));
      setParentId(commentId);
    } else if (parentId !== null) {
      setClickedCommentId((prevId) => (prevId === commentId ? null : commentId));
      setParentId(parentId);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="w-full pt-12 justify-center items-center">
      <Card className="w-2/3 mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex justify-between mb-1">
            {isEditMode ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Enter the title"
              />
            ) : (
              post.title
            )}
            {post.userId === id && (
              <div className="flex gap-2">
                {isEditMode ? (
                  <>
                    <Button
                      className="bg-green-500 text-white ml-2"
                      onClick={handleEditPost}
                    >
                      Save
                    </Button>
                    <Button
                      className="bg-gray-500 text-white"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="bg-blue-500 text-white"
                      onClick={() => setIsEditMode(true)}
                    >
                      Edit Post
                    </Button>
                    <Button
                      className="bg-red-500 text-white"
                      onClick={handleDeletePost}
                    >
                      Delete Post
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditMode ? (
            <textarea
              className="w-full h-40 border border-gray-300 p-2 rounded"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Enter the content"
            />
          ) : (
            <p className="text-lg">{post.content}</p>
          )}
          <div className="place-self-center mt-64 w-[180px] h-[60px] flex justify-center items-center border border-gray-300 p-2 rounded-md gap-2">
            Like This Post!
            <Heart
              className={`cursor-pointer ${liked ? 'text-red-500' : 'text-gray-500'}`}
              onClick={handleLike}
              fill={liked ? 'red' : 'none'}
            />
            {likeCount}
          </div>
        </CardContent>
      </Card>
  
      {/* 댓글 및 대댓글 처리 부분 */}
      <div className="w-2/3 mx-auto justify-center items-center mt-5">
        <h3 className="justify-center items-center mx-auto text-xl font-bold mt-5">
          Comments
        </h3>
        {comments.length > 0 ? (
          <div className="mt-4 justify-center items-center mx-auto">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className={`p-4 border border-gray-300 rounded-md mb-4 ${comment.parentId ? 'ml-8' : ''}`}
              >
                <p className="font-semibold">User {comment.userId}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
                <p
                  onClick={() => handleClickComment(comment._id, comment.parentId)}
                  className="cursor-pointer"
                >
                  {comment.parentId && '↳ '}
                  {comment.content}
                </p>
                {comment.userId === id && (
                  <div className="mt-4 mr-2">
                    <Button
                      className="bg-blue-500 text-white mr-2"
                      onClick={() => handleEditComment(comment._id)}
                    >
                      Edit Comment
                    </Button>
                    <Button
                      className="bg-red-500 text-white"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete Comment
                    </Button>
                  </div>
                )}
  
                {/* 대댓글 작성 */}
                {clickedCommentId === comment._id && !comment.parentId && (
                  <div className="mt-4">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full"
                    />
                    <Button onClick={handleCommentPost} className="mt-4">
                      Post Reply
                    </Button>
                  </div>
                )}
  
                {/* 대댓글 표시 */}
                {comments
                  .filter((reply) => reply.parentId === comment._id)
                  .map((reply) => (
                    <div
                      key={reply._id}
                      className="ml-8 mt-4 p-4 border border-gray-300 rounded-md"
                    >
                      <p className="font-semibold">User {reply.userId}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(reply.createdAt).toLocaleString()}
                      </p>
                      <p>{reply.content}</p>
                      {reply.userId === id && (
                        <div className="mt-4 mr-2">
                          <Button
                            className="bg-blue-500 text-white"
                            onClick={() => handleEditComment(reply._id)}
                          >
                            Edit Reply
                          </Button>
                          <Button
                            className="bg-red-500 text-white"
                            onClick={() => handleDeleteComment(reply._id)}
                          >
                            Delete Reply
                          </Button>
                        </div>
                      )}
  
                      {/* 대댓글 작성 input */}
                      {clickedCommentId === reply._id && (
                        <div className="mt-4">
                          <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full"
                          />
                          <Button onClick={handleCommentPost} className="mt-4">
                            Post Reply
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="justify-center items-center mx-auto mt-5 mb-5">
            No comments yet.
          </p>
        )}
      </div>
  
      <div className="flex w-2/3 mx-auto">
        <Input
          placeholder="Leave a comment!"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="mb-4"
        />
        <Button className="ml-4" onClick={handleCommentPost}>
          Post
        </Button>
      </div>
    </div>
  );
}
export default ViewPost;