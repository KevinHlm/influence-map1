import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Influence Map
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        Visualize and analyze stakeholder relationships and decision-making influence
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Influence Mapping
            </Typography>
            <Typography paragraph>
              Create visual maps of stakeholder relationships and analyze their influence on decision-making processes.
            </Typography>
            <Button 
              component={Link}
              to="/tools/influence-mapping"
              variant="contained"
              color="primary"
            >
              Start Mapping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
