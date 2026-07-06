import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Grid, Button, Avatar, Divider,
  CircularProgress, Alert
} from '@mui/material';
import { Person, Email, Phone, Save, Lock } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function CitizenProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    const updated = { ...user, ...form };
    localStorage.setItem('relieftrack_user', JSON.stringify(updated));
    toast.success('Profile updated successfully!');
    setSaving(false);
  };

  const handlePassChange = async () => {
    if (!passForm.current) { toast.error('Enter your current password'); return; }
    if (passForm.newPass !== passForm.confirm) { toast.error('Passwords do not match'); return; }
    if (passForm.newPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    toast.success('Password changed successfully!');
    setPassForm({ current: '', newPass: '', confirm: '' });
    setSaving(false);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} color="primary.dark" mb={3}>My Profile</Typography>

      {/* Profile Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: '#1565C0', fontSize: 32, fontWeight: 700 }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              <Typography variant="caption" sx={{ bgcolor: '#E3F2FD', color: '#1565C0', px: 1, py: 0.3, borderRadius: 1, fontWeight: 700 }}>
                {user?.role}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Personal Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'primary.main' }} /> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email Address" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'primary.main' }} /> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                InputProps={{ startAdornment: <Phone sx={{ mr: 1, color: 'primary.main' }} /> }} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save />} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Change Password</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Current Password" type="password" value={passForm.current}
                onChange={e => setPassForm(p => ({ ...p, current: e.target.value }))}
                InputProps={{ startAdornment: <Lock sx={{ mr: 1, color: 'primary.main' }} /> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="New Password" type="password" value={passForm.newPass}
                onChange={e => setPassForm(p => ({ ...p, newPass: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Confirm New Password" type="password" value={passForm.confirm}
                onChange={e => setPassForm(p => ({ ...p, confirm: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="secondary" onClick={handlePassChange} disabled={saving}>Change Password</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
