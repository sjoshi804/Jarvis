// frontend/src/pages/Home.tsx

import React, { useState, useEffect } from 'react';
import ScheduleDisplay from '../components/Schedule/ScheduleDisplay';
import { Typography, Box, Button, TextField, CircularProgress, Snackbar, Alert } from '@mui/material';
import { generateSchedule, getCurrentSchedule } from '../services/api';
import { Schedule } from '../types/types';

const Home: React.FC = () => {
  const [availableHours, setAvailableHours] = useState<number>(8); // Default available hours per day
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

// After generating the schedule
  const handleGenerateSchedule = async () => {
    setLoading(true);
    try {
      const generatedSchedule = await generateSchedule(availableHours);
      console.log('Generated Schedule:', generatedSchedule); // Debugging line
      setSchedule(generatedSchedule);
      setSnackbar({
        open: true,
        message: 'Schedule generated successfully!',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error generating schedule:', err);
      setError('Failed to generate schedule. Please try again later.');
      setSnackbar({
        open: true,
        message: 'Failed to generate schedule.',
        severity: 'error',
      });
    }
    setLoading(false);
  };
  
  // After fetching the current schedule
  const fetchCurrentSchedule = async () => {
    setLoading(true);
    try {
      const currentSchedule = await getCurrentSchedule();
      console.log('Current Schedule:', currentSchedule); // Debugging line
      setSchedule(currentSchedule);
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setError('Failed to fetch current schedule.');
    }
    setLoading(false);
  };
  
  useEffect(() => {
    // Fetch the current schedule on component mount
    fetchCurrentSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Schedule
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <TextField
          label="Available Hours Per Day"
          type="number"
          value={availableHours}
          onChange={(e) => setAvailableHours(parseInt(e.target.value, 10))}
          inputProps={{ min: 1 }}
          sx={{ marginRight: '16px', width: '200px' }}
        />
        <Button variant="contained" color="primary" onClick={handleGenerateSchedule} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Generate Schedule'}
        </Button>
      </Box>
      {schedule ? (
        <ScheduleDisplay schedule={schedule} />
      ) : (
        <Typography variant="body1">No schedule available. Generate one to get started.</Typography>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Home;
