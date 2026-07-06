import React from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip, Button, Avatar, Divider
} from '@mui/material';
import {
  FloodOutlined, AssignmentOutlined, CheckCircleOutlined, PendingActionsOutlined,
  WarningAmberOutlined, ArrowForward, LocationOn, CalendarMonth
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const STATUS_CONFIG = {
  PENDING: { color: 'warning', label: 'Pending' },
  APPROVED: { color: 'success', label: 'Approved' },
  IN_PROGRESS: { color: 'info', label: 'In Progress' },
  COMPLETED: { color: 'success', label: 'Completed' },
  REJECTED: { color: 'error', label: 'Rejected' },
};

const SEVERITY_BG = { HIGH: '#FFF3E0', CRITICAL: '#FFEBEE', MEDIUM: '#E8F5E9', LOW: '#E3F2FD' };
const SEVERITY_COLOR = { HIGH: '#E65100', CRITICAL: '#C62828', MEDIUM: '#2E7D32', LOW: '#1565C0' };

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { disasters, requests } = useData();
  const navigate = useNavigate();

  const myRequests = requests.filter(r => r.userId === user?.id);
  const activeDisasters = disasters.filter(d => d.status === 'ACTIVE');

  const myStats = {
    total: myRequests.length,
    pending: myRequests.filter(r => r.status === 'PENDING').length,
    approved: myRequests.filter(r => ['APPROVED', 'IN_PROGRESS'].includes(r.status)).length,
    completed: myRequests.filter(r => r.status === 'COMPLETED').length,
  };

  const StatCard = ({ title, value, icon, color, bg }) => (
    <Card sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-3px)' } }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
        <Avatar sx={{ bgcolor: bg, width: 52, height: 52 }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1A237E' }}>{value}</Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>{title}</Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Welcome Banner */}
      <Card sx={{
        mb: 3, background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 60%, #F57C00 100%)',
        color: '#fff', overflow: 'hidden', position: 'relative'
      }}>
        <Box sx={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <Box sx={{ position: 'absolute', right: 40, bottom: -40, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <CardContent sx={{ p: 3, position: 'relative' }}>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, mb: 2, maxWidth: 500 }}>
            Stay updated on active disasters in your area. If you or your family need assistance, submit a relief request and our team will respond promptly.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" sx={{ bgcolor: '#F57C00', '&:hover': { bgcolor: '#E65100' } }}
              onClick={() => navigate('/citizen/requests')}>
              Submit Request
            </Button>
            <Button variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
              onClick={() => navigate('/citizen/disasters')}>
              View Disasters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}><StatCard title="My Requests" value={myStats.total} icon={<AssignmentOutlined />} color="#1565C0" bg="#E3F2FD" /></Grid>
        <Grid item xs={6} md={3}><StatCard title="Pending" value={myStats.pending} icon={<PendingActionsOutlined />} color="#F57C00" bg="#FFF3E0" /></Grid>
        <Grid item xs={6} md={3}><StatCard title="Approved" value={myStats.approved} icon={<CheckCircleOutlined />} color="#2E7D32" bg="#E8F5E9" /></Grid>
        <Grid item xs={6} md={3}><StatCard title="Active Disasters" value={activeDisasters.length} icon={<FloodOutlined />} color="#C62828" bg="#FFEBEE" /></Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Active Disasters */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>🌊 Active Disasters Near You</Typography>
                <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/citizen/disasters')}>See All</Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {activeDisasters.slice(0, 4).map(d => (
                  <Box key={d.id} sx={{
                    p: 2, borderRadius: 2, border: '1px solid #e0e0e0',
                    background: SEVERITY_BG[d.severity] || '#fff',
                    display: 'flex', alignItems: 'center', gap: 2,
                    transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                  }}>
                    <WarningAmberOutlined sx={{ color: SEVERITY_COLOR[d.severity], fontSize: 28 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight={700}>{d.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1.5, mt: 0.3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          <LocationOn sx={{ fontSize: 13, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">{d.location}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          <CalendarMonth sx={{ fontSize: 13, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">{d.date}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Chip label={d.severity} size="small" sx={{ bgcolor: SEVERITY_COLOR[d.severity], color: '#fff', fontWeight: 700 }} />
                  </Box>
                ))}
                {activeDisasters.length === 0 && (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>No active disasters currently</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* My Recent Requests */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>📋 My Recent Requests</Typography>
                <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/citizen/requests')}>View All</Button>
              </Box>
              {myRequests.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AssignmentOutlined sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">No requests submitted yet</Typography>
                  <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/citizen/requests')}>Submit First Request</Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {myRequests.slice(0, 5).map(r => (
                    <Box key={r.id} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #e0e0e0', '&:hover': { bgcolor: '#F0F4F8' } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={700}>#{r.id} – {r.disasterName?.split(' ').slice(0,2).join(' ')}</Typography>
                        <Chip label={STATUS_CONFIG[r.status]?.label} size="small" color={STATUS_CONFIG[r.status]?.color} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">{r.location} • {r.createdAt}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
