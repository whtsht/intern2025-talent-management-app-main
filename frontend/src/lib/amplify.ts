import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_USER_POOL_DOMAIN || '',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN || 'http://localhost:3000',
          redirectSignOut: process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT || 'http://localhost:3000',
          responseType: 'code',
        },
      },
    },
  },
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;