export type VerdictType = "TRUE" | "FALSE" | "MISLEADING" | "PARTLY_TRUE" | "UNVERIFIED";

export interface PostWithRelations {
  id: string;
  slug: string;
  type: string;
  title: string;
  caption: string | null;
  mediaUrls: string | null;
  status: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    role: string;
    profile: {
      username: string;
      displayName: string;
      avatar: string | null;
    } | null;
  };
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  } | null;
  commentsEnabled: boolean;
  featured: boolean;
  views: number;
  sharesCount: number;
  publishedAt: Date | string | null;
  createdAt: Date | string;
  factCheck?: {
    id: string;
    claim: string;
    claimant: string;
    claimDate: string | null;
    claimSource: string | null;
    context: string | null;
    evidence: string;
    analysis: string;
    verdict: VerdictType;
    sourcesJson: string | null;
    correctionHistory: string | null;
    reviewedBy: string | null;
  } | null;
  article?: {
    id: string;
    summary: string;
    body: string;
    readingTime: number;
    sourcesJson: string | null;
  } | null;
  poll?: {
    id: string;
    question: string;
    description: string | null;
    options: {
      id: string;
      label: string;
      votesCount?: number;
    }[];
    votes?: { id: string; optionId: string; userId: string }[];
  } | null;
  _count?: {
    likes: number;
    comments: number;
    saves: number;
  };
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface CommentWithUser {
  id: string;
  postId: string;
  userId: string;
  parentId: string | null;
  body: string;
  status: string;
  createdAt: Date | string;
  user: {
    name: string;
    role: string;
    profile: {
      username: string;
      displayName: string;
      avatar: string | null;
    } | null;
  };
  replies?: CommentWithUser[];
  _count?: {
    likes: number;
  };
  isLiked?: boolean;
}
