import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',
      light: '#1976D2',
      dark: '#0D47A1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F57C00',
      light: '#FF9800',
      dark: '#E65100',
      contrastText: '#ffffff',
    },
    success: { main: '#2E7D32' },
    warning: { main: '#F57C00' },
    error: { main: '#C62828' },
    info: { main: '#0277BD' },
    background: {
      default: '#F0F4F8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1A237E',
      secondary: '#546E7A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(21,101,192,0.3)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #E65100 0%, #F57C00 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(21,101,192,0.08)',
          border: '1px solid rgba(21,101,192,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#EEF2F7',
          fontWeight: 700,
          color: '#1A237E',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)',
          color: '#ffffff',
          borderRight: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          color: '#1A237E',
          boxShadow: '0 1px 8px rgba(21,101,192,0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 10 },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20 },
      },
    },
  },
});

export default theme;
