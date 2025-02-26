import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useUserStore from "@/stores/userStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import { Post, Comment } from "@/types/post.type";
import { usePost } from "@/hooks/usePost";
import { HandleGetComments } from "@/hooks/useComment";
import CommentForm from "@/components/common/CommentForm";
import { HandleLike } from "@/hooks/useLike";

function ViewPost() {
  const { boardId, postId } = useParams<{ boardId: string; postId: string }>();
  const { id } = useUserStore();
  const { HandleGetPost, HandleEditPost, HandleDeletePost } = usePost();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");

  const [clickedCommentId, setClickedCommentId] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);

  // 좋아요 상태를 관리할 변수
  const [likeState, setLikeState] = useState<ReturnType<typeof HandleLike> | null>(null);

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

  // post가 로드된 후 HandleLike 실행
  useEffect(() => {
    if (post) {
      setLikeState(HandleLike(boardId!, postId!, post.likeCount || 0));
    }
  }, [post]);

  const handleDeletePost = () => {
    if (!boardId || !postId) return;
    HandleDeletePost(boardId, postId);
  };

  const handleClickComment = (commentId: string | null) => {
    setClickedCommentId((prevId) => (prevId === commentId ? null : commentId));
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
            {post._id === id && (
              <div className="flex gap-2">
                {isEditMode ? (
                  <>
                    <Button className="bg-green-500 text-white ml-2" onClick={HandleEditPost}>
                      Save
                    </Button>
                    <Button className="bg-gray-500 text-white" onClick={() => setIsEditMode(false)}>
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
            <div className="font-extrabold text-gray-600 mb-2">{post.username}</div>
            <div>{new Date(post.createdAt).toLocaleString()}</div>
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
              className={`cursor-pointer ${likeState?.liked ? "text-red-500" : "text-gray-500"}`}
              onClick={likeState?.handleLike}
              fill={likeState?.liked ? "red" : "none"}
            />
            {likeState?.likeCount ?? post.likeCount}
          </div>
        </CardContent>
      </Card>

      <CommentForm />
    </div>
  );
}

export default ViewPost;
