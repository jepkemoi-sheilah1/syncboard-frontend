export const endpoints = {
    
  auth: {
    login: '/user/login',
    register:'/user/register',
    confirm: '/user/confirm',
    update: '/user/update', 
    resetPassword: '/user/reset-password',
    resetPasswordRequest: '/user/reset-password-request',
    logout: '/user/logout',
    delete: '/user/delete'
  },

  // board endpoints
    boards: {
    getByWorkspace:'/workspace/{workSpaceId}/boards',
    create: '/workspace/{workSpaceId}/boards',
    delete: '/workspace/boards/{boardId}',
  },

      // Workspace
  workspace: {
    create: '/workspace/create',
    invite: '/workspace/invite',
    acceptInvite: '/workspace/accept-invite',
    myWorkspaces: '/workspace/my-workspaces',
    delete: '/workspace/{id}',
  },

  // Lists
  lists: {
    create: '/list/create',
    getByBoard: '/list/boardLists',
  },

  // Board Members
  boardMembers: {
    add: '/board/{boardId}/members',
    updateRole: '/board/{boardId}/members/{userId}/role',
    remove: '/board/{boardId}/members/{userId}',
  },

  // Card Assignees
  cardAssignees: {
    reassign: '/api/cards/{cardId}/assignees/reassign',
    remove: '/api/cards/{cardId}/assignees/{userId}',
  },

  // Comments
  comments: {
    getByCard: '/api/cards/{cardId}/comments',
    create: '/api/cards/{cardId}/comments',
  },

  // Notifications
  notifications: {
    getAll: '/notifications',
    markRead: '/notifications/{id}/read',
  },

  // Activity Logs
  activityLogs: {
    getByBoard: '/boards/{boardId}/activity-logs',
  },
};
