export const environment = {
  production: false,
  apiUrl: `http://10.20.33.63:8082/`,
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

