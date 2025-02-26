import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { HandleSaveComment } from "@/hooks/useComment"; 

const CommentForm = () => {
  const [content, setContent] = useState<string>("");

  const handleSaveComment = async () => {
    if (!content) return;

    try {
      await HandleSaveComment(content);
      setContent("");
    } catch (err) {
      console.error("댓글 저장 중 오류가 발생했습니다.", err);
    }
  };

  return (
    <div className="flex w-2/3 mx-auto">
      <Input
        placeholder="Leave a comment.."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="place-self-start mt-4"
      />
      <Button className="ml-4 mt-4" onClick={handleSaveComment}>
        Post
      </Button>
    </div>
  );
};

export default CommentForm;
