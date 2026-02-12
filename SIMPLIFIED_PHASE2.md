# SyncBoard - Simplified Phase 2 Plan


---

## 🎯 Core Philosophy

**SyncBoard  Real-Time Collaboration for ALL Members**

The key feature :

- **SyncBoard**: ALL board members can update their work in real-time

---

## 📋 Simplified User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SIMPLE 3-STEP WORKFLOW                       │
└─────────────────────────────────────────────────────────────────┘

STEP 1: TEAM LEAD CREATES BOARD
┌─────────────────┐
│  Team Lead       │
│  Creates Board  │
│  "Q1 Project"   │
│                 │
│  ┌───────────┐  │
│  │ Board     │  │
│  │ Created!  │  │
│  └───────────┘  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  [Invite Members│
│   via Email]   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  John joins     │
│  Sarah joins    │
│  Mike joins     │
│                 │
│  All 4 members │
│  now on board   │
└────────┬────────┘
                

STEP 2: MEMBERS CREATE LISTS & CARDS
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  JOHN                    SARAH                   MIKE   │
│  ─────                   ─────                   ─────  │
│  Creates "To Do"        Creates "In Progress"  Creates│
│  Adds cards:            Adds cards:             "Done" │
│  - Task A               - Task C                Adds  │
│  - Task B               - Task D                cards: │
│                        - Task E                 - Task │
│                                                 F      │
└─────────────────────────────────────────────────────────┘
         │
         │ ALL MEMBERS SEE UPDATES INSTANTLY
         ▼


STEP 3: EVERYONE UPDATES THEIR OWN WORK
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  REAL-TIME COLLABORATION (Key Feature!)                     │
│                                                             │
│  John drags "Task A" from "To Do" → "In Progress"          │
│  ────────────────────────────────────────────               │
│  Sarah sees it instantly!                                    │
│  Mike sees it instantly!                                     │
│  Team Lead sees it instantly!                                │
│                                                             │
│  Sarah adds comment on "Task D"                             │
│  ─────────────────────────                                  │
│  Everyone sees: "Sarah commented on Task D"                 │
│                                                             │
│  Mike marks "Task F" as done                                │
│  ────────────────────────                                   │
│  Progress bar updates for everyone!                         │
│                                                             │
│  No need for team lead to update everything!                │
│  EVERYONE updates their own work!                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 What Makes SyncBoard Different?

| Features |  | SyncBoard |
|---------|--------|-----------|
| Who can create lists? | Board members | Board members ✅ |
| Who can create cards? | Board members | Board members ✅ |
| Who can move cards? | ALL members ✅ |
| Who can edit cards? | Assigned member- ALL members ✅ |
| Who can comment? | Board members | Board members ✅ |
| Real-time updates?  YES! ✅ |

---

## 📦 What We Actually Need to Build (Simplified)

### Core Features (Must Have)
```
✅ Board Creation
✅ Invite Members (email)
✅ Create Lists
✅ Create Cards
✅ Move Cards (drag & drop)
✅ Edit Card Details
✅ Real-time Updates (all members see changes)
✅ Member Presence (who's online)
```

### Nice to Have (Later)
```
❌ Comments
❌ Checklists
❌ Labels
❌ Due Dates
❌ Activity Log
❌ Attachments
```

---

## 🎨 Simple UI Design

### Board View
```
┌─────────────────────────────────────────────────────────────┐
│  📁 Q1 Project                                    👤👤👤  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ 📋 To Do    │  │ 🔄 In Prog  │  │ ✅ Done     │        │
│  │ [⋮]        │  │ [⋮]        │  │ [⋮]        │        │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤        │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │        │
│  │ │Task A   │ │  │ │Task C   │ │  │ │Task F   │ │        │
│  │ │👤 John  │ │  │ │👤 Sarah │ │  │ │👤 Mike  │ │        │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │        │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │             │        │
│  │ │Task B   │ │  │ │Task D   │ │  │             │        │
│  │ │👤 John  │ │  │ │👤 Sarah │ │  │             │        │
│  │ └─────────┘ │  │ └─────────┘ │  │             │        │
│  │ [+ Add]    │  │ [+ Add]    │  │ [+ Add]      │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  [+ Add New List]                            [Share Board]│ │
└─────────────────────────────────────────────────────────────┘
```

### Card (Simple)
```
┌─────────────────────────────────┐
│  Task Title                     │
│                                 │
│  👤 Assigned Member             │
│  🟢 Online Indicator            │
└─────────────────────────────────┘
```

### Card Modal (Simplified)
```
┌─────────────────────────────────────┐
│  ✕                                 │
│                                     │
│  Task Title                  [Edit]│
│  ───────────────────────────────────
│                                     │
│  Description:                      │
│  [Click to add description...]     │
│                                     │
│  Assigned: 👤 John                 │
│  ───────────────────────────────────
│                                     │
│  [💬 Comments]                     │
│  ───────────────────────────────────
│                                     │
│  [Move] [Archive] [Share]          │
└─────────────────────────────────────┘
```

---

## 🏗️ Simplified Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Angular)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Board Detail Component                              │   │
│  │ - Shows all lists horizontally                      │   │
│  │ - Handles drag & drop                              │   │
│  │ - Real-time updates via WebSocket                   │   │
│  └─────────────────────────────────────────────────────┘   │
│           │                      │                          │
│           ▼                      ▼                          │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ List Component   │  │ Card Component   │                │
│  │ - List header    │  │ - Card display  │                │
│  │ - Cards container│  │ - Click to edit  │                │
│  │ - Add card       │  │ - Drag handle   │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Spring Boot)                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ REST APIs                                            │   │
│  │ - POST /boards - Create board                       │   │
│  │ - POST /boards/{id}/invite - Invite members         │   │
│  │ - POST /lists - Create list                         │   │
│  │ - POST /cards - Create card                         │   │
│  │ - PUT /cards/{id}/move - Move card                  │   │
│  │ - PUT /cards/{id} - Update card                     │   │
│  └─────────────────────────────────────────────────────┘   │
│           │                      │                          │
│           ▼                      ▼                          │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ WebSocket        │  │ PostgreSQL      │                │ 
│  │ - STOMP broker   │  │ - boards table  │                │
│  │ - Broadcast to   │  │ - lists table   │                │
│  │   all members    │  │ - cards table    │                │
│  └──────────────────┘  │ - members table  │                │
│                        └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Database Schema (Simplified)

```sql
-- Boards table
CREATE TABLE boards (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Board Members table
CREATE TABLE board_members (
    board_id VARCHAR(36) REFERENCES boards(id),
    user_id VARCHAR(36) NOT NULL,
    role VARCHAR(20) DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (board_id, user_id)
);

-- Lists table
CREATE TABLE lists (
    id VARCHAR(36) PRIMARY KEY,
    board_id VARCHAR(36) REFERENCES boards(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cards table
CREATE TABLE cards (
    id VARCHAR(36) PRIMARY KEY,
    list_id VARCHAR(36) REFERENCES lists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    assigned_to VARCHAR(36),  -- User ID
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Implementation Steps (Simplified)

### Step 1: Board Service & Models
```
1. Create board.models.ts
   - Board interface
   - List interface  
   - Card interface

2. Create board.service.ts
   - getBoards()
   - createBoard()
   - getBoard(id)
   - inviteMember(boardId, email)
```

### Step 2: Board Detail Component
```
3. Create board-detail component
   - Show board header (title + invite button)
   - Show member avatars
   - Horizontal list container
   - Add list button
   - Connect to board service
```

### Step 3: List Component
```
4. Create list component
   - List header (title + menu)
   - Cards container
   - Add card button
   - Drag & drop support
```

### Step 4: Card Component
```
5. Create card component
   - Card title
   - Assigned member avatar
   - Click to open modal
   - Drag handle
```

### Step 5: WebSocket Service (Real-Time!)
```
6. Create websocket.service.ts
   - Connect to STOMP endpoint
   - Subscribe to board updates
   - Broadcast changes to all members
   
7. Update components to:
   - Listen for real-time events
   - Update UI instantly when data changes
```

### Step 6: Invite Members
```
8. Create invite modal
   - Email input
   - Send invitation
   - Backend sends email
```

---

## 
---

## ✅ Minimum Viable Product (MVP)

**What we need for Phase 2 MVP:**

1. **Board Creation & Viewing**
   - Create board (already have button)
   - View board with lists

2. **List
   - Create list
   - Rename list
   - Delete list
   - Move lists

3. **Cards**
   - Create card
   - Edit card title
   - Delete card
   - Move cards between lists
   - Drag & drop

4. **Collaboration**
   - Invite members via email
   - Real-time updates (all members see changes)

5. **Member Presence**
   - Show who's online
   - Show who's editing what

---

## 🎯 Key Takeaway

**SyncBoard =  Real-Time Updates for Everyone**

- Team Lead creates board + invites members
- ALL members create lists and cards
- ALL members move cards and update progress
- NO bottleneck - everyone updates their own work
- Real-time updates mean everyone sees changes instantly


