export interface User {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  mobile?: string | null;
  isActive?: boolean;
  isVerified?: boolean;
  image?: string | null;
  roleId?: string | null;
  createdAt?: Date | string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  userId: string;
  articleId?: string;
  parentId?: string | null;
  user?: User | null;
  replies?: Comment[];
  likes?: Likes[];
  children?: Comment[];
}

export interface Article {
  id: string;
  title: string;
  content?: string;
  coverImage?: string;
  published?: boolean;
  publishedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  authorId?: string;
}

export interface Likes {
  id: string;
  commentId: string;
  userId: string;
  createdAt: Date | string;
}
