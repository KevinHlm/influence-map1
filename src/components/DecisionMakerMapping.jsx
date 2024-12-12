import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

function DecisionMakerMapping() {
  const [decisionMakers, setDecisionMakers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    reportsTo: '',
    decisionWeight: 50,
    relationshipDepth: 5
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setDecisionMakers([...decisionMakers, { ...formData, id: Date.now() }]);
    setFormData({
      name: '',
      role: '',
      reportsTo: '',
      decisionWeight: 50,
      relationshipDepth: 5
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Decision Maker Mapping
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reports To"
                name="reportsTo"
                value={formData.reportsTo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>
                Decision Weight (0-100)
              </Typography>
              <Slider
                name="decisionWeight"
                value={formData.decisionWeight}
                onChange={(e, value) => handleChange({
                  target: { name: 'decisionWeight', value }
                })}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>
                Relationship Depth (1-10)
              </Typography>
              <Slider
                name="relationshipDepth"
                value={formData.relationshipDepth}
                onChange={(e, value) => handleChange({
                  target: { name: 'relationshipDepth', value }
                })}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add Decision Maker
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Added Decision Makers
      </Typography>
      
      {decisionMakers.map(dm => (
        <Paper key={dm.id} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Name:</strong> {dm.name}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Role:</strong> {dm.role}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Reports To:</strong> {dm.reportsTo}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Decision Weight:</strong> {dm.decisionWeight}%
              </Typography>
              <Typography variant="subtitle1">
                <strong>Relationship Depth:</strong> {dm.relationshipDepth}/10
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
}

export default DecisionMakerMapping;
