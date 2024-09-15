// src/components/Schedule/ScheduleDisplay.tsx

import React from 'react';
import { Schedule } from '../../types/types';
import { Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';

interface ScheduleDisplayProps {
  schedule: Schedule | null; // Allow schedule to be null
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ schedule }) => {
  if (!schedule) {
    return (
      <Typography variant="body1">No schedule available. Generate one to get started.</Typography>
    );
  }

  const { dailyPlans } = schedule;

  // Check if dailyPlans is defined and is an object
  if (!dailyPlans || typeof dailyPlans !== 'object') {
    return (
      <Typography variant="body1" color="error">
        Invalid schedule data.
      </Typography>
    );
  }

  // Convert dailyPlans map to an array of [date, tasks]
  const scheduleEntries = Object.entries(dailyPlans).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );

  return (
    <Box>
      {scheduleEntries.map(([date, tasks]) => (
        <Paper key={date} sx={{ padding: '16px', marginBottom: '16px' }}>
          <Typography variant="h6" gutterBottom>
            {new Date(date).toLocaleDateString()}
          </Typography>
          {tasks.length > 0 ? (
            <List>
              {tasks.map((task) => (
                <ListItem key={task._id} disablePadding>
                  <ListItemText
                    primary={task.title}
                    secondary={`Estimated Time: ${task.estimatedTime}h | Priority: ${task.priority} | Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">No tasks scheduled for this day.</Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default ScheduleDisplay;
