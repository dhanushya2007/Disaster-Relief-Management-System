import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, TextField, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  InputAdornment, CircularProgress, Avatar, Tabs, Tab
} from '@mui/material';
import { Add, Search, LocalShipping, Close } from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const emptyDist = { requestId: '', resourceId: '', quantity: '', requesterName: '', resourceName: '', location: '' };

export default function Distribution() {
  const { distribution, resources, requests, distributeResource } = useData();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState(emptyDist);
  const [saving, setSaving] = useState(false);

  const filtered = distribution.filter(d =>
    d.requesterName?.toLowerCase().includes(search.toLowerCase()) ||
    d.resourceName?.toLowerCase().includes(search.toLowerCase()) ||
    d.location?.toLowerCase().includes(search.toLowerCase())
  );

  const approvedRequests = requests.filter(r => ['APPROVED', 'IN_PROGRESS'].includes(r.status));

  const handleSelectRequest = (reqId) => {
    const req = requests.find(r => r.id === +reqId);
    if (req) setForm(p => ({ ...p, requestId: reqId, requesterName: req.userName, location: req.location }));
  };

  const handleSelectResource = (resId) => {
    const res = resources.find(r => r.id === +resId);
    if (res) setForm(p => ({ ...p, resourceId: resId, resourceName: res.name }));
  };

  const handleDistribute = async () => {
    if (!form.requestId || !form.resourceId || !form.quantity) { toast.error('Fill all fields'); return; }
    const res = resources.find(r => r.id === +form.resourceId);
    if (res && +form.quantity > res.availableStock) { toast.error(`Only ${res.availableStock} units available`); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    distributeResource({ ...form, requestId: +form.requestId, resourceId: +form.resourceId, quantity: +form.quantity, deliveredBy: user?.name });
    toast.success('Resources distributed successfully!');
    setSaving(false); setDialog(false); setForm(emptyDist);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary.dark">Resource Distribution</Typography>
          <Typography variant="body2" color="text.secondary">{distribution.length} distribution records</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialog(true)}>Distribute Resources</Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)', color: '#fff' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={800}>{distribution.length}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Distributions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #2E7D32, #388E3C)', color: '#fff' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={800}>{distribution.reduce((s, d) => s + d.quantity, 0).toLocaleString()}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Units Distributed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #F57C00, #FF9800)', color: '#fff' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={800}>{approvedRequests.length}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>Approved Requests Pending Delivery</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <TextField fullWidth size="small" placeholder="Search by requester, resource, location…" value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Requester</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Delivered By</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((d, idx) => (
                <TableRow key={d.id} hover>
                  <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: '#1565C0', fontSize: 12 }}>{d.requesterName?.[0]}</Avatar>
                      <Typography variant="body2" fontWeight={600}>{d.requesterName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Chip label={d.resourceName} size="small" sx={{ bgcolor: '#E3F2FD', color: '#1565C0' }} /></TableCell>
                  <TableCell><Typography fontWeight={700} color="primary">{d.quantity}</Typography></TableCell>
                  <TableCell>{d.location}</TableCell>
                  <TableCell>{d.deliveredBy}</TableCell>
                  <TableCell><Typography variant="caption">{d.distributionDate}</Typography></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <LocalShipping sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">No distribution records</Typography>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 8, 15]} component="div"
          count={filtered.length} rowsPerPage={rowsPerPage} page={page}
          onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }} />
      </Card>

      {/* Distribution Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          🚚 Allocate & Distribute Resources
          <IconButton onClick={() => setDialog(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth select label="Select Request *" value={form.requestId}
                onChange={e => handleSelectRequest(e.target.value)}>
                {approvedRequests.map(r => (
                  <MenuItem key={r.id} value={r.id}>#{r.id} – {r.userName} ({r.disasterName})</MenuItem>
                ))}
                {approvedRequests.length === 0 && <MenuItem disabled>No approved requests</MenuItem>}
              </TextField>
            </Grid>
            {form.requesterName && (
              <Grid item xs={12}>
                <Card sx={{ bgcolor: '#F0F4FF', p: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">Requester: <strong>{form.requesterName}</strong> • Location: <strong>{form.location}</strong></Typography>
                </Card>
              </Grid>
            )}
            <Grid item xs={12} sm={8}>
              <TextField fullWidth select label="Select Resource *" value={form.resourceId}
                onChange={e => handleSelectResource(e.target.value)}>
                {resources.filter(r => r.availableStock > 0).map(r => (
                  <MenuItem key={r.id} value={r.id}>{r.name} (Available: {r.availableStock})</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Quantity *" type="number" value={form.quantity}
                onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} inputProps={{ min: 1 }} />
            </Grid>
            {form.resourceId && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Available stock: <strong>{resources.find(r => r.id === +form.resourceId)?.availableStock || 0}</strong> units
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialog(false)} variant="outlined" color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleDistribute} disabled={saving} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <LocalShipping />}>
            {saving ? 'Processing…' : 'Distribute'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
