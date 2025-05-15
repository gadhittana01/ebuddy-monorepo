'use client';

import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { User } from '@/entities/user';

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const formattedDate = new Date(user.recentlyActive * 1000).toLocaleString();

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Profile
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1" fontWeight="bold">Email:</Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Box>
          
          {user.name && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold">Name:</Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Box>
          )}
          
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1" fontWeight="bold">Rating:</Typography>
            <Typography variant="body1">{user.totalAverageWeightRatings.toFixed(1)}</Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1" fontWeight="bold">Number of Rents:</Typography>
            <Typography variant="body1">{user.numberOfRents}</Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1" fontWeight="bold">Last Active:</Typography>
            <Typography variant="body1">{formattedDate}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}; 