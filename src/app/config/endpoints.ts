export const endpoints = {
  // USER ENDPOINTS
  auth: {
    login: '/user/login',                    // ✅ POST - Login user
    register: '/user/register',              // ✅ POST - Register new user
    confirm: '/user/confirm',                // ✅ GET - Confirm email
    verifyEmail: '/user/confirm',            // ✅ GET - Same as confirm
    update: '/user/update',                  // ✅ PUT - Update user profile
    resetPassword: '/user/reset-password',   // ✅ POST - Reset password with token
    resetPasswordRequest: '/user/reset-password-request', // ✅ POST - Request password reset
    forgotPassword: '/user/reset-password-request',       // ✅ Same as above
    logout: '/user/logout',                  // ✅ PUT - Logout user
    delete: '/user/delete',                  // ✅ DELETE - Delete account
    deleteAccount: '/user/delete'            // ✅ Same as delete
  },

  // BOARD ENDPOINTS
  boards: {
    getAll: '/boards',                       // ✅ GET - Get all boards
    getById: '/boards/{boardId}',            // ✅ GET - Get specific board
    create: '/boards',                       // ✅ POST - Create new board
    update: '/boards/{boardId}',             // ✅ PUT - Update board
    delete: '/boards/{boardId}',             // ✅ DELETE - Delete board
  },

  // WORKSPACE ENDPOINTS 
  workspace: {
    create: '/workspace/create',             
    invite: '/workspace/invite',
    acceptInvite: '/workspace/accept-invite',
    myWorkspaces: '/workspace/my-workspaces',
    delete: '/workspace/{id}',
  },

  // LIST ENDPOINTS
  lists: {
    create: '/boards/lists',                 // ✅ POST -it  Creates a list
    getByBoard: '/boards/{boardId}/lists',   // ✅ GET - Get all lists for board
    update: '/boards/lists/{listId}',        // ✅ PUT - Update list
    delete: '/boards/lists/{listId}',        // ✅ DELETE - Delete list
    reorder: '/boards/{boardId}/lists/reorder', // ✅ PUT - Reorder lists
  },

  // CARD ENDPOINTS
  cards: {
    create: '/cards',                        // ✅ POST - Create card
    getById: '/cards/{cardId}',              // ✅ GET - Get specific card
    getByList: '/cards/lists/{listId}/cards', // ✅ GET - Get cards in list
    update: '/cards/{cardId}',               // ✅ PUT - Update card
    delete: '/cards/{cardId}',               // ✅ DELETE - Delete card
    move: '/cards/{cardId}/move',            // ✅ PUT - Move card to different list
  },

  // CARD ASSIGNEE ENDPOINTS
  cardAssignees: {
    reassign: '/cards/{cardId}/assignees/reassign',      // ✅ PUT
    remove: '/cards/{cardId}/assignees/{userId}',        // ✅ DELETE
  },

  // BOARD MEMBER ENDPOINTS
  boardMembers: {
    add: '/board/{boardId}/members',                     // ✅ POST
    updateRole: '/board/{boardId}/members/{userId}/role', // ✅ PATCH
    remove: '/board/{boardId}/members/{userId}',         // ✅ DELETE
  },

  // COMMENT ENDPOINTS
  comments: {
    getByCard: '/cards/{cardId}/comments',   // ✅ GET
    create: '/cards/{cardId}/comments',      // ✅ POST
  },

  // NOTIFICATION ENDPOINTS
  notifications: {
    getAll: '/notifications',                // ✅ GET
    markRead: '/notifications/{id}/read',    // ✅ PATCH
  },

  // ACTIVITY LOG ENDPOINTS
  activityLogs: {
    getByBoard: '/boards/{boardId}/activity-logs', 
  },
};