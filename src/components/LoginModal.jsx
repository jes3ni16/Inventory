import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
} from '@mui/material';

const LoginModal = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://inventory-server-eight.vercel.app/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json', }
      
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        sessionStorage.setItem('token', data.token); // Store token in sessionStorage
        onLoginSuccess();
        setError('');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <Dialog open={true} onClose={() => {}}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <Typography color="error" style={{ marginBottom: '8px' }}>
              {error}
            </Typography>
          )}
          <DialogActions>
            <Button type="submit" color="primary">
              Login
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
