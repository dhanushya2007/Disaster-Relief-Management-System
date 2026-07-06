import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, TextField, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  InputAdornment, Tooltip, CircularProgress, Avatar, DialogContentText, Tabs, Tab
} from '@mui/material';
import {
  Search, CheckCircle, Cancel, Visibility, AssignmentOutlined, Close
} from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const STATUS_CONFIG = {
  PENDING: { color: 'warning', label: 'Pending' },
  APPROVED: { color: 'success', label: 'Approved' },
  IN_PROGRESS: { color: 'info', label: 'In Progress' },
  COMPLETED: { color: 'success', label: 'Completed' },
  REJECTED: { color: 'error', label: 'Rejected' },
};
const PRIORITY_CONFIG = {
  LOW: { color: 'default', label: 'Low' },
  MEDIUM: { color: 'primary', label: 'Medium' },
  HIGH: { color: 'warning', label: 'High' },
  CRITICAL: { color: 'error', label: 'Critical' },
};

export default function ReliefRequests() {
  const { requests, updateRequestStatus } = useData();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [viewDialog, setViewDialog] = useState({ open: false, req: null });
  const [statusDialog, setStatusDialog] = useState({ open: false, req: null, newStatus: '' });
  const [allocRes, setAllocRes] = useState('');
  const [saving, setSaving] = useState(false);

  const tabFilters = ['ALL', 'PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'];
  const currentFilter = tabFilters[tab];

  const filtered = requests.filter(r => {
    const matchSearch = r.userName?.toLowerCase().includes(search.toLowerCase()) ||
      r.disasterName?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase());
    const matchTab = currentFilter === 'ALL' || r.status === currentFilter;
    return matchSearch && matchTab;
  });

  const handleStatusUpdate = async (newStatus) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateRequestStatus(statusDialog.req.id, newStatus, user?.name, allocRes);
    toast.success(`Request status updated to ${newStatus}`);
    setSaving(false);
    setStatusDialog({ open: false, req: null, newStatus: '' });
    setAllocRes('');
  };

  const tabCounts = tabFilters.map(f => f === 'ALL' ? requests.length : requests.filter(r => r.status === f).length);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary.dark">Relief Requests</Typography>
          <Typography variant="body2" color="text.secondary">{requests.length} total requests</Typography>
        </Box>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <TextField fullWidth size="small" placeholder="Search by citizen name, disaster, location…" value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setPage(0); }} variant="scrollable" scrollButtons="auto"
          sx={{ px: 2, '& .MuiTab-root': { fontWeight: 600, minWidth: 100 } }}>
          {tabFilters.map((f, i) => (
            <Tab key={f} label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {f === 'ALL' ? 'All' : STATUS_CONFIG[f]?.label}
                <Chip label={tabCounts[i]} size="small" sx={{ height: 18, fontSize: 10, ml: 0.5 }} />
              </Box>
            } />
          ))}
        </Tabs>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Citizen</TableCell>
                <TableCell>Disaster</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Family</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r, idx) => (
                <TableRow key={r.id} hover>
                  <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#1565C0', fontSize: 13 }}>{r.userName?.[0]}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{r.userName}</Typography>
                        <Typography variant="caption" color="text.secondary">{r.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2" sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.disasterName}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{r.location}</Typography></TableCell>
                  <TableCell align="center"><Chip label={r.familyMembers} size="small" color="primary" variant="outlined" /></TableCell>
                  <TableCell><Chip label={PRIORITY_CONFIG[r.priority]?.label} size="small" color={PRIORITY_CONFIG[r.priority]?.color} /></TableCell>
                  <TableCell><Chip label={STATUS_CONFIG[r.status]?.label} size="small" color={STATUS_CONFIG[r.status]?.color} /></TableCell>
                  <TableCell><Typography variant="caption">{r.createdAt}</Typography></TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary" onClick={() => setViewDialog({ open: true, req: r })}><Visibility fontSize="small" /></IconButton>
                    </Tooltip>
                    {r.status === 'PENDING' && <>
                      <Tooltip title="Approve">
                        <IconButton size="small" color="success" onClick={() => { setStatusDialog({ open: true, req: r, newStatus: 'APPROVED' }); setAllocRes(''); }}><CheckCircle fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton size="small" color="error" onClick={() => { setStatusDialog({ open: true, req: r, newStatus: 'REJECTED' }); setAllocRes(''); }}><Cancel fontSize="small" /></IconButton>
                      </Tooltip>
                    </>}
                    {r.status === 'APPROVED' && (
                      <Tooltip title="Mark In Progress">
                        <Button size="small" variant="outlined" sx={{ ml: 0.5, fontSize: 10 }} onClick={() => { setStatusDialog({ open: true, req: r, newStatus: 'IN_PROGRESS' }); setAllocRes(''); }}>Start</Button>
                      </Tooltip>
                    )}
                    {r.status === 'IN_PROGRESS' && (
                      <Tooltip title="Mark Completed">
                        <Button size="small" variant="outlined" color="success" sx={{ ml: 0.5, fontSize: 10 }} onClick={() => { setStatusDialog({ open: true, req: r, newStatus: 'COMPLETED' }); setAllocRes(''); }}>Complete</Button>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <AssignmentOutlined sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">No requests found</Typography>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 8, 15]} component="div"
          count={filtered.length} rowsPerPage={rowsPerPage} page={page}
          onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }} />
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialog.open} onClose={() => setViewDialog({ open: false, req: null })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          Request Details #{viewDialog.req?.id}
          <IconButton onClick={() => setViewDialog({ open: false, req: null })}><Close /></IconButton>
        </DialogTitle>
        {viewDialog.req && (
          <DialogContent dividers>
            <Grid container spacing={2}>
              {[
                ['Citizen', viewDialog.req.userName], ['Phone', viewDialog.req.phone],
                ['Disaster', viewDialog.req.disasterName], ['Location', viewDialog.req.location],
                ['Family Members', viewDialog.req.familyMembers], ['Priority', viewDialog.req.priority],
                ['Status', viewDialog.req.status], ['Submitted', viewDialog.req.createdAt],
              ].map(([label, val]) => (
                <Grid item xs={6} key={label}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>{label}</Typography>
                  <Typography variant="body2" fontWeight={600}>{val}</Typography>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>Resources Needed</Typography>
                <Typography variant="body2">{viewDialog.req.resourcesNeeded}</Typography>
              </Grid>
              {viewDialog.req.allocatedResources && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Allocated Resources</Typography>
                  <Typography variant="body2" color="success.main" fontWeight={600}>{viewDialog.req.allocatedResources}</Typography>
                </Grid>
              )}
              {viewDialog.req.notes && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Notes</Typography>
                  <Typography variant="body2">{viewDialog.req.notes}</Typography>
                </Grid>
              )}
            </Grid>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, req: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog.open} onClose={() => setStatusDialog({ open: false, req: null, newStatus: '' })} maxWidth="xs" fullWidth>
        <DialogTitle>Update Request Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Set status to <strong>{statusDialog.newStatus}</strong> for request by {statusDialog.req?.userName}?
          </DialogContentText>
          {statusDialog.newStatus === 'APPROVED' && (
            <TextField fullWidth label="Allocated Resources (optional)" value={allocRes}
              onChange={e => setAllocRes(e.target.value)} placeholder="e.g., Rice x5, Water x10" />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog({ open: false, req: null, newStatus: '' })}>Cancel</Button>
          <Button variant="contained" color={statusDialog.newStatus === 'REJECTED' ? 'error' : 'primary'}
            onClick={() => handleStatusUpdate(statusDialog.newStatus)} disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
