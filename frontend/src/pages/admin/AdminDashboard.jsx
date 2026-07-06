import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Avatar, LinearProgress, Tooltip } from '@mui/material';
import {
  FloodOutlined, AssignmentOutlined, CheckCircleOutlined, PendingActionsOutlined,
  Inventory2Outlined, LocalShippingOutlined, WarningAmberOutlined, TrendingUpOutlined
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';
import { useData } from '../../context/DataContext';

const COLORS = ['#1565C0', '#F57C00', '#2E7D32', '#C62828', '#6A1B9A', '#00838F'];

const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
  <Card sx={{
    height: '100%', position: 'relative', overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(21,101,192,0.15)' }
  }}>
    <Box sx={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: `${color}18` }} />
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Avatar sx={{ bgcolor: `${color}18`, width: 48, height: 48 }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 26 } })}
        </Avatar>
        {trend && (
          <Chip label={trend} size="small" icon={<TrendingUpOutlined sx={{ fontSize: '14px !important' }} />}
            sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700, fontSize: 11 }} />
        )}
      </Box>
      <Typography variant="h3" fontWeight={800} sx={{ color: '#1A237E', lineHeight: 1 }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 600 }}>{title}</Typography>
      {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const { disasters, resources, requests, distribution, getAdminStats } = useData();
  const stats = getAdminStats();

  // Chart data
  const requestsByDisaster = disasters.slice(0, 6).map(d => ({
    name: d.name.split(' ').slice(0, 2).join(' '),
    requests: requests.filter(r => r.disasterId === d.id).length,
  })).filter(d => d.requests > 0);

  const resourceByCategory = ['Food', 'Water', 'Medicines', 'Blankets', 'Tents', 'Clothes', 'Medical Kits'].map(cat => {
    const catResources = resources.filter(r => r.category === cat);
    const total = catResources.reduce((s, r) => s + r.quantity, 0);
    const available = catResources.reduce((s, r) => s + r.availableStock, 0);
    return { name: cat, Available: available, Distributed: total - available };
  }).filter(c => c.Available + c.Distributed > 0);

  const statusData = [
    { name: 'Pending', value: requests.filter(r => r.status === 'PENDING').length },
    { name: 'Approved', value: requests.filter(r => r.status === 'APPROVED').length },
    { name: 'In Progress', value: requests.filter(r => r.status === 'IN_PROGRESS').length },
    { name: 'Completed', value: requests.filter(r => r.status === 'COMPLETED').length },
    { name: 'Rejected', value: requests.filter(r => r.status === 'REJECTED').length },
  ].filter(s => s.value > 0);

  const monthlyData = [
    { month: 'Jan', requests: 2 }, { month: 'Feb', requests: 4 }, { month: 'Mar', requests: 3 },
    { month: 'Apr', requests: 7 }, { month: 'May', requests: 5 }, { month: 'Jun', requests: 9 },
    { month: 'Jul', requests: requests.length },
  ];

  return (
    <Box>
      {/* Low Stock Alerts */}
      {stats.lowStockResources.length > 0 && (
        <Box sx={{ mb: 3, p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', border: '1px solid #FFB74D', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningAmberOutlined sx={{ color: '#F57C00', fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#E65100' }}>⚠️ Low Stock Alert</Typography>
            <Typography variant="body2" sx={{ color: '#BF360C' }}>
              {stats.lowStockResources.map(r => r.name).join(', ')} — are running critically low (&lt;20% remaining)
            </Typography>
          </Box>
        </Box>
      )}

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Disasters" value={stats.totalDisasters} icon={<FloodOutlined />} color="#1565C0" subtitle={`${stats.activeDisasters} currently active`} trend="+2 this month" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Requests" value={stats.totalRequests} icon={<AssignmentOutlined />} color="#F57C00" subtitle={`${stats.pendingRequests} pending approval`} trend="+5 this week" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Completed" value={stats.completedRequests} icon={<CheckCircleOutlined />} color="#2E7D32" subtitle="Fully resolved requests" trend="+12%" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Pending Requests" value={stats.pendingRequests} icon={<PendingActionsOutlined />} color="#C62828" subtitle="Awaiting admin action" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Stock" value={stats.totalStock.toLocaleString()} icon={<Inventory2Outlined />} color="#6A1B9A" subtitle="Across all categories" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Available Stock" value={stats.availableStock.toLocaleString()} icon={<Inventory2Outlined />} color="#00838F" subtitle="Ready for distribution" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Distributed" value={stats.distributedStock.toLocaleString()} icon={<LocalShippingOutlined />} color="#558B2F" subtitle="Units delivered to citizens" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Active Disasters" value={stats.activeDisasters} icon={<FloodOutlined />} color="#AD1457" subtitle="Requiring active response" />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Resource Availability by Category</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={resourceByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RTooltip contentStyle={{ borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="Available" fill="#1565C0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Distributed" fill="#F57C00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Requests by Status</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <RTooltip contentStyle={{ borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Monthly Relief Requests</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RTooltip contentStyle={{ borderRadius: 8 }} />
                  <Area type="monotone" dataKey="requests" stroke="#1565C0" fill="#E3F2FD" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Requests by Disaster</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={requestsByDisaster} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                  <RTooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="requests" fill="#1565C0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Resource Inventory Progress */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={3}>Resource Inventory Status</Typography>
              <Grid container spacing={2}>
                {resources.map(r => {
                  const pct = Math.round((r.availableStock / r.quantity) * 100);
                  const color = pct < 20 ? 'error' : pct < 50 ? 'warning' : 'primary';
                  return (
                    <Grid item xs={12} sm={6} md={4} key={r.id}>
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 200 }}>{r.name}</Typography>
                          <Chip label={r.category} size="small" sx={{ height: 18, fontSize: 10 }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">{r.availableStock} / {r.quantity}</Typography>
                          <Typography variant="caption" fontWeight={700} color={`${color}.main`}>{pct}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={pct} color={color} sx={{ borderRadius: 4, height: 6 }} />
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
