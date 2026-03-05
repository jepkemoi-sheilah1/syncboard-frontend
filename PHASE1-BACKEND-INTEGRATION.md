# Phase 1: Backend Integration - Detailed Documentation

## Overview
Phase 1 involves connecting the frontend services to the real backend API. Currently, most services use mock data for development. Once your partner completes the backend APIs, we need to switch the frontend to use them.

---

## Current State Analysis

### Services Using Mock Data (DISABLED)

| Service | File | Mock Flag | Current API Calls |
|---------|------|-----------|-------------------|
| ListService | `list.service.ts` | `useMockData = false` | Real API |
| CardService | `card.service.ts` | `useMockData = false` | Real API |
| InvitationService | `invitation.service.ts` | `useMockData = false` | Real API |
| BoardService | `board.service.ts` | No flag | Real API |

### What Happens Currently

```
FRONTEND
=========================================================================

  BoardService         ListService          CardService
       │                   │                    │
       │                   │                    │
       └───────────────────┼────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ Check: useMockData    │
              │ flag                  │
              └───────────┬───────────┘
                          │
           ┌──────────────┴──────────────┐
           │                             │
           ▼                             ▼
   ┌───────────────┐             ┌───────────────┐
   │ useMockData   │             │ useMockData   │
   │ = TRUE        │             │ = FALSE       │
   └───────┬───────┘             └───────┬───────┘
           │                             │
           ▼                             ▼
   ┌───────────────┐             ┌───────────────┐
   │ Return mock   │             │ Make HTTP     │
   │ data locally │             │ call to       │
   │ (in-memory)  │             │ backend       │
   └───────────────┘             └───────┬───────┘
                                         │
                                         ▼
                                 ┌───────────────┐
                                 │   BACKEND API │
                                 │ (Not ready)   │
                                 └───────────────┘
```

---

## What Needs to Happen

### Step 1: Partner Completes Backend APIs
Your partner needs to implement these endpoints:

#### Board APIs (BoardService already uses these - working)
```
GET    /api/v2.0/boards              - Get all boards
GET    /api/v2.0/boards/{id}          - Get single board
POST   /api/v2.0/boards               - Create board
PUT    /api/v2.0/boards/{id}          - Update board
DELETE /api/v2.0/boards/{id}          - Delete board
```

#### List APIs (ListService needs these)
```
GET    /api/v2.0/boards/{boardId}/lists    - Get all lists for board
POST   /api/v2.0/lists                       - Create list
PUT    /api/v2.0/lists/{id}                  - Update list
DELETE /api/v2.0/lists/{id}                  - Delete list
PUT    /api/v2.0/boards/{boardId}/lists/reorder  - Reorder lists
```

#### Card APIs (CardService needs these)
```
GET    /api/v2.0/lists/{listId}/cards       - Get cards for list
GET    /api/v2.0/cards/{id}                 - Get single card
POST   /api/v2.0/cards                      - Create card
PUT    /api/v2.0/cards/{id}                 - Update card
DELETE /api/v2.0/cards/{id}                 - Delete card
PUT    /api/v2.0/cards/{id}/move            - Move card
POST   /api/v2.0/cards/{id}/labels          - Add label
DELETE /api/v2.0/cards/{id}/labels/{labelId} - Remove label
```

#### Invitation APIs (InvitationService needs these)
```
POST   /api/v2.0/boards/{boardId}/invite    - Send invitation
DELETE /api/v2.0/invitations/{id}           - Cancel invitation
GET    /api/v2.0/boards/{boardId}/invites   - Get pending invites
POST   /api/v2.0/invitations/{token}/accept - Accept invitation
POST   /api/v2.0/invitations/{token}/decline - Decline invitation
POST   /api/v2.0/boards/{boardId}/members   - Add member
DELETE /api/v2.0/boards/{boardId}/members/{userId} - Remove member
PUT    /api/v2.0/boards/{boardId}/members/{userId}/role - Update role
```

### Step 2: Update Frontend Services

Once backend is ready, we need to change 3 files:

#### File 1: `src/app/services/list.service.ts`
```typescript
// CHANGE THIS LINE (around line 14):
private useMockData = true;

// TO THIS:
private useMockData = false;
```

#### File 2: `src/app/services/card.service.ts`
```typescript
// CHANGE THIS LINE (around line 15):
private useMockData = true;

// TO THIS:
private useMockData = false;
```

#### File 3: `src/app/services/invitation.service.ts`
```typescript
// CHANGE THIS LINE (around line 14):
private useMockData = true;

// TO THIS:
private useMockData = false;
```

### Step 3: Verify API Endpoints Match

Current services call these URLs (hardcoded, not using endpoints.ts):

**ListService:**
- GET  /api/v2.0/boards/{boardId}/lists
- POST /api/v2.0/lists
- PUT  /api/v2.0/lists/{listId}
- DELETE /api/v2.0/lists/{listId}
- PUT  /api/v2.0/boards/{boardId}/lists/reorder

**CardService:**
- GET  /api/v2.0/lists/{listId}/cards
- GET  /api/v2.0/cards/{cardId}
- POST /api/v2.0/cards
- PUT  /api/v2.0/cards/{cardId}
- DELETE /api/v2.0/cards/{cardId}
- PUT  /api/v2.0/cards/{cardId}/move
- POST /api/v2.0/cards/{cardId}/labels
- DELETE /api/v2.0/cards/{cardId}/labels/{labelId}

**InvitationService:**
- POST /api/v2.0/boards/{boardId}/invite
- DELETE /api/v2.0/invitations/{invitationId}
- GET  /api/v2.0/boards/{boardId}/invites
- POST /api/v2.0/invitations/{token}/accept
- POST /api/v2.0/invitations/{token}/decline
- POST /api/v2.0/boards/{boardId}/members
- DELETE /api/v2.0/boards/{boardId}/members/{userId}
- PUT  /api/v2.0/boards/{boardId}/members/{userId}/role

---

## Current Flow When Using Mock Data

### Example: Creating a List (Current - Mock)

```
User clicks "Add List"
       │
       ▼
BoardDetailComponent.createList()
       │
       ▼
ListService.createList({ name: "To Do", boardId: "123" })
       │
       ▼
┌──────────────────────────────────────┐
│ Check: useMockData === true           │
└─────────────────┬────────────────────┘
                  │
                  ▼ (Mock path - NO network call)
┌──────────────────────────────────────┐
│ 1. Generate ID: "list-1704..."       │
│ 2. Create local list object in       │
│    memory (BehaviorSubject)          │
│ 3. Return mock Observable with      │
│    delay(200ms)                      │
└──────────────────────────────────────┘
       │
       ▼
BoardDetailComponent receives response
       │
       ▼
UI updates via signal subscription
```

### What Happens After Disabling Mock Data

```
User clicks "Add List"
       │
       ▼
BoardDetailComponent.createList()
       │
       ▼
ListService.createList({ name: "To Do", boardId: "123" })
       │
       ▼
┌──────────────────────────────────────┐
│ Check: useMockData === false         │
└─────────────────┬────────────────────┘
                  │
                  ▼ (Real API call)
┌──────────────────────────────────────┐
│ HTTP POST to                         │
│ https://syncboard-ptvu.onrender.com  │
│ /api/v2.0/lists                     │
│                                      │
│ Headers:                             │
│ - Authorization: Bearer {token}     │
│ - Content-Type: application/json    │
│                                      │
│ Body:                               │
│ { "name": "To Do", "boardId": "123" │
│   "order": 0 }                      │
└──────────────────────────────────────┘
       │
       ▼
   Backend processes request
       │
       ▼
   Backend returns created list
       │
       ▼
Frontend updates UI via signal subscription
```

---

## Testing Checklist

After enabling real API:

- [ ] Login and get token (already works)
- [ ] Create a new board (already works)
- [ ] View list of boards (already works)
- [ ] Open a board (get lists) - TEST NEEDED
- [ ] Create a new list - TEST NEEDED
- [ ] Create a new card - TEST NEEDED
- [ ] Edit a card - TEST NEEDED
- [ ] Move card to another list - TEST NEEDED
- [ ] Delete a card - TEST NEEDED
- [ ] Delete a list - TEST NEEDED
- [ ] Invite a member (if UI added) - TEST NEEDED
- [ ] Test error handling - TEST NEEDED

---

## Summary

| What | Status |
|------|--------|
| Partner implements backend APIs | ✅ COMPLETED |
| Update ListService useMockData = false | ✅ DONE |
| Update CardService useMockData = false | ✅ DONE |
| Update InvitationService useMockData = false | ✅ DONE |
| Test full CRUD flow | PENDING |

**Status**: Mock data has been disabled. Services will now make real HTTP calls to the backend.

**Next Step**: Test the integration by running the app!


