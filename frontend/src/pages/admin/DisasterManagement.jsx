import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, TextField, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  InputAdornment, Tooltip, CircularProgress, Avatar, DialogContentText,
} from '@mui/material';
import {
  Add, Edit, Delete, Search, FloodOutlined, LocationOn, CalendarMonth, Close
} from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { toast } from 'react-toastify';

const TYPES = ['Flood', 'Cyclone', 'Earthquake', 'Landslide', 'Drought', 'Snowstorm', 'Tsunami', 'Wildfire', 'Other'];
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const SEVERITYCOLORS = { LOW: 'success', MEDIUM: 'warning', HIGH: 'error', CRITICAL: 'error' };
const STATUSCOLORS = { ACTIVE: 'error', RESOLVED: 'success' };

const emptyForm = { name: '', type: '', location: '', date: '', severity: 'MEDIUM', description: '', status: 'ACTIVE' };

export default function DisasterManagement() {
  const { disasters, addDisaster, updateDisaster, deleteDisaster } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [dialog, setDialog] = useState({ open: false, mode: 'add', data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = disasters.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setForm(emptyForm); setDialog({ open: true, mode: 'add', data: null }); };
  const openEdit = (d) => { setForm({ ...d }); setDialog({ open: true, mode: 'edit', data: d }); };
  const closeDialog = () => setDialog({ open: false, mode: 'add', data: null });

  const handleSave = async () => {
    if (!form.name || !form.type || !form.location || !form.date) { toast.error('Please fill all required fields'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    if (dialog.mode === 'add') { addDisaster(form); toast.success('Disaster added successfully!'); }
    else { updateDisaster(dialog.data.id, form); toast.success('Disaster updated!'); }
    setSaving(false); closeDialog();
  };

  const handleDelete = () => {
    deleteDisaster(deleteDialog.id);
    toast.success(`"${deleteDialog.name}" removed.`);
    setDeleteDialog({ open: false, id: null, name: '' });
  };

  const typeIcons = { Flood: '🌊', Cyclone: '🌀', Earthquake: '🏔️', Landslide: '🪨', Drought: '☀️', Snowstorm: '❄️', Tsunami: '🌊', Wildfire: '🔥', Other: '⚠️' };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary.dark">Disaster Management</Typography>
          <Typography variant="body2" color="text.secondary">{disasters.length} total events • {disasters.filter(d => d.status === 'ACTIVE').length} active</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd} sx={{ borderRadius: 2 }}>Add Disaster</Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth size="small" placeholder="Search by name, location, type…"
                value={search} onChange={e => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth select size="small" label="Status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Disaster</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((d, idx) => (
                <TableRow key={d.id} hover sx={{ '&:hover': { bgcolor: '#F0F4F8' } }}>
                  <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: '#E3F2FD', width: 32, height: 32, fontSize: 16 }}>{typeIcons[d.type] || '⚠️'}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{d.name}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 200 }}>
                          {d.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell><Chip label={d.type} size="small" sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 600 }} /></TableCell>
                  <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><LocationOn fontSize="small" color="action" /><Typography variant="body2">{d.location}</Typography></Box></TableCell>
                  <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CalendarMonth fontSize="small" color="action" /><Typography variant="body2">{d.date}</Typography></Box></TableCell>
                  <TableCell><Chip label={d.severity} size="small" color={SEVERITYCOLORS[d.severity]} variant={d.severity === 'CRITICAL' ? 'filled' : 'outlined'} /></TableCell>
                  <TableCell><Chip label={d.status} size="small" color={STATUSCOLORS[d.status]} /></TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => openEdit(d)}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, id: d.id, name: d.name })}><Delete fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <FloodOutlined sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">No disasters found</Typography>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 8, 15, 25]} component="div"
          count={filtered.length} rowsPerPage={rowsPerPage} page={page}
          onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }} />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {dialog.mode === 'add' ? '➕ Add New Disaster' : '✏️ Edit Disaster'}
          <IconButton onClick={closeDialog}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Disaster Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Type *" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Severity *" value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value }))}>
                {SEVERITIES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Location *" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Date *" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth select label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={closeDialog} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : dialog.mode === 'add' ? 'Add Disaster' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete <strong>"{deleteDialog.name}"</strong>? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null, name: '' })}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
