import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, Divider, Chip, CircularProgress
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, FloodOutlined, Shield } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password);
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}!`);
      navigate(result.user.role === 'ADMIN' ? '/admin/dashboard' : '/citizen/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const quickLogin = (role) => {
    const creds = role === 'admin' ? { email: 'admin@relieftrack.com', password: 'admin123' } : { email: 'rajesh@email.com', password: 'user123' };
    setForm(creds);
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 40%, #1976D2 70%, #01579B 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decorations */}
      {[...Array(6)].map((_, i) => (
        <Box key={i} sx={{
          position: 'absolute', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          width: [300, 200, 400, 150, 250, 350][i],
          height: [300, 200, 400, 150, 250, 350][i],
          top: ['10%', '60%', '-5%', '70%', '30%', '80%'][i],
          left: ['70%', '80%', '-5%', '10%', '50%', '40%'][i],
        }} />
      ))}

      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460, px: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{
            width: 72, height: 72, borderRadius: 3, mx: 'auto', mb: 2,
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.3)',
          }}>
            <FloodOutlined sx={{ fontSize: 36, color: '#fff' }} />
          </Box>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 0.5 }}>ReliefTrack</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
            Disaster Relief Management System
          </Typography>
        </Box>

        <Card sx={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.97)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Sign In</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Enter your credentials to access the platform
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Email Address" type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email color="primary" /></InputAdornment> }}
                sx={{ mb: 2 }} required />
              <TextField fullWidth label="Password" type={showPass ? 'text' : 'password'} value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }} required />
              <Button fullWidth variant="contained" size="large" type="submit" disabled={loading}
                sx={{ py: 1.5, fontSize: '1rem', mb: 2 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </form>

            <Divider sx={{ my: 2 }}><Chip label="Quick Demo Login" size="small" /></Divider>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="outlined" size="small" startIcon={<Shield />}
                onClick={() => quickLogin('admin')} sx={{ borderRadius: 2 }}>
                Admin Login
              </Button>
              <Button fullWidth variant="outlined" size="small" color="secondary"
                onClick={() => quickLogin('citizen')} sx={{ borderRadius: 2 }}>
                Citizen Login
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#1565C0', fontWeight: 600, textDecoration: 'none' }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
