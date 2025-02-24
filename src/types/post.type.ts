export interface Post {
    _id: string;
    boardId: string;
    username: string;
    title: string;
    content: string;
    createdAt: string;
    likeCount: number;
  }

export interface Comment {
    _id: string;
    userId: string;
    content: string;
    createdAt: string;
    parentId?: string | null;
  }

export interface Reply {
    success: boolean;
    comments: Comment[];
  }