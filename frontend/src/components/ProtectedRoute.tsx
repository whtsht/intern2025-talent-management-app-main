'use client';

import React from 'react';
import { Box, CircularProgress, Paper, Typography, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { signInWithRedirect } from 'aws-amplify/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: 'Cognito' });
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Authentication Required
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please sign in to access this page.
          </Typography>
          <Button variant="contained" onClick={handleSignIn} sx={{ mt: 2 }}>
            Sign In
          </Button>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;