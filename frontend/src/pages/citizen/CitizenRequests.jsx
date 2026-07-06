import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, TextField, Grid, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Stepper, Step, StepLabel, IconButton
} from '@mui/material';
import { Add, Close, AssignmentOutlined, Visibility } from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const STATUS_CONFIG = {
  PENDING: { color: 'warning', label: 'Pending', step: 0 },
  APPROVED: { color: 'success', label: 'Approved', step: 1 },
  IN_PROGRESS: { color: 'info', label: 'In Progress', step: 2 },
  COMPLETED: { color: 'success', label: 'Completed', step: 3 },
  REJECTED: { color: 'error', label: 'Rejected', step: -1 },
};
const PRIORITY_OPTS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const RESOURCE_OPTS = ['Food', 'Water', 'Medicines', 'Blankets', 'Tents', 'Medical Kits', 'Clothes', 'Other'];

const emptyForm = { disasterId: '', disasterName: '', location: '', familyMembers: 1, resourcesNeeded: [], priority: 'MEDIUM', notes: '' };

export default function CitizenRequests() {
  const { disasters, requests, submitRequest } = useData();
  const { user } = useAuth();
  const [dialog, setDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState({ open: false, req: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;

  const myRequests = requests.filter(r => r.userId === user?.id);
  const activeDisasters = disasters.filter(d => d.status === 'ACTIVE');

  const handleSelectDisaster = (id) => {
    const d = disasters.find(d => d.id === +id);
    setForm(p => ({ ...p, disasterId: id, disasterName: d?.name || '' }));
  };

  const handleSubmit = async () => {
    if (!form.disasterId || !form.location || !form.resourcesNeeded.length) {
      toast.error('Please fill all required fields and select at least one resource');
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    submitRequest({ ...form, resourcesNeeded: form.resourcesNeeded.join(', '), disasterName: disasters.find(d => d.id === +form.disasterId)?.name }, user);
    toast.success('Relief request submitted! You will be notified once reviewed.');
    setSaving(false); setDialog(false); setForm(emptyForm);
  };

  const steps = ['Submitted', 'Approved', 'In Progress', 'Completed'];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary.dark">My Relief Requests</Typography>
          <Typography variant="body2" color="text.secondary">{myRequests.length} total requests</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialog(true)}>Submit New Request</Button>
      </Box>

      {/* Status Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = myRequests.filter(r => r.status === key).length;
          return (
            <Grid item xs={6} sm={4} md={2.4} key={key}>
              <Card sx={{ textAlign: 'center', border: count > 0 ? `2px solid` : '1px solid #e0e0e0', borderColor: count > 0 ? `${cfg.color}.main` : undefined }}>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="h4" fontWeight={800} color={`${cfg.color}.main`}>{count}</Typography>
                  <Typography variant="caption" fontWeight={600}>{cfg.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Requests Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Disaster</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Resources Needed</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r, idx) => (
                <TableRow key={r.id} hover>
                  <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell><Typography variant="body2" fontWeight={600}>{r.disasterName}</Typography></TableCell>
                  <TableCell>{r.location}</TableCell>
                  <TableCell><Typography variant="body2" sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.resourcesNeeded}</Typography></TableCell>
                  <TableCell><Chip label={r.priority} size="small" color={r.priority === 'CRITICAL' ? 'error' : r.priority === 'HIGH' ? 'warning' : 'default'} /></TableCell>
                  <TableCell><Chip label={STATUS_CONFIG[r.status]?.label} size="small" color={STATUS_CONFIG[r.status]?.color} /></TableCell>
                  <TableCell><Typography variant="caption">{r.createdAt}</Typography></TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => setViewDialog({ open: true, req: r })}><Visibility fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {myRequests.length === 0 && (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <AssignmentOutlined sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">No requests yet. Submit your first relief request!</Typography>
                  <Button variant="contained" sx={{ mt: 2 }} onClick={() => setDialog(true)}>Submit Request</Button>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[6]} component="div" count={myRequests.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} />
      </Card>

      {/* Submit Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          🆘 Submit Relief Request
          <IconButton onClick={() => setDialog(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth select label="Select Disaster *" value={form.disasterId} onChange={e => handleSelectDisaster(e.target.value)}>
                {activeDisasters.map(d => <MenuItem key={d.id} value={d.id}>{d.name} – {d.location}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField fullWidth label="Your Location *" value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g., Thrissur, Kerala" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Family Members *" type="number" value={form.familyMembers}
                onChange={e => setForm(p => ({ ...p, familyMembers: +e.target.value }))} inputProps={{ min: 1 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth select label="Resources Needed * (Multi-select)" value={form.resourcesNeeded}
                onChange={e => setForm(p => ({ ...p, resourcesNeeded: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value }))}
                SelectProps={{ multiple: true }}>
                {RESOURCE_OPTS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Priority *" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                {PRIORITY_OPTS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Additional Notes" value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any special medical needs, elderly/disabled members, etc." />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialog(false)} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : '🆘 Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Request Detail with Status Tracker */}
      <Dialog open={viewDialog.open} onClose={() => setViewDialog({ open: false, req: null })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          Request #{viewDialog.req?.id} Details
          <IconButton onClick={() => setViewDialog({ open: false, req: null })}><Close /></IconButton>
        </DialogTitle>
        {viewDialog.req && (
          <DialogContent dividers>
            {/* Status stepper */}
            {viewDialog.req.status !== 'REJECTED' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} mb={2}>Request Progress</Typography>
                <Stepper activeStep={STATUS_CONFIG[viewDialog.req.status]?.step || 0} alternativeLabel>
                  {steps.map(s => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
                </Stepper>
              </Box>
            )}
            {viewDialog.req.status === 'REJECTED' && (
              <Box sx={{ mb: 2, p: 2, bgcolor: '#FFEBEE', borderRadius: 2 }}>
                <Typography color="error" fontWeight={700}>Request was rejected</Typography>
              </Box>
            )}
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1.5}>
              {[
                ['Disaster', viewDialog.req.disasterName], ['Location', viewDialog.req.location],
                ['Family Members', viewDialog.req.familyMembers], ['Priority', viewDialog.req.priority],
                ['Resources Needed', viewDialog.req.resourcesNeeded], ['Submitted', viewDialog.req.createdAt],
              ].map(([label, val]) => (
                <Grid item xs={6} key={label}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>{label}</Typography>
                  <Typography variant="body2" fontWeight={600}>{val}</Typography>
                </Grid>
              ))}
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
        <DialogActions><Button onClick={() => setViewDialog({ open: false, req: null })}>Close</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
