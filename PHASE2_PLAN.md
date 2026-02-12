# Phase 2: Core Kanban Implementation Plan
## Trello-like Workflow for SyncBoard

## Overview
Based on Trello's workflow analysis, here's what we need to build for Phase 2 to achieve a Trello-like experience where:
1. Board creator (Team Lead) invites members via email
2. Members create lists and cards
3. Members update their work
4. Team Lead manages the entire project

---

## User Flow Summary

### Flow 1: Team Lead Creates Board & Invites Members
```
1. Team Lead clicks "+ New Board"
2. Enters board name: "Project Alpha"
3. Board is created, Team Lead added as first member
4. Team Lead clicks "Share" button
5. Enters member emails (john@email.com, sarah@email.com)
6. System sends invitation emails
7. Members click link, sign up/login
8. Members added to board automatically
```

### Flow 2: Members Create Lists
```
1. Member clicks "+ Add a list"
2. Enters list name: "To Do", "In Progress", "Done"
3. List appears on board
4. All members see it in real-time
```

### Flow 3: Members Create Cards
```
1. Member clicks "+ Add a card" in a list
2. Enters card title: "Fix Login Bug"
3. Card appears in list
4. Card shows: title, member avatar, labels, due date
```

### Flow 4: Members Update Work
```
1. Member clicks on a card
2. Card modal opens with full details
3. Member can:
   - Edit title/description
   - Add/remove members
   - Add labels
   - Set due date
   - Add comments
   - Move card to another list (drag or menu)
4. All updates broadcast to all members in real-time
```

### Flow 5: Drag and Drop
```
1. Member drags card from "To Do" to "In Progress"
2. Card moves instantly
3. All members see the move in real-time
4. Activity log records: "John moved Card X to In Progress"
```

---

## Required Components to Build

### 1. Board Detail Component (`/board-detail`)
**Purpose**: Main board view with all lists and cards

**Features**:
- [ ] Board header with title (editable)
- [ ] "Invite Members" button
- [ ] Member avatars display
- [ ] Horizontal scrolling list container
- [ ] "+ Add a list" button
- [ ] Real-time updates via WebSocket

**UI Structure**:
```
┌─────────────────────────────────────────────┐
│ [Board Title]                    [Avatars] │
│                                  [+ Invite] │
├─────────────────────────────────────────────┤
│ [List 1]   [List 2]   [List 3]   [+ Add]   │
│ ┌───────┐ ┌───────┐ ┌───────┐              │
│ │Card 1 │ │Card 4 │ │Card 7 │              │
│ │Card 2 │ │Card 5 │ │       │              │
│ │Card 3 │ │Card 6 │ │       │              │
│ └───────┘ └───────┘ └───────┘              │
│ [+ Add]   [+ Add]   [+ Add]                │
└─────────────────────────────────────────────┘
```

### 2. List Component (`/lists/list`)
**Purpose**: Display a single list with its cards

**Features**:
- [ ] List title (click to edit)
- [ ] List menu (rename, delete, move)
- [ ] Cards container with drag-and-drop
- [ ] "+ Add a card" button
- [ ] Collapsible

**UI Structure**:
```
┌─────────────────────┐
│ List Title    [...] │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ Card Component  │ │
│ │ Card Component  │ │
│ │ Card Component  │ │
│ └─────────────────┘ │
│ [+ Add a card]      │
└─────────────────────┘
```

### 3. Card Component (`/cards/card`)
**Purpose**: Display card preview in a list

**Features**:
- [ ] Card title
- [ ] Labels (colored chips)
- [ ] Due date badge (red if overdue)
- [ ] Member avatars
- [ ] Click to open modal
- [ ] Drag handle
- [ ] Quick actions on hover

**UI Structure**:
```
┌─────────────────────────────────┐
│ [LABEL] [LABEL]                 │
│                                 │
│  Fix authentication bug         │
│                                 │
│  📅 Tomorrow         👤 🧑 👩   │
└─────────────────────────────────┘
```

### 4. Card Detail Modal (`/cards/card-modal`)
**Purpose**: Full card editing and collaboration

**Features**:
- [ ] Edit title (inline)
- [ ] Description editor
- [ ] Members management
- [ ] Labels management
- [ ] Due date picker
- [ ] Comments section
- [ ] Activity log
- [ ] Attachment section
- [ ] Move/Copy/Archive actions

**UI Structure**:
```
┌─────────────────────────────────────────────┐
│  ✕                                           │
│  [List Name] > Card Title                    │
├─────────────────────────────────────────────┤
│  📝 Description                              │
│  ───────────────────────────────────────────│
│  [Click to add description...]              │
│                                              │
│  🏷️ Labels  [Bug] [Frontend] [+ Add]       │
│  👤 Members  [Avatar] [Avatar] [+ Add]      │
│  📅 Due Date  [Tomorrow] [x]                │
│                                              │
│  ──────── Activity ────────                 │
│  👤 John moved this card 2 hours ago        │
│  👤 Sarah added a comment 1 hour ago        │
│                                              │
│  [Write a comment...     ] [Send]           │
│                                              │
│  ──────── Actions ────────                 │
│  [Move] [Copy] [Archive] [Share] [...]      │
└─────────────────────────────────────────────┘
```

### 5. Invite Members Modal (`/shared/invite-modal`)
**Purpose**: Invite members to board

**Features**:
- [ ] Email input (comma separated)
- [ ] Add button for multiple emails
- [ ] List of invited emails
- [ ] Remove email option
- [ ] Send invitations button

**UI Structure**:
```
┌─────────────────────────────────┐
│  Invite to Board          [✕]  │
├─────────────────────────────────┤
│  Enter email addresses:        │
│  [john@email.com, ]            │
│                                 │
│  or paste multiple:            │
│  [john@email.com               │
│   sarah@email.com              │
│   mike@email.com        ]      │
│                                 │
│  [Cancel]    [Send Invites]    │
└─────────────────────────────────┘
```

---

## Data Models Required

```typescript
// src/app/models/board.models.ts

export interface Board {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  lists: List[];
  members: BoardMember[];
  visibility: 'PUBLIC' | 'PRIVATE' | 'WORKSPACE';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface List {
  id: string;
  boardId: string;
  title: string;
  position: number;
  cards: Card[];
  createdAt: Date;
}

export interface Card {
  id: string;
  listId: string;
  title: string;
  description?: string;
  position: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: Date;
  labels: Label[];
  memberIds: string[];
  comments: Comment[];
  attachments: Attachment[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string; // '#FF0000', '#00FF00', etc.
}

export interface BoardMember {
  userId: string;
  boardId: string;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: Date;
  user?: User; // Populated when fetching
}

export interface Comment {
  id: string;
  cardId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  boardId: string;
  userId: string;
  action: string;
  details: string;
  createdAt: Date;
}
```

---

## Services Required

### 1. Board Service (`/services/board.service.ts`)
```typescript
// CRUD operations for boards
- getBoards(): Observable<Board[]>
- getBoard(id: string): Observable<Board>
- createBoard(board: Partial<Board>): Observable<Board>
- updateBoard(id: string, data: Partial<Board>): Observable<Board>
- deleteBoard(id: string): Observable<void>
- inviteMember(boardId: string, emails: string[]): Observable<void>
- removeMember(boardId: string, userId: string): Observable<void>
```

### 2. List Service (`/services/list.service.ts`)
```typescript
// CRUD operations for lists
- getLists(boardId: string): Observable<List[]>
- createList(list: Partial<List>): Observable<List>
- updateList(id: string, data: Partial<List>): Observable<List>
- deleteList(id: string): Observable<void>
- reorderLists(boardId: string, listIds: string[]): Observable<void>
```

### 3. Card Service (`/services/card.service.ts`)
```typescript
// CRUD operations for cards
- getCards(listId: string): Observable<Card[]>
- createCard(card: Partial<Card>): Observable<Card>
- updateCard(id: string, data: Partial<Card>): Observable<Card>
- deleteCard(id: string): Observable<void>
- moveCard(cardId: string, targetListId: string, position: number): Observable<void>
- reorderCards(listId: string, cardIds: string[]): Observable<void>
```

### 4. WebSocket Service (`/services/websocket.service.ts`)
```typescript
// Real-time updates
- connect(boardId: string): void
- disconnect(): void
- subscribe(topic: string, callback: (data: any) => void): void
- send(destination: string, body: any): void

// Events to handle:
- CARD_CREATED
- CARD_UPDATED
- CARD_MOVED
- CARD_DELETED
- LIST_CREATED
- LIST_UPDATED
- LIST_DELETED
- MEMBER_JOINED
- MEMBER_LEFT
- COMMENT_ADDED
```

---

## Implementation Order

### Week 1: Foundation
1. [ ] Create board models
2. [ ] Create Board Service
3. [ ] Create List Service
4. [ ] Create Card Service
5. [ ] Create Board Detail component skeleton
6. [ ] Create List component
7. [ ] Create Card component

### Week 2: Core Functionality
1. [ ] Implement list creation/deletion
2. [ ] Implement card creation/deletion
3. [ ] Add inline editing for titles
4. [ ] Implement card detail modal
5. [ ] Add Angular CDK drag-and-drop

### Week 3: Real-Time & Polish
1. [ ] Create WebSocket service
2. [ ] Connect to real backend (or mock)
3. [ ] Implement real-time updates
4. [ ] Add member avatars to cards
5. [ ] Add labels functionality
6. [ ] Add due date functionality

### Week 4: Collaboration Features
1. [ ] Create invite members modal
2. [ ] Implement comments section
3. [ ] Add activity log
4. [ ] Add notifications
5. [ ] Final polish and testing

---

## File Structure to Create

```
src/app/
├── models/
│   ├── auth.models.ts (existing)
│   └── board.models.ts (NEW)
├── services/
│   ├── auth.service.ts (existing)
│   ├── board.service.ts (NEW)
│   ├── list.service.ts (NEW)
│   ├── card.service.ts (NEW)
│   └── websocket.service.ts (NEW)
├── components/
│   ├── boards/
│   │   ├── boards.ts (existing - dashboard)
│   │   └── board-detail/ (NEW)
│   │       ├── board-detail.ts
│   │       ├── board-detail.html
│   │       └── board-detail.scss
│   ├── lists/
│   │   └── list/ (NEW)
│   │       ├── list.ts
│   │       ├── list.html
│   │       └── list.scss
│   ├── cards/
│   │   ├── card/ (NEW)
│   │   │   ├── card.ts
│   │   │   ├── card.html
│   │   │   └── card.scss
│   │   └── card-modal/ (NEW)
│   │       ├── card-modal.ts
│   │       ├── card-modal.html
│   │       └── card-modal.scss
│   └── shared/
│       ├── invite-modal/ (NEW)
│       │   ├── invite-modal.ts
│       │   ├── invite-modal.html
│       │   └── invite-modal.scss
│       └── dialog/ (NEW - for create/edit dialogs)
```

---

## Next Steps

Ready to start implementing? I'll begin with:

1. **Create data models** (board.models.ts)
2. **Create services** (board, list, card services)
3. **Create Board Detail component**
4. **Create List and Card components**
5. **Implement drag-and-drop**

Let me know which part you'd like to start with!

