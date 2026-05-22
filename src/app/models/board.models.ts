// ─── Workspace ───────────────────────────────────────────────────────────────

export interface Workspace {
  id: number;
  workSpaceName: string;
  workSpaceDescription?: string;
  workSpaceCreatedAt: string;
  updatedAt: string;
  owner: {
    id: number;
    firstName: string;
    sirName: string;
    email: string;
    avatar?: string | null;
  };
  members: WorkspaceMember[];
}

export interface WorkspaceMember {
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string | null;
  joinedAt?: string;
}

export interface CreateWorkspaceRequest {
  workSpaceName: string;
  workSpaceDescription?: string;
}

// ─── Workspace Invitation ─────────────────────────────────────────────────────

export interface WorkspaceInvitation {
  id: string;
  workSpaceId: string | number;
  email: string;
  role: 'admin' | 'member';
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined';
  expiresAt: Date;
}

// Updated to support bulk invitations
export interface SendWorkspaceInvitationRequest {
  workSpaceId: string | number;
  invitations: {
    email: string;
    role: 'admin' | 'member';
  }[];
}

export interface WorkspaceInvitationResponse {
  success: boolean;
  results: {
    email: string;
    status: 'sent' | 'failed' | 'already_member' | 'already_invited';
    invitation?: WorkspaceInvitation;
    error?: string;
  }[];
  message?: string;
}

// ─── Label ───────────────────────────────────────────────────────────────────

export interface Label {
  id: string;
  name: string;
  color: string;
}

// ─── Board Member ─────────────────────────────────────────────────────────────

export interface BoardMember {
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'observer';
  avatar?: string;
  joinedAt: Date;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export interface Card {
  id: string;
  title: string;
  description: string;
  listId: string;
  order: number;
  labels: Label[];
  dueDate?: Date;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── List (Column) ────────────────────────────────────────────────────────────

export interface BoardList {
  id: string;
  name: string;
  boardId: string;
  order: number;
  cards: Card[];
}

// ─── Board ────────────────────────────────────────────────────────────────────

export interface Board {
  id: string;
  boardName: string;
  boardDescription?: string;
  workSpaceId: string | number;
  isStarred?: boolean;
  members: BoardMember[];
}

// ─── Board Invitation ─────────────────────────────────────────────────────────

export interface Invitation {
  id: string;
  boardId: string;
  email: string;
  role: 'admin' | 'member' | 'observer';
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined';
  expiresAt: Date;
}

// ─── Board Requests ───────────────────────────────────────────────────────────

export interface CreateBoardRequest {
  boardName: string;
  boardDescription?: string;
  workSpaceId: string | number;
  isStarred?: boolean;
}

export interface UpdateBoardRequest {
  boardName?: string;
  boardDescription?: string;
  isStarred?: boolean;
}

// ─── List Requests ────────────────────────────────────────────────────────────

export interface CreateListRequest {
  name: string;
  boardId: string;
  order?: number;
}

export interface UpdateListRequest {
  name?: string;
  order?: number;
}

// ─── Card Requests ────────────────────────────────────────────────────────────

export interface CreateCardRequest {
  title: string;
  description?: string;
  listId: string;
  order?: number;
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
  order?: number;
  listId?: string;
  assignee?: string;
  dueDate?: Date;
  labels?: Label[];
}

export interface MoveCardRequest {
  cardId: string;
  targetListId: string;
  newIndex: number;
}

// ─── Board Invitation Requests ────────────────────────────────────────────────

export interface SendInvitationRequest {
  boardId: string;
  email: string;
  role: 'admin' | 'member' | 'observer';
}

export interface InvitationResponse {
  success: boolean;
  invitation?: Invitation;
  message?: string;
}

// ─── WebSocket Events ─────────────────────────────────────────────────────────

export interface CardMovedEvent {
  cardId: string;
  fromListId: string;
  toListId: string;
  newIndex: number;
  userId: string;
}

export interface CardUpdatedEvent {
  card: Card;
  userId: string;
}

export interface CardCreatedEvent {
  card: Card;
  userId: string;
}

export interface CardDeletedEvent {
  cardId: string;
  listId: string;
  userId: string;
}

export interface MemberJoinedEvent {
  member: BoardMember;
}

export interface MemberLeftEvent {
  userId: string;
}

export interface PresenceUpdateEvent {
  users: { userId: string; status: 'online' | 'offline' }[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_BOARD: Board = {
  id: 'board-1',
  boardName: 'Sample Board',
  boardDescription: 'A sample board for testing',
  workSpaceId: 'ws-1',
  isStarred: false,
  members: []
};