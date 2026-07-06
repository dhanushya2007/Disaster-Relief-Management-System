import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, MenuItem, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Divider, Tabs, Tab
} from '@mui/material';
import { PictureAsPdf, TableChart, BarChart as BarChartIcon } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useData } from '../../context/DataContext';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const COLORS = ['#1565C0', '#F57C00', '#2E7D32', '#C62828', '#6A1B9A'];

export default function Reports() {
  const { disasters, resources, requests, distribution } = useData();
  const [tab, setTab] = useState(0);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const exportPDF = (title, rows, cols) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`ReliefTrack – ${title}`, 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);
    let y = 36;
    doc.setFont('helvetica', 'bold');
    cols.forEach((c, i) => doc.text(c.label, 14 + i * (180 / cols.length), y));
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    rows.slice(0, 40).forEach(row => {
      cols.forEach((c, i) => doc.text(String(row[c.key] ?? '').substring(0, 22), 14 + i * (180 / cols.length), y));
      y += 7;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save(`relieftrack-${title.toLowerCase().replace(/ /g, '-')}.pdf`);
    toast.success(`PDF exported!`);
  };

  const exportExcel = (title, data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31));
    XLSX.writeFile(wb, `relieftrack-${title.toLowerCase().replace(/ /g, '-')}.xlsx`);
    toast.success(`Excel exported!`);
  };

  const disasterCols = [
    { key: 'name', label: 'Name' }, { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' }, { key: 'severity', label: 'Severity' },
    { key: 'status', label: 'Status' }, { key: 'date', label: 'Date' }
  ];
  const resourceCols = [
    { key: 'name', label: 'Name' }, { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Total Qty' }, { key: 'availableStock', label: 'Available' }
  ];
  const requestCols = [
    { key: 'userName', label: 'Citizen' }, { key: 'disasterName', label: 'Disaster' },
    { key: 'location', label: 'Location' }, { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' }, { key: 'createdAt', label: 'Date' }
  ];
  const distCols = [
    { key: 'requesterName', label: 'Requester' }, { key: 'resourceName', label: 'Resource' },
    { key: 'quantity', label: 'Qty' }, { key: 'location', label: 'Location' },
    { key: 'distributionDate', label: 'Date' }
  ];

  const reqStatusData = ['PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].map(s => ({
    name: s.replace('_', ' '), value: requests.filter(r => r.status === s).length
  })).filter(s => s.value > 0);

  const resourceByCategory = ['Food', 'Water', 'Medicines', 'Blankets', 'Tents', 'Clothes', 'Medical Kits'].map(cat => {
    const catRes = resources.filter(r => r.category === cat);
    return {
      category: cat,
      total: catRes.reduce((s, r) => s + r.quantity, 0),
      available: catRes.reduce((s, r) => s + r.availableStock, 0),
    };
  }).filter(c => c.total > 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary.dark">Reports & Analytics</Typography>
          <Typography variant="body2" color="text.secondary">Generate and export comprehensive reports</Typography>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .MuiTab-root': { fontWeight: 600 } }}>
        <Tab label="Disaster Summary" />
        <Tab label="Resource Inventory" />
        <Tab label="Relief Requests" />
        <Tab label="Distribution" />
      </Tabs>

      {/* Disaster Summary */}
      {tab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button variant="contained" startIcon={<PictureAsPdf />} color="error"
              onClick={() => exportPDF('Disaster Summary', disasters, disasterCols)}>Export PDF</Button>
            <Button variant="contained" startIcon={<TableChart />} color="success"
              onClick={() => exportExcel('Disasters', disasters.map(d => ({ Name: d.name, Type: d.type, Location: d.location, Severity: d.severity, Status: d.status, Date: d.date })))}>Export Excel</Button>
          </Box>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {[
              { label: 'Total Disasters', value: disasters.length, color: '#1565C0' },
              { label: 'Active', value: disasters.filter(d => d.status === 'ACTIVE').length, color: '#C62828' },
              { label: 'Resolved', value: disasters.filter(d => d.status === 'RESOLVED').length, color: '#2E7D32' },
              { label: 'Critical Severity', value: disasters.filter(d => d.severity === 'CRITICAL').length, color: '#AD1457' },
            ].map(s => (
              <Grid item xs={6} md={3} key={s.label}>
                <Card sx={{ textAlign: 'center', border: `2px solid ${s.color}20` }}>
                  <CardContent>
                    <Typography variant="h3" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Card>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>{disasterCols.map(c => <TableCell key={c.key}>{c.label}</TableCell>)}</TableRow>
                </TableHead>
                <TableBody>
                  {disasters.map(d => (
                    <TableRow key={d.id} hover>
                      <TableCell fontWeight={600}>{d.name}</TableCell>
                      <TableCell>{d.type}</TableCell>
                      <TableCell>{d.location}</TableCell>
                      <TableCell><Chip label={d.severity} size="small" color={d.severity === 'CRITICAL' ? 'error' : d.severity === 'HIGH' ? 'warning' : 'default'} /></TableCell>
                      <TableCell><Chip label={d.status} size="small" color={d.status === 'ACTIVE' ? 'error' : 'success'} /></TableCell>
                      <TableCell>{d.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* Resource Inventory */}
      {tab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button variant="contained" startIcon={<PictureAsPdf />} color="error"
              onClick={() => exportPDF('Resource Inventory', resources, resourceCols)}>Export PDF</Button>
            <Button variant="contained" startIcon={<TableChart />} color="success"
              onClick={() => exportExcel('Resources', resources.map(r => ({ Name: r.name, Category: r.category, 'Total Quantity': r.quantity, 'Available Stock': r.availableStock, Distributed: r.quantity - r.availableStock })))}>Export Excel</Button>
          </Box>
          <Card sx={{ mb: 3 }}>
            <CardContent><Typography variant="h6" fontWeight={700} mb={2}>Stock by Category</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={resourceByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="available" name="Available" fill="#1565C0" radius={[4,4,0,0]} />
                  <Bar dataKey="total" name="Total" fill="#E3F2FD" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <TableContainer>
              <Table size="small">
                <TableHead><TableRow>{resourceCols.map(c => <TableCell key={c.key}>{c.label}</TableCell>)}<TableCell>Utilization</TableCell></TableRow></TableHead>
                <TableBody>
                  {resources.map(r => {
                    const pct = Math.round(((r.quantity - r.availableStock) / r.quantity) * 100);
                    return (
                      <TableRow key={r.id} hover>
                        <TableCell>{r.name}</TableCell>
                        <TableCell><Chip label={r.category} size="small" /></TableCell>
                        <TableCell>{r.quantity}</TableCell>
                        <TableCell>{r.availableStock}</TableCell>
                        <TableCell><Chip label={`${pct}% used`} size="small" color={pct > 80 ? 'error' : pct > 50 ? 'warning' : 'success'} /></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {/* Relief Requests */}
      {tab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button variant="contained" startIcon={<PictureAsPdf />} color="error"
              onClick={() => exportPDF('Relief Requests', requests, requestCols)}>Export PDF</Button>
            <Button variant="contained" startIcon={<TableChart />} color="success"
              onClick={() => exportExcel('ReliefRequests', requests.map(r => ({ Citizen: r.userName, Phone: r.phone, Disaster: r.disasterName, Location: r.location, 'Family Members': r.familyMembers, Priority: r.priority, Status: r.status, Date: r.createdAt })))}>Export Excel</Button>
          </Box>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={5}>
              <Card><CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>Request Status Distribution</Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart><Pie data={reqStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {reqStatusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie><Tooltip /><Legend /></PieChart>
                </ResponsiveContainer>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <Card><CardContent>
                <Table size="small">
                  <TableHead><TableRow>{requestCols.map(c => <TableCell key={c.key}>{c.label}</TableCell>)}</TableRow></TableHead>
                  <TableBody>
                    {requests.slice(0, 7).map(r => (
                      <TableRow key={r.id} hover>
                        <TableCell>{r.userName}</TableCell><TableCell>{r.disasterName?.split(' ').slice(0,2).join(' ')}</TableCell>
                        <TableCell>{r.location?.split(',')[0]}</TableCell>
                        <TableCell><Chip label={r.priority} size="small" /></TableCell>
                        <TableCell><Chip label={r.status} size="small" color={r.status === 'COMPLETED' ? 'success' : r.status === 'REJECTED' ? 'error' : 'primary'} /></TableCell>
                        <TableCell>{r.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent></Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Distribution */}
      {tab === 3 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button variant="contained" startIcon={<PictureAsPdf />} color="error"
              onClick={() => exportPDF('Distribution History', distribution, distCols)}>Export PDF</Button>
            <Button variant="contained" startIcon={<TableChart />} color="success"
              onClick={() => exportExcel('Distribution', distribution.map(d => ({ Requester: d.requesterName, Resource: d.resourceName, Quantity: d.quantity, Location: d.location, 'Delivered By': d.deliveredBy, Date: d.distributionDate })))}>Export Excel</Button>
          </Box>
          <Card>
            <TableContainer>
              <Table size="small">
                <TableHead><TableRow>{distCols.map(c => <TableCell key={c.key}>{c.label}</TableCell>)}</TableRow></TableHead>
                <TableBody>
                  {distribution.map(d => (
                    <TableRow key={d.id} hover>
                      <TableCell>{d.requesterName}</TableCell>
                      <TableCell><Chip label={d.resourceName} size="small" sx={{ bgcolor: '#E3F2FD', color: '#1565C0' }} /></TableCell>
                      <TableCell><Typography fontWeight={700}>{d.quantity}</Typography></TableCell>
                      <TableCell>{d.location}</TableCell>
                      <TableCell>{d.distributionDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}
    </Box>
  );
}
