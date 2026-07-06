import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, TextField, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  InputAdornment, Tooltip, CircularProgress, LinearProgress, Avatar, DialogContentText, Alert
} from '@mui/material';
import { Add, Edit, Delete, Search, Inventory2, WarningAmberOutlined, Close } from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { toast } from 'react-toastify';

const CATEGORIES = ['Food', 'Water', 'Medicines', 'Blankets', 'Tents', 'Medical Kits', 'Clothes', 'Other'];
const CAT_ICONS = { Food: '🍚', Water: '💧', Medicines: '💊', Blankets: '🛏️', Tents: '⛺', 'Medical Kits': '🧰', Clothes: '👕', Other: '📦' };
const emptyForm = { name: '', category: '', quantity: '', availableStock: '' };

export default function ResourceManagement() {
  const { resources, addResource, updateResource, deleteResource } = useData();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');
  const [filterLow, setFilterLow] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [dialog, setDialog] = useState({ open: false, mode: 'add', data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = resources.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'ALL' || r.category === filterCat;
    const matchLow = !filterLow || (r.availableStock / r.quantity) < 0.2;
    return matchSearch && matchCat && matchLow;
  });

  const lowStockCount = resources.filter(r => (r.availableStock / r.quantity) < 0.2).length;

  const openAdd = () => { setForm(emptyForm); setDialog({ open: true, mode: 'add', data: null }); };
  const openEdit = (r) => { setForm({ ...r, quantity: String(r.quantity), availableStock: String(r.availableStock) }); setDialog({ open: true, mode: 'edit', data: r }); };
  const closeDialog = () => setDialog({ open: false, mode: 'add', data: null });

  const handleSave = async () => {
    if (!form.name || !form.category || !form.quantity || form.availableStock === '') { toast.error('Please fill all required fields'); return; }
    if (+form.availableStock > +form.quantity) { toast.error('Available stock cannot exceed total quantity'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    const payload = { ...form, quantity: +form.quantity, availableStock: +form.availableStock };
    if (dialog.mode === 'add') { addResource(payload); toast.success('Resource added!'); }
    else { updateResource(dialog.data.id, payload); toast.success('Resource updated!'); }
    setSaving(false); closeDialog();
  };

  const handleDelete = () => {
    deleteResource(deleteDialog.id);
    toast.success(`"${deleteDialog.name}" deleted.`);
    setDeleteDialog({ open: false, id: null, name: '' });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary.dark">Resource Management</Typography>
          <Typography variant="body2" color="text.secondary">{resources.length} resources • {lowStockCount} low stock</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Resource</Button>
      </Box>

      {/* Low stock alert */}
      {lowStockCount > 0 && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }} icon={<WarningAmberOutlined />}>
          <strong>{lowStockCount} resource{lowStockCount > 1 ? 's are' : ' is'} critically low on stock</strong> — consider restocking immediately.
          <Button size="small" sx={{ ml: 1 }} onClick={() => setFilterLow(true)}>View Low Stock</Button>
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField fullWidth size="small" placeholder="Search resources…" value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth select size="small" label="Category" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <MenuItem value="ALL">All Categories</MenuItem>
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button fullWidth variant={filterLow ? 'contained' : 'outlined'} color="warning"
                startIcon={<WarningAmberOutlined />} onClick={() => setFilterLow(!filterLow)}>
                {filterLow ? 'Show All' : 'Low Stock Only'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Category summary cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {CATEGORIES.slice(0, 7).map(cat => {
          const catRes = resources.filter(r => r.category === cat);
          if (catRes.length === 0) return null;
          const total = catRes.reduce((s, r) => s + r.quantity, 0);
          const avail = catRes.reduce((s, r) => s + r.availableStock, 0);
          const pct = Math.round((avail / total) * 100);
          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={cat}>
              <Card sx={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' }, border: filterCat === cat ? '2px solid #1565C0' : '1px solid rgba(21,101,192,0.08)' }} onClick={() => setFilterCat(filterCat === cat ? 'ALL' : cat)}>
                <CardContent sx={{ py: 2, px: 1.5 }}>
                  <Typography variant="h4">{CAT_ICONS[cat]}</Typography>
                  <Typography variant="caption" fontWeight={700} display="block">{cat}</Typography>
                  <Typography variant="h6" color={pct < 20 ? 'error' : 'primary'} fontWeight={800}>{pct}%</Typography>
                  <LinearProgress variant="determinate" value={pct} color={pct < 20 ? 'error' : pct < 50 ? 'warning' : 'primary'} sx={{ mt: 0.5, borderRadius: 2, height: 4 }} />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Total Qty</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Distributed</TableCell>
                <TableCell>Stock Level</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r, idx) => {
                const pct = Math.round((r.availableStock / r.quantity) * 100);
                const stockColor = pct < 20 ? 'error' : pct < 50 ? 'warning' : 'success';
                return (
                  <TableRow key={r.id} hover>
                    <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: '#E3F2FD', width: 32, height: 32, fontSize: 16 }}>{CAT_ICONS[r.category] || '📦'}</Avatar>
                        <Typography variant="body2" fontWeight={600}>{r.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={r.category} size="small" sx={{ bgcolor: '#F0F4FF', color: '#1565C0' }} /></TableCell>
                    <TableCell><Typography fontWeight={600}>{r.quantity.toLocaleString()}</Typography></TableCell>
                    <TableCell><Typography fontWeight={600} color={`${stockColor}.main`}>{r.availableStock.toLocaleString()}</Typography></TableCell>
                    <TableCell>{(r.quantity - r.availableStock).toLocaleString()}</TableCell>
                    <TableCell sx={{ minWidth: 140 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress variant="determinate" value={pct} color={stockColor} sx={{ flex: 1, borderRadius: 4, height: 8 }} />
                        <Typography variant="caption" fontWeight={700} color={`${stockColor}.main`} sx={{ minWidth: 32 }}>{pct}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="caption">{r.lastUpdated}</Typography></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => openEdit(r)}><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, id: r.id, name: r.name })}><Delete fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Inventory2 sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">No resources found</Typography>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 8, 15]} component="div"
          count={filtered.length} rowsPerPage={rowsPerPage} page={page}
          onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }} />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {dialog.mode === 'add' ? '➕ Add Resource' : '✏️ Edit Resource'}
          <IconButton onClick={closeDialog}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}><TextField fullWidth label="Resource Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Category *" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{CAT_ICONS[c]} {c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Total Quantity *" type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} inputProps={{ min: 0 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Available Stock *" type="number" value={form.availableStock} onChange={e => setForm(p => ({ ...p, availableStock: e.target.value }))} inputProps={{ min: 0 }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={closeDialog} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : dialog.mode === 'add' ? 'Add Resource' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Delete <strong>"{deleteDialog.name}"</strong>? This cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false })}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
