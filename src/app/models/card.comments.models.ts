export interface CardComment {
  id: string;
  cardId: string;
  authorId?: string;
  authorName?: string;
  content: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface CreateCardCommentRequest {
  content: string;
}

