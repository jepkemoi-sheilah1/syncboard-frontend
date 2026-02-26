// User Models
export interface User {
  id?: string;
  firstName: string;
  sirName: string;
  email: string;
  avatarUrl?: string;
  password?: string;
}

export interface UserRegistrationRequest {
  firstName: string;
  sirName: string;
  email: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserEmailDTO {
  email: string;
}

// Board Models
export interface Board {
  id: string;
  name: string;
  workspaceId: string;
}

export interface BoardsRequest {
  name: string;
}

// Workspace Models
export interface Workspace {
  id: string;
  name: string;
}

export interface WorkSpaceRequest {
  name: string;
}

export interface InviteRequest {
  email: string;
  workspaceId: string;
}

// List Models
export interface BoardList {
  id: string;
  name: string;
  boardId: string;
}

export interface ListRequest {
  name: string;
  boardId: string;
}

// Board Member Models
export interface BoardMember {
  userId: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
}

export interface AddBoardMemberRequest {
  email: string;
  role: string;
}

// Comment Models
export interface Comment {
  id: string;
  content: string;
  cardId: string;
  userId: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
}

// Notification Models
export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Activity Log Models
export interface ActivityLog {
  id: string;
  action: string;
  boardId: string;
  userId: string;
  createdAt: string;
}
