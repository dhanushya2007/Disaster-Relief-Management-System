import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, IconButton, Typography, Avatar, Badge,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
  Menu, MenuItem, Tooltip, Chip, useMediaQuery, useTheme, alpha
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, FloodOutlined, Inventory2Outlined,
  AssignmentOutlined, LocalShippingOutlined, BarChartOutlined,
  AdminPanelSettingsOutlined, NotificationsOutlined, LogoutOutlined,
  PersonOutlined, HistoryOutlined, HomeOutlined, ListAltOutlined,
  AccountCircleOutlined, WarningAmberOutlined, ChevronLeft
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const DRAWER_WIDTH = 260;

const adminNav = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  { label: 'Disasters', icon: <FloodOutlined />, path: '/admin/disasters' },
  { label: 'Resources', icon: <Inventory2Outlined />, path: '/admin/resources' },
  { label: 'Relief Requests', icon: <AssignmentOutlined />, path: '/admin/requests' },
  { label: 'Distribution', icon: <LocalShippingOutlined />, path: '/admin/distribution' },
  { label: 'Reports', icon: <BarChartOutlined />, path: '/admin/reports' },
  { label: 'Audit Logs', icon: <HistoryOutlined />, path: '/admin/audit-logs' },
];

const citizenNav = [
  { label: 'Dashboard', icon: <HomeOutlined />, path: '/citizen/dashboard' },
  { label: 'Active Disasters', icon: <FloodOutlined />, path: '/citizen/disasters' },
  { label: 'My Requests', icon: <ListAltOutlined />, path: '/citizen/requests' },
  { label: 'My Profile', icon: <AccountCircleOutlined />, path: '/citizen/profile' },
];

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const { user, logout } = useAuth();
  const { notifications, getAdminStats } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'ADMIN';
  const navItems = isAdmin ? adminNav : citizenNav;
  const stats = isAdmin ? getAdminStats() : null;

  const handleLogout = () => { logout(); navigate('/login'); };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 42, height: 42, borderRadius: 2,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <FloodOutlined sx={{ color: '#fff', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, lineHeight: 1.2 }}>ReliefTrack</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {isAdmin ? 'Admin Panel' : 'Citizen Portal'}
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ ml: 'auto', color: '#fff' }}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      {/* Role Badge */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Chip
          icon={isAdmin ? <AdminPanelSettingsOutlined sx={{ color: '#fff !important' }} /> : <PersonOutlined sx={{ color: '#fff !important' }} />}
          label={isAdmin ? 'Administrator' : 'Citizen'}
          size="small"
          sx={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, width: '100%' }}
        />
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', mx: 2 }} />

      {/* Nav Items */}
      <List sx={{ px: 1.5, py: 1, flex: 1 }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) setDrawerOpen(false); }}
                sx={{
                  borderRadius: 2, py: 1.2,
                  background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': { background: 'rgba(255,255,255,0.12)' },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: active ? '#fff' : 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    color: active ? '#fff' : 'rgba(255,255,255,0.8)',
                    fontSize: '0.875rem'
                  }}
                />
                {active && <Box sx={{ width: 4, height: 20, borderRadius: 2, background: '#FF9800', ml: 1 }} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Low Stock Warning (Admin only) */}
      {isAdmin && stats?.lowStockResources?.length > 0 && (
        <Box sx={{ mx: 2, mb: 2, p: 1.5, background: 'rgba(245,124,0,0.2)', borderRadius: 2, border: '1px solid rgba(245,124,0,0.4)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberOutlined sx={{ color: '#FFB74D', fontSize: 18 }} />
            <Typography variant="caption" sx={{ color: '#FFB74D', fontWeight: 600 }}>
              {stats.lowStockResources.length} resource{stats.lowStockResources.length > 1 ? 's' : ''} low on stock
            </Typography>
          </Box>
        </Box>
      )}

      {/* User section */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', mx: 2 }} />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#F57C00', fontSize: 14, fontWeight: 700 }}>
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, noWrap: true }}>{user?.name}</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>{user?.email}</Typography>
        </Box>
        <Tooltip title="Logout">
          <IconButton onClick={handleLogout} size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
            <LogoutOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F0F4F8' }}>
      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top AppBar */}
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ gap: 1 }}>
            <IconButton edge="start" onClick={() => setDrawerOpen(!drawerOpen)} sx={{ color: '#1565C0' }}>
              <MenuIcon />
            </IconButton>

            {/* Breadcrumb */}
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A237E', flex: 1 }}>
              {navItems.find(n => n.path === location.pathname)?.label || 'ReliefTrack'}
            </Typography>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton onClick={e => setNotifAnchor(e.currentTarget)} sx={{ color: '#1565C0' }}>
                <Badge badgeContent={notifications.length} color="secondary" max={9}>
                  <NotificationsOutlined />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={() => setNotifAnchor(null)}
              PaperProps={{ sx: { width: 320, maxHeight: 400 } }}>
              <Box sx={{ px: 2, py: 1.5 }}><Typography variant="subtitle1" fontWeight={700}>Notifications</Typography></Box>
              <Divider />
              {notifications.length === 0 ? (
                <MenuItem disabled><Typography variant="body2" color="text.secondary">No new notifications</Typography></MenuItem>
              ) : (
                notifications.slice(0, 8).map(n => (
                  <MenuItem key={n.id} onClick={() => setNotifAnchor(null)}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{n.msg}</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(n.time).toLocaleTimeString()}</Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* User avatar */}
            <Tooltip title={user?.name}>
              <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: '#1565C0', fontSize: 14, fontWeight: 700 }}>
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.role}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout}><LogoutOutlined fontSize="small" sx={{ mr: 1 }} />Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
