'use client';

import { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  Typography, 
  Box, 
  Paper,
  Container,
  Grid,
  Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingIndicator } from '@/components/atoms/LoadingIndicator';
import { StatusMessage } from '@/components/atoms/StatusMessage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [isEmulator, setIsEmulator] = useState(false);
  const { login, signup, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsEmulator(process.env.NODE_ENV !== 'production');
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/main');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    try {
      if (isLoginMode) {
        await login(email, password);
        setMessage({ text: 'Login successful!', type: 'success' });
      } else {
        await signup(email, password);
        setMessage({ text: 'Account created successfully! You can now log in.', type: 'success' });
        setIsLoginMode(true);
      }
    } catch (err) {
      setMessage({ 
        text: err instanceof Error ? err.message : 'Authentication failed', 
        type: 'error' 
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid 
        container 
        direction="column" 
        justifyContent="center" 
        style={{ minHeight: '100vh' }}
      >
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>
          {isEmulator && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Using Firebase Auth Emulator (http://localhost:9099)
            </Alert>
          )}
          <Box component="form" noValidate autoComplete="off">
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <LoadingIndicator size={24} /> : 'Login'}
            </Button>
            {message && (
              <StatusMessage message={message.text} type={message.type} align="center" />
            )}
          </Box>
        </Paper>
      </Grid>
    </Container>
  );
}
