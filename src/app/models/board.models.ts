 // ============================================
// SyncBoard Phase 2 - Board Models
// ============================================

// Label for cards
export interface Label {
  id: string;
  name: string;
  color: string; // e.g., '#ff0000', 'green', '#3b82f6'
}

// Board Member
export interface BoardMember {
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'observer';
  avatar?: string;
  joinedAt: Date;
}

// Card
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

// List (Column)
export interface BoardList {
  id: string;
  name: string;
  boardId: string;
  order: number;
  cards: Card[];
}

// Board
export interface Board {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: Date;
  ownerId: string;
  members: BoardMember[];
  isStarred?: boolean;
}

// Invitation
export interface Invitation {
  id: string;
  boardId: string;
  email: string;
  role: 'admin' | 'member' | 'observer';
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined';
  expiresAt: Date;
}

// ============================================
// API Request/Response Types
// ============================================

// Board Requests
export interface CreateBoardRequest {
  name: string;
  workspaceId?: string;
}

export interface UpdateBoardRequest {
  name?: string;
  isStarred?: boolean;
}

// List Requests
export interface CreateListRequest {
  name: string;
  boardId: string;
  order?: number;
}

export interface UpdateListRequest {
  name?: string;
  order?: number;
}

// Card Requests
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

// Invitation Requests
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

// ============================================
// WebSocket Event Types
// ============================================

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

// ============================================
// Mock Data for Development
// ============================================

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

export const MOCK_LISTS: BoardList[] = [
  {
    id: 'list-1',
    name: 'To Do',
    boardId: 'board-1',
    order: 0,
    cards: [
      { id: 'card-1', title: 'Setup project structure', description: 'Initialize Angular project with required dependencies', listId: 'list-1', order: 0, labels: [{ id: 'l1', name: 'Urgent', color: '#ef4444' }], createdAt: new Date(), updatedAt: new Date() },
      { id: 'card-2', title: 'Design database schema', description: 'Create ERD and define relationships', listId: 'list-1', order: 1, labels: [], createdAt: new Date(), updatedAt: new Date() },
      { id: 'card-3', title: 'Create wireframes', description: 'Design UI mockups in Figma', listId: 'list-1', order: 2, labels: [{ id: 'l2', name: 'Design', color: '#8b5cf6' }], createdAt: new Date(), updatedAt: new Date() }
    ]
  },
  {
    id: 'list-2',
    name: 'In Progress',
    boardId: 'board-1',
    order: 1,
    cards: [
      { id: 'card-4', title: 'Implement authentication', description: 'Add login and registration features', listId: 'list-2', order: 0, assignee: 'John', labels: [{ id: 'l1', name: 'Urgent', color: '#ef4444' }], createdAt: new Date(), updatedAt: new Date() },
      { id: 'card-5', title: 'Setup WebSocket server', description: 'Configure Socket.io for real-time sync', listId: 'list-2', order: 1, assignee: 'Jane', labels: [], createdAt: new Date(), updatedAt: new Date() }
    ]
  },
  {
    id: 'list-3',
    name: 'Review',
    boardId: 'board-1',
    order: 2,
    cards: [
      { id: 'card-6', title: 'Code review: API endpoints', description: 'Review REST endpoints implementation', listId: 'list-3', order: 0, assignee: 'Bob', labels: [], createdAt: new Date(), updatedAt: new Date() }
    ]
  },
  {
    id: 'list-4',
    name: 'Done',
    boardId: 'board-1',
    order: 3,
    cards: [
      { id: 'card-7', title: 'Project kickoff meeting', description: 'Initial team meeting completed', listId: 'list-4', order: 0, labels: [{ id: 'l3', name: 'Done', color: '#22c55e' }], createdAt: new Date(), updatedAt: new Date() }
    ]
  }
];

