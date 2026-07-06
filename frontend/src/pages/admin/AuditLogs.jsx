import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  InputAdornment, Avatar, MenuItem
} from '@mui/material';
import { Search, History } from '@mui/icons-material';
import { useData } from '../../context/DataContext';

const ACTION_COLORS = {
  APPROVE_REQUEST: 'success', REJECT_REQUEST: 'error', CREATE_DISASTER: 'info',
  UPDATE_DISASTER: 'warning', DELETE_DISASTER: 'error', CREATE_RESOURCE: 'info',
  UPDATE_RESOURCE: 'warning', DELETE_RESOURCE: 'error', DISTRIBUTE_RESOURCE: 'success',
  IN_PROGRESS_REQUEST: 'info', COMPLETED_REQUEST: 'success',
};

export default function AuditLogs() {
  const { auditLogs } = useData();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const entityTypes = ['ALL', ...new Set(auditLogs.map(l => l.entityType))];

  const filtered = auditLogs.filter(l => {
    const matchSearch = l.details?.toLowerCase().includes(search.toLowerCase()) || l.action?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || l.entityType === filterType;
    return matchSearch && matchType;
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="primary.dark">Audit Logs</Typography>
        <Typography variant="body2" color="text.secondary">{auditLogs.length} total admin actions recorded</Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField sx={{ flex: 1 }} size="small" placeholder="Search logs…" value={search} onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
            <TextField sx={{ minWidth: 160 }} select size="small" label="Entity Type" value={filterType} onChange={e => setFilterType(e.target.value)}>
              {entityTypes.map(t => <MenuItem key={t} value={t}>{t === 'ALL' ? 'All Types' : t}</MenuItem>)}
            </TextField>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Entity</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, idx) => (
                <TableRow key={log.id} hover>
                  <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: '#1565C0', fontSize: 11 }}>{log.admin?.[0]}</Avatar>
                      <Typography variant="body2" fontWeight={600}>{log.admin}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={log.action?.replace(/_/g, ' ')} size="small"
                      color={ACTION_COLORS[log.action] || 'default'}
                      sx={{ fontSize: 11, fontWeight: 700 }} />
                  </TableCell>
                  <TableCell><Chip label={log.entityType} size="small" variant="outlined" /></TableCell>
                  <TableCell><Typography variant="body2">{log.details}</Typography></TableCell>
                  <TableCell>
                    <Typography variant="caption">{new Date(log.timestamp).toLocaleString()}</Typography>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <History sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">No logs found</Typography>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div"
          count={filtered.length} rowsPerPage={rowsPerPage} page={page}
          onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }} />
      </Card>
    </Box>
  );
}
