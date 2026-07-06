import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip, TextField, InputAdornment, MenuItem, Button
} from '@mui/material';
import { Search, LocationOn, CalendarMonth, WarningAmberOutlined } from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

const SEV_COLOR = { LOW: '#1565C0', MEDIUM: '#2E7D32', HIGH: '#F57C00', CRITICAL: '#C62828' };
const SEV_BG = { LOW: '#E3F2FD', MEDIUM: '#E8F5E9', HIGH: '#FFF3E0', CRITICAL: '#FFEBEE' };
const TYPE_ICONS = { Flood: '🌊', Cyclone: '🌀', Earthquake: '🏔️', Landslide: '🪨', Drought: '☀️', Snowstorm: '❄️', Tsunami: '🌊', Wildfire: '🔥', Other: '⚠️' };

export default function CitizenDisasters() {
  const { disasters } = useData();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterSev, setFilterSev] = useState('ALL');
  const navigate = useNavigate();

  const activeDisasters = disasters.filter(d => d.status === 'ACTIVE');
  const types = ['ALL', ...new Set(activeDisasters.map(d => d.type))];

  const filtered = activeDisasters.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || d.type === filterType;
    const matchSev = filterSev === 'ALL' || d.severity === filterSev;
    return matchSearch && matchType && matchSev;
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="primary.dark">Active Disaster Events</Typography>
        <Typography variant="body2" color="text.secondary">{activeDisasters.length} active events requiring attention</Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField fullWidth size="small" placeholder="Search disasters…" value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth select size="small" label="Type" value={filterType} onChange={e => setFilterType(e.target.value)}>
                {types.map(t => <MenuItem key={t} value={t}>{t === 'ALL' ? 'All Types' : t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth select size="small" label="Severity" value={filterSev} onChange={e => setFilterSev(e.target.value)}>
                {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(s => <MenuItem key={s} value={s}>{s === 'ALL' ? 'All Severities' : s}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Disaster Cards */}
      <Grid container spacing={3}>
        {filtered.map(d => (
          <Grid item xs={12} sm={6} lg={4} key={d.id}>
            <Card sx={{
              height: '100%', transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(21,101,192,0.2)' },
              border: `2px solid ${SEV_COLOR[d.severity]}20`
            }}>
              <Box sx={{ background: `linear-gradient(135deg, ${SEV_BG[d.severity]}, #fff)`, p: 2.5, borderBottom: `3px solid ${SEV_COLOR[d.severity]}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h2" sx={{ lineHeight: 1 }}>{TYPE_ICONS[d.type] || '⚠️'}</Typography>
                  <Chip label={d.severity} size="small" sx={{ bgcolor: SEV_COLOR[d.severity], color: '#fff', fontWeight: 700 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} sx={{ mt: 1, color: '#1A237E' }}>{d.name}</Typography>
                <Chip label={d.type} size="small" sx={{ mt: 0.5, bgcolor: '#fff', border: `1px solid ${SEV_COLOR[d.severity]}40` }} />
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <LocationOn fontSize="small" sx={{ color: SEV_COLOR[d.severity] }} />
                  <Typography variant="body2" fontWeight={600}>{d.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                  <CalendarMonth fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">Since {d.date}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2 }}>
                  {d.description}
                </Typography>
                <Button fullWidth variant="contained" size="small" onClick={() => navigate('/citizen/requests')}
                  sx={{ background: `linear-gradient(135deg, ${SEV_COLOR[d.severity]}, ${SEV_COLOR[d.severity]}CC)` }}>
                  Request Relief
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <WarningAmberOutlined sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No active disasters match your search</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
