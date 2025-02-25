import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUserStore from "@/stores/userStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import { Post, Comment } from "@/types/post.type";
import { usePost } from "@/hooks/usePost";
import { HandleGetComments } from "@/hooks/useComment";

function ViewPost() {
  const { boardId, postId } = useParams<{ boardId: string; postId: string }>();
  const navigate = useNavigate();
  const { id } = useUserStore();
  const { HandleGetPost, HandleEditPost, HandleDeletePost } = usePost();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [inputValue, setInputValue] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");
  
  const [liked, setLiked] = useState<boolean>(false);
  const [clickedCommentId, setClickedCommentId] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!boardId || !postId) {
        setError("Invalid post or board ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const postResponse = await HandleGetPost(boardId, postId);
        const commentsResponse = await HandleGetComments(postId);

        if (postResponse) {
          setPost(postResponse.post);
          setLikeCount(postResponse.post.likeCount);
        }

        if (commentsResponse) {
          setComments(commentsResponse.data.comments);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [boardId, postId]);

  const handleLike = () => {
    if (!boardId || !postId) return;
    HandleLike(boardId, postId);
    setLiked(!liked);
    setLikeCount(prev => (liked ? prev - 1 : prev + 1));  // Toggle like count
  };

  const handleDeletePost = () => {
    if (!boardId || !postId) return;
    HandleDeletePost(boardId, postId, navigate);
  };

  const handleEditPost = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("User is not authenticated.");
      return;
    }

    if (!editedTitle || !editedContent) {
      setError("Both title and content are required.");
      return;
    }

    try {
      const updatedPost = { title: editedTitle, content: editedContent };
      const response = await fetch(
        `http://dev-mate.glitch.me/boards/${boardId}/posts/${postId}`,
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
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    if (post) {
      setEditedTitle(post.title);
      setEditedContent(post.content);
    }
  };

  const handleClickComment = (commentId: string | null) => {
    setClickedCommentId(prevId => prevId === commentId ? null : commentId);
    setParentId(commentId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

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
                    <Button className="bg-green-500 text-white ml-2" onClick={handleEditPost}>
                      Save
                    </Button>
                    <Button className="bg-gray-500 text-white" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="bg-blue-500 text-white" onClick={() => setIsEditMode(true)}>
                      Edit Post
                    </Button>
                    <Button className="bg-red-500 text-white" onClick={handleDeletePost}>
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
          <div className="place-self-center mt-4 w-[180px] h-[60px] flex justify-center items-center border border-gray-300 p-2 rounded-md gap-2">
            Like This Post!
            <Heart
              className={`cursor-pointer ${liked ? "text-red-500" : "text-gray-500"}`}
              onClick={handleLike}
              fill={liked ? "red" : "none"}
            />
            {likeCount}
          </div>
        </CardContent>
      </Card>

      <div className="w-2/3 mx-auto justify-center items-center mt-5">
        <h3 className="justify-center items-center mx-auto text-xl font-bold mt-5">Comments</h3>
        {comments.length > 0 ? (
          <div className="mt-4 justify-center items-center mx-auto">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className={`p-4 border border-gray-300 rounded-md mb-4 ${comment.parentId ? "ml-8" : ""}`}
              >
                <p className="font-semibold">User {comment.userId}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
                <p onClick={() => handleClickComment(comment._id)} className="cursor-pointer">
                  {comment.parentId && "↳ "} {comment.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div>No comments yet.</div>
        )}
      </div>
    </div>
  );
}

export default ViewPost;
