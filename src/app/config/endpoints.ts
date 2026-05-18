export const endpoints = {
  // USER ENDPOINTS
  auth: {
    login: '/user/login',                    
    register: '/user/register',              
    confirm: '/user/confirm',                
    verifyEmail: '/user/confirm',            
    update: '/user/update',                  
    resetPassword: '/user/reset-password',   
    resetPasswordRequest: '/user/reset-password-request', 
    forgotPassword: '/user/reset-password-request',       
    logout: '/user/logout',                  
    delete: '/user/delete',                  
    deleteAccount: '/user/delete'            
  },

  // BOARD ENDPOINTS
  boards: {
    getAll: '/boards',                       
    getById: '/boards/{boardId}',            
    create: '/boards',                 
    update: '/boards/{boardId}',             
    delete: '/boards/{boardId}',             
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
    create: '/boards/lists',                
    getByBoard: '/boards/{boardId}/lists',   
    update: '/boards/lists/{listId}',        
    delete: '/boards/lists/{listId}',        
    reorder: '/boards/{boardId}/lists/reorder',
  },

  // CARD ENDPOINTS
  cards: {
    create: '/cards',                        //  POST - Create card
    getById: '/cards/{cardId}',              //  GET - Get specific card
    getByList: '/cards/lists/{listId}/cards', //  GET - Get cards in list
    update: '/cards/{cardId}',               //  PUT - Update card
    delete: '/cards/{cardId}',               // DELETE - Delete card
    move: '/cards/{cardId}/move',            //  PUT - Move card to different list
  },

  // CARD ASSIGNEE ENDPOINTS
  cardAssignees: {
    reassign: '/cards/{cardId}/assignees/reassign',      //  PUT
    remove: '/cards/{cardId}/assignees/{userId}',        // DELETE
  },

  // BOARD MEMBER ENDPOINTS
  boardMembers: {
    add: '/board/{boardId}/members',                     //  POST
    updateRole: '/board/{boardId}/members/{userId}/role', //  PATCH
    remove: '/board/{boardId}/members/{userId}',         // DELETE
  },

  // COMMENT ENDPOINTS
  comments: {
    getByCard: '/cards/{cardId}/comments',   //  GET
    create: '/cards/{cardId}/comments',      //  POST
  },

  // NOTIFICATION ENDPOINTS
  notifications: {
    getAll: '/notifications',                
    markRead: '/notifications/{id}/read',    
  },

  // ACTIVITY LOG ENDPOINTS
  activityLogs: {
    getByBoard: '/boards/{boardId}/activity-logs', 
  },
};