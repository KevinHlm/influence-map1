import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              flexGrow: 1 
            }}
          >
            Influence Map
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography 
              component={Link} 
              to="/tools/influence-mapping" 
              sx={{ 
                textDecoration: 'none', 
                color: 'inherit' 
              }}
            >
              Influence Mapping
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
}
