# Core Concepts: Boards, Lists, and Cards
## Detailed Explanation for SyncBoard

---

## 🗂️ BOARD

### What is a Board?

A **Board** is the highest-level container in SyncBoard. It's like a physical whiteboard or a digital project space where teams collaborate.

### Real-World Analogy

```
┌─────────────────────────────────────────────────────────────────┐
│                        PHYSICAL BOARD                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  📌 STICKY NOTES ORGANIZED IN COLUMNS                     │  │
│  │                                                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │  │
│  │  │  TO DO   │  │ IN PROGRESS│ │   DONE   │               │  │
│  │  │  📌📌📌  │  │  📌📌    │  │  📌📌📌  │               │  │
│  │  └──────────┘  └──────────┘  └──────────┘               │  │
│  │                                                           │  │
│  │  Team members add, move, and complete sticky notes       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Board Properties

| Property | Description | Example |
|----------|-------------|---------|
| `id` | Unique identifier | "board-123" |
| `name` | Board title | "Website Redesign Project" |
| `description` | Board purpose | "Tracking all tasks for Q1 website redesign" |
| `workspaceId` | Parent workspace | "workspace-456" |
| `visibility` | Who can see | "PRIVATE", "WORKSPACE", "PUBLIC" |
| `members` | Who has access | Array of user objects |
| `lists` | Columns on board | Array of List objects |
| `createdBy` | Who created it | User ID of creator |
| `createdAt` | When created | Date timestamp |

### Board Use Cases

#### Use Case 1: Single Project Board
```
Board: "Website Redesign Project"
Purpose: Track all tasks for redesigning company website
Members: 5 developers, 2 designers, 1 project manager
Lists: "Backlog", "In Progress", "Code Review", "Done"
```

#### Use Case 2: Sprint Board
```
Board: "Sprint 12 - January"
Purpose: Two-week sprint for mobile app features
Members: Entire development team
Lists: "To Do", "In Progress", "Testing", "Deployed"
```

#### Use Case 3: Kanban Board
```
Board: "Customer Support Queue"
Purpose: Track and prioritize support tickets
Members: Support team members
Lists: "New Tickets", "In Progress", "Waiting on Customer", "Resolved"
```

### Board Actions (What Users Can Do)

| Action | Description | Who Can Do |
|--------|-------------|------------|
| Create Board | Start a new project space | Any logged-in user |
| Rename Board | Change board name | Board members |
| Change Description | Update board purpose | Board members |
| Invite Members | Add collaborators | Board members |
| Remove Members | Revoke access | Board members |
| Archive Board | Soft delete (hide from view) | Board members |
| Delete Board | Permanently remove | Board owner |
| Change Visibility | Public/Private/Workspace | Board members |
| Star Board | Quick access in dashboard | Board members |
| Copy Board | Duplicate board structure | Board members |

### Board Dashboard View (Your Current Implementation)

```
┌─────────────────────────────────────────────────────────────────┐
│  YOUR BOARDS                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │ 📁 Website      │  │ 📁 Mobile App  │  │ 📁 Q1 Marketing │   │
│  │   Redesign      │  │   Project      │  │   Campaign      │   │
│  │                 │  │                 │  │                 │   │
│  │  👤👤👤 (3)     │  │  👤👤 (2)      │  │  👤👤👤👤 (4)   │   │
│  │  📝 Updated 2h  │  │  📝 Updated 5m │  │  📝 Updated 1d  │   │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘   │
│                                                                 │
│  [+ Create New Board]                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Board Detail View (What We'll Build)

```
┌─────────────────────────────────────────────────────────────────┐
│  📁 Website Redesign Project                                    │
│  ⋮ Menu  👤👤👤 [Share]                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │ Backlog    │  │ In Progress│  │ Code Review│  │   Done     │ │
│  │ [...]      │  │ [...]      │  │ [...]      │  │ [...]      │ │
│  ├────────────┤  ├────────────┤  ├────────────┤  ├────────────┤ │
│  │ ┌────────┐ │  │ ┌────────┐ │  │ ┌────────┐ │  │ ┌────────┐ │ │
│  │ │Card 1  │ │  │ │Card 4  │ │  │ │Card 7  │ │  │ │Card 10 │ │ │
│  │ └────────┘ │  │ │ ┌────────┐ │  │ └────────┘ │  │ └────────┘ │ │
│  │ ┌────────┐ │  │ ││Card 5  │ │  │ ┌────────┐ │  │             │ │
│  │ │Card 2  │ │  │ │└────────┘ │  │ │Card 8  │ │  │             │ │
│  │ └────────┘ │  │ ┌────────┐ │  │ └────────┘ │  │             │ │
│  │ ┌────────┐ │  │ │Card 6  │ │  │ ┌────────┐ │  │             │ │
│  │ │Card 3  │ │  │ │└────────┘ │  │ │Card 9  │ │  │             │ │
│  │ └────────┘ │  │ └──────────┘  │ └────────┘ │  │             │ │
│  │ [+ Add]   │  │ [+ Add]        │ [+ Add]    │  │ [+ Add]     │ │
│  └────────────┘  └────────────────┴────────────┘  └────────────┘ │
│                                                                 │
│  [+ Add Another List]                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 LIST

### What is a List?

A **List** is a column on a board that represents a stage, category, or status. Lists organize cards horizontally on a board.

### Real-World Analogy

```
┌─────────────────────────────────────────────────────────────────┐
│                    KANBAN WORKFLOW                              │
│                                                                 │
│  List: "To Do"          List: "In Progress"    List: "Done"      │
│  ┌─────────────────┐   ┌─────────────────┐   ┌───────────────┐ │
│  │ 📝 Task A       │   │ 🚀 Task D       │   │ ✅ Task G      │ │
│  │ 📝 Task B       │   │ 🚀 Task E       │   │ ✅ Task H      │ │
│  │ 📝 Task C       │   │                 │   │ ✅ Task I      │ │
│  └─────────────────┘   └─────────────────┘   └───────────────┘ │
│                                                                 │
│         ↓                      ↓                    ↓           │
│    Not started          Currently working        Completed      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### List Properties

| Property | Description | Example |
|----------|-------------|---------|
| `id` | Unique identifier | "list-123" |
| `boardId` | Parent board | "board-456" |
| `title` | List name | "In Progress" |
| `position` | Order on board | 1, 2, 3... |
| `cards` | Cards in this list | Array of Card objects |
| `createdAt` | When created | Date timestamp |

### Common List Structures

#### Structure 1: Basic Kanban
```
[ To Do ] → [ In Progress ] → [ Done ]
```

#### Structure 2: Software Development
```
[ Backlog ] → [ To Do ] → [ In Progress ] → [ Code Review ] → [ QA ] → [ Done ]
```

#### Structure 3: Customer Support
```
[ New Tickets ] → [ Triaged ] → [ In Progress ] → [ Waiting on Customer ] → [ Resolved ]
```

#### Structure 4: Marketing Campaign
```
[ Ideas ] → [ Planning ] → [ In Progress ] → [ Review ] → [ Published ]
```

#### Structure 5: Personal Task Management
```
[ Today ] → [ This Week ] → [ Someday ]
```

### List Actions (What Users Can Do)

| Action | Description | Who Can Do |
|--------|-------------|------------|
| Create List | Add new column | Board members |
| Rename List | Change column name | Board members |
| Move List | Reorder columns (drag) | Board members |
| Archive List | Hide column (keeps cards) | Board members |
| Delete List | Remove column + cards | Board members |
| Copy List | Duplicate column + cards | Board members |

### List Visual Elements

```
┌─────────────────────────────────────────┐
│  In Progress                    [...]  │  ← Menu button
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🏷️ Bug                          │   │  ← Card with labels
│  │                                 │   │
│  │  Fix login page CSS issue       │   │  ← Card title
│  │                                 │   │
│  │  📅 Tomorrow    👤 🧑 👩        │   │  ← Due date + members
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🏷️ Feature                      │   │
│  │                                 │   │
│  │  Add dark mode toggle           │   │
│  │                                 │   │
│  │  📅 Friday       👤             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [+ Add a card]                        │  ← Add card button
└─────────────────────────────────────────┘
```

### List States

| State | Description | Visual |
|-------|-------------|--------|
| Active | Normal state | Full height, scrollable |
| Collapsed | Hidden cards | Only header visible |
| Archived | Hidden from board | Not visible (can be restored) |

---

## 📦 CARD

### What is a Card?

A **Card** is the fundamental unit of work in SyncBoard. It represents a single task, item, or piece of work that needs to be tracked.

### Real-World Analogy

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHYSICAL CARD (Index Card)                  │
│                                                                 │
│  ┌─────────────────────────────────────────┐                   │
│  │  🏷️ BUG  🏷️ FRONTEND                   │  ← Labels          │
│  │                                         │                   │
│  │  Fix navigation menu responsiveness     │  ← Title (what)   │
│  │                                         │                   │
│  │  The mobile menu doesn't scroll on     │  ← Description    │
│  │  iOS devices. Need to add overflow:    │    (details)      │
│  │  auto to the nav container.            │                   │
│  │                                         │                   │
│  │  ─────────────────────────────────────  │                   │
│  │  📅 Due: Friday, Jan 15                 │  ← Due date       │
│  │  👤 Assigned: Sarah (Avatar)            │  ← Members        │
│  │  💬 3 comments                          │  ← Activity       │
│  └─────────────────────────────────────────┘                   │
│                                                                 │
│                    DIGITAL CARD                                 │
│                                                                 │
│  ┌─────────────────────────────────────────┐                   │
│  │ [LABEL] [LABEL]                        │                   │
│  │                                         │                   │
│  │  Fix navigation menu responsiveness     │                   │
│  │                                         │                   │
│  │  📅 Tomorrow         👤 🧑 👩  💬3     │                   │
│  └─────────────────────────────────────────┘                   │
│                                                                 │
│  Click to open full card details →      │                     │
│                                         │                     │
│  ┌─────────────────────────────────────────┐                 │
│  │ Title: Fix navigation menu...          │                 │
│  │ Description: (full details)             │                 │
│  │ Members: Sarah, John, Mike              │                 │
│  │ Labels: Bug, Frontend, High Priority   │                 │
│  │ Due Date: Friday, Jan 15                │                 │
│  │ Checklist: 3/5 items completed          │                 │
│  │ Attachments: 2 files                    │                 │
│  │ Comments: 3 comments                   │                 │
│  │ Activity: 5 actions                    │                 │
│  └─────────────────────────────────────────┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Card Properties

| Property | Description | Example |
|----------|-------------|---------|
| `id` | Unique identifier | "card-123" |
| `listId` | Parent list | "list-456" |
| `title` | Card title | "Fix login bug" |
| `description` | Detailed information | Markdown or plain text |
| `position` | Order within list | 0, 1, 2... |
| `priority` | Urgency level | "LOW", "MEDIUM", "HIGH" |
| `dueDate` | Deadline | Date object |
| `labels` | Category tags | Array of Label objects |
| `memberIds` | Assigned users | Array of user IDs |
| `comments` | Discussion | Array of Comment objects |
| `attachments` | Files | Array of file objects |
| `checklist` | Sub-tasks | Array of checklist items |
| `cover` | Card cover image | URL or color |
| `createdBy` | Who created | User ID |
| `createdAt` | When created | Date timestamp |
| `updatedAt` | Last modified | Date timestamp |

### Card Types

| Type | Description | Example |
|------|-------------|---------|
| Task | Work item to complete | "Fix bug", "Write code" |
| Bug | Issue to resolve | "Login fails on Safari" |
| Feature | New functionality | "Add dark mode" |
| Idea | Brainstorming item | "Consider AI features" |
| Reminder | Time-based alert | "Review sprint goals" |

### Card Visual States

| State | Description | Visual Indicator |
|-------|-------------|------------------|
| Normal | Default state | Standard card |
| Overdue | Past due date | Red border/due date |
| Due Soon | Due within 24h | Orange due date |
| Completed | All tasks done | Green checkmark |
| Archived | Hidden | Not visible |
| Selected | User clicked | Highlighted border |

### Card Actions (What Users Can Do)

| Action | Description | Result |
|--------|-------------|--------|
| Create Card | Add new task | Card appears in list |
| Edit Title | Change card name | Updated everywhere |
| Edit Description | Add details | Rich text support |
| Move Card | Change list | Different column |
| Reorder Card | Change position | Different order in list |
| Assign Member | Add responsible person | Shows avatar on card |
| Unassign Member | Remove person | Avatar removed |
| Add Label | Tag category | Colored chip appears |
| Remove Label | Untag | Chip removed |
| Set Due Date | Add deadline | Date badge appears |
| Remove Due Date | Clear deadline | Date badge removed |
| Add Comment | Start discussion | Comment appears |
| Add Checklist | Break into tasks | Checklist added |
| Add Attachment | Link file | Attachment appears |
| Copy Card | Duplicate | Copy created |
| Archive Card | Hide from board | Moved to archive |
| Delete Card | Permanently remove | Gone forever |
| Subscribe | Get notifications | User follows card |
| Unsubscribe | Stop notifications | User unfollows card |

### Card Detail Modal Sections

```
┌─────────────────────────────────────────────────────────────────┐
│  ✕                                                               │
│                                                                   │
│  [List Name] > Card Title                                [...] │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                             │ │
│  │  🏷️ Labels                                                  │ │
│  │  [Bug 🔴] [Frontend 🔵] [High Priority 🟠]        [+ Add] │ │
│  │                                                             │ │
│  │  👤 Members                                                │ │
│  │  (Avatar) John  (Avatar) Sarah                    [+ Add] │ │
│  │                                                             │ │
│  │  📅 Due Date                                               │ │
│  │  January 15, 2025 at 9:00 AM                    [x Clear] │ │
│  │                                                             │ │
│  │  ─────────────────────────────────────────────────────────  │ │
│  │                                                             │ │
│  │  📝 Description                                            │ │
│  │  ─────────────────────────────────────────────────────────  │ │
│  │  |                                                         | │ │
│  │  |  Click here to add a more detailed description...       | │ │
│  │  |                                                         | │ │
│  │  |  Use **bold** for *italic* and `code` for inline        | │ │
│  │  |                                                         | │ │
│  │  |  - Bullet points work too                              | │ │
│  │  |  - Like this                                           | │ │
│  │  |                                                         | │ │
│  │  ─────────────────────────────────────────────────────────  │ │
│  │                                                             │ │
│  │  📋 Checklist                                              │ │
│  │  [ ] Implement fix for mobile menu                  [x]     │ │
│  │  [ ] Test on iOS Safari                                 [ ]   │ │
│  │  [ ] Test on Android Chrome                             [ ]   │ │
│  │  [ ] Get code review approval                           [ ]   │ │
│  │  [ ] Merge to main branch                               [ ]   │ │
│  │                                                     [Add]   │ │
│  │                                                             │ │
│  │  📎 Attachments                                           │ │
│  │  📄 screenshot.png                          [Download]     │ │
│  │  📄 mobile-menu-bug.mp4                    [Download]     │ │
│  │                                                      [Add] │ │
│  │                                                             │ │
│  │  ─────────────────────────────────────────────────────────  │ │
│  │                                                             │ │
│  │  💬 Comments                                               │ │
│  │  ─────────────────────────────────────────────────────────  │ │
│  │                                                             │ │
│  │  👤 Sarah - 2 hours ago                                    │ │
│  │  I started working on this. The overflow issue is in       │ │
│  │  the nav-container CSS class.                             │ │
│  │                                                             │ │
│  │  👤 John - 1 hour ago                                      │ │
│  │  Great! Let me know if you need help with testing.          │ │
│  │                                                             │ │
│  │  👤 You - Just now                                         │ │
│  │  [Write a comment...]                        [Send]       │ │
│  │                                                             │ │
│  │  ─────────────────────────────────────────────────────────  │ │
│  │                                                             │ │
│  │  Power-Ups (if enabled)                                    │ │
│  │  🔗 GitHub: Issue #123 - Fix mobile menu                    │ │
│  │  📅 Calendar: Due Jan 15                                   │ │
│  │                                                             │ │
│  │  ─────────────────────────────────────────────────────────  │ │
│  │                                                             │ │
│  │  ──────── Actions ────────                                 │ │
│  │                                                             │ │
│  │  [Move]  [Copy]  [Archive]  [Share]  [⋯]                    │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Card Checklist Feature

```
📋 Checklist: "Steps to Complete"
┌─────────────────────────────────────────┐
│ [ ] Step 1: Research                    │  ← 0/5 completed
├─────────────────────────────────────────┤
│ [✓] Step 2: Design prototype            │  ← 1/5 completed
├─────────────────────────────────────────┤
│ [ ] Step 3: Implement code             │  ← 1/5 completed
├─────────────────────────────────────────┤
│ [ ] Step 4: Write tests                 │  ← 1/5 completed
├─────────────────────────────────────────┤
│ [ ] Step 5: Deploy to production        │  ← 1/5 completed
└─────────────────────────────────────────┘
          Progress: 1/5 (20%)
```

---

## 🔄 How They Work Together

### The Workflow

```
1. USER CREATES BOARD
   ↓
   "Website Redesign Project" created
   ↓
2. USER ADDS LISTS (Columns)
   ↓
   [ Backlog ] [ To Do ] [ In Progress ] [ Done ]
   ↓
3. USER ADDS CARDS (Tasks)
   ↓
   [ Backlog ]          [ To Do ]          [ In Progress ]    [ Done ]
   ┌──────────┐       ┌──────────┐        ┌──────────┐       ┌──────────┐
   │Card 1    │       │Card 4   │        │Card 7    │       │Card 10  │
   │Card 2    │       │Card 5   │        │Card 8    │       └──────────┘
   │Card 3    │       │Card 6   │        │Card 9    │
   │Card 11   │       └──────────┘        └──────────┘
   └──────────┘
   ↓
4. USER MOVES CARDS (Progress)
   ↓
   Drag Card 4 from [ To Do ] → [ In Progress ]
   ↓
   Card 4 now visible in In Progress column
   ↓
   Activity logged: "John moved Card 4 to In Progress"
   ↓
   All members see update in real-time
   ↓
5. CARD COMPLETED
   ↓
   Drag Card 9 from [ In Progress ] → [ Done ]
   ↓
   Card marked as complete
   ↓
   Progress tracked: 3/10 cards done (30%)
```

### Data Hierarchy

```
BOARD (Highest Level)
│
├── Properties: id, name, description, visibility, members, settings
│
└── LISTS (Array)
    │
    ├── List 1: "Backlog"
    │   ├── Properties: id, title, position
    │   │
    │   └── CARDS (Array)
    │       ├── Card A (with full details)
    │       ├── Card B
    │       └── Card C
    │
    ├── List 2: "To Do"
    │   └── CARDS (Array)
    │       ├── Card D
    │       └── Card E
    │
    ├── List 3: "In Progress"
    │   └── CARDS (Array)
    │       └── Card F
    │
    └── List 4: "Done"
        └── CARDS (Array)
            └── Card G
```

---

## 🎯 Key Differences Summary

| Concept | Board | List | Card |
|---------|-------|------|------|
| **Purpose** | Container for entire project | Category/Stage/Status | Individual task/item |
| **Level** | Highest | Middle | Lowest |
| **Contains** | Lists | Cards | Comments, checklists, attachments |
| **Horizontal Position** | N/A (board itself) | Columns left-to-right | Vertical stack in list |
| **Example** | "Q1 Marketing Campaign" | "In Progress" | "Write blog post about AI" |
| **Actions** | Create, Rename, Delete, Invite | Create, Rename, Move, Archive | Create, Edit, Move, Archive, Comment |
| **Drag & Drop** | N/A | Reorder lists | Reorder cards, move between lists |
| **Visibility** | Entire board visible/hidden | All lists visible on board | All cards visible in list |
| **Members** | Board-level permissions | Inherited from board | Assigned individuals |

---

## 📝 Summary

### Board = Project
- High-level container
- Groups related work
- Has members (collaborators)
- Has settings (visibility)

### List = Stage/Category
- Column on a board
- Organizes cards horizontally
- Represents workflow stages
- Can be reordered

### Card = Task
- Individual work item
- Contains all details
- Moves through lists
- Assigned to members
- Has due dates, labels, comments

This three-level hierarchy (Board → List → Card) is the foundation of Trello-like applications and enables flexible, visual project management for teams of any size.

