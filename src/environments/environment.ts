import { endpoints } from '../app/config/endpoints';

export const environment = {
  production: false,
  apiUrl: `https://syncboard-ptvu.onrender.com/`,
  api: {
    basePath: 'api/v2.0',
    endpoints: endpoints
  }
  
};

