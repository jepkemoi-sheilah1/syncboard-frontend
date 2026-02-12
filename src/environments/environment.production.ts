export const environment = {
  production: true,
  apiUrl: 'https://api.syncboard.com',
  api: {
    basePath: 'api/v2.0',
    endpoints: {
      auth: {
        login: '/auth/login',
        register: '/auth/register',
        verifyEmail: '/auth/verifyEmail',
        forgotPassword: '/auth/forgotPassword',
        resetPassword: '/auth/resetPassword',
        logout: '/auth/logout',
        deleteAccount: '/auth/deleteAccount'
      }
    }
  }
};

