import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, Grid, CircularProgress, Stepper, Step, StepLabel
} from '@mui/material';
import { Person, Email, Lock, Phone, FloodOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 700));
    const result = register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    if (result.success) {
      toast.success('Account created! Welcome to ReliefTrack.');
      navigate('/citizen/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 40%, #F57C00 100%)',
      py: 4, px: 2,
    }}>
      {/* decorations */}
      {[...Array(4)].map((_, i) => (
        <Box key={i} sx={{
          position: 'absolute', borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
          width: [200, 300, 150, 250][i], height: [200, 300, 150, 250][i],
          top: ['5%', '60%', '40%', '80%'][i], left: ['70%', '80%', '-5%', '20%'][i],
        }} />
      ))}

      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 520 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: 3, mx: 'auto', mb: 1.5,
            background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FloodOutlined sx={{ fontSize: 32, color: '#fff' }} />
          </Box>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>Create Account</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>Join ReliefTrack as a citizen</Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Citizen Registration</Typography>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Full Name" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Person color="primary" /></InputAdornment> }}
                    required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email Address" type="email" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Email color="primary" /></InputAdornment> }}
                    required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone Number" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Phone color="primary" /></InputAdornment> }}
                    required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Password" type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment>,
                      endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)}>{showPass ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                    }}
                    required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Confirm Password" type="password" value={form.confirmPassword}
                    onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment> }}
                    required />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" size="large" type="submit" disabled={loading} sx={{ py: 1.5 }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2.5 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#1565C0', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
