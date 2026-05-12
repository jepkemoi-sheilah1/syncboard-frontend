// ─── Workspace ───────────────────────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  members?: WorkspaceMember[];
}

export interface WorkspaceMember {
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
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
  name: string;
  workspaceId: string;
  createdAt: Date;
  ownerId: string;
  members: BoardMember[];
  isStarred?: boolean;
}

// ─── Invitation ───────────────────────────────────────────────────────────────

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
  name: string;
  workspaceId?: string;
}

export interface UpdateBoardRequest {
  name?: string;
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

// ─── Invitation Requests ──────────────────────────────────────────────────────

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
  name: 'Project Alpha',
  workspaceId: 'ws-1',
  createdAt: new Date(),
  ownerId: 'user-1',
  isStarred: false,
  members: [
    { userId: 'user-1', email: 'john@example.com', name: 'John Doe', role: 'owner', joinedAt: new Date() },
    { userId: 'user-2', email: 'jane@example.com', name: 'Jane Smith', role: 'member', joinedAt: new Date() },
    { userId: 'user-3', email: 'bob@example.com', name: 'Bob Wilson', role: 'member', joinedAt: new Date() }
  ]
};

