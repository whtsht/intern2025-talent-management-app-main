'use client';

import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { signInWithRedirect } from 'aws-amplify/auth';
import { useAuth } from '../contexts/AuthContext';

const AuthButton: React.FC = () => {
  const { user, isLoading, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: 'Cognito' });
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={20} />
        <span>Loading...</span>
      </Box>
    );
  }

  if (user) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <span>Welcome, {user.username}</span>
        <Button variant="outlined" onClick={signOut}>
          Sign Out
        </Button>
      </Box>
    );
  }

  return (
    <Button variant="contained" onClick={handleSignIn}>
      Sign In
    </Button>
  );
};

export default AuthButton;