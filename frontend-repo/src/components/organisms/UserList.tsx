import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { User } from '@/entities/user';
import { updateUser } from '@/apis/userApi';

interface UserListProps {
  users: User[];
  onUserUpdated: () => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onUserUpdated }) => {
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      totalAverageWeightRatings: user.totalAverageWeightRatings,
      numberOfRents: user.numberOfRents,
    });
  };

  const handleCloseDialog = () => {
    setEditUser(null);
    setFormData({});
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    if (name === 'totalAverageWeightRatings' || name === 'numberOfRents') {
      parsedValue = Number(value);
    }

    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const handleSaveUser = async () => {
    if (!editUser) return;

    setLoading(true);
    setError(null);

    try {
      await updateUser(editUser.id, formData);
      handleCloseDialog();
      onUserUpdated();
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (epochTime: number) => {
    return new Date(epochTime * 1000).toLocaleString();
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        User List (Ordered by Potential)
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Avg. Rating</TableCell>
              <TableCell>Rents</TableCell>
              <TableCell>Last Active</TableCell>
              <TableCell>Potential Score</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.totalAverageWeightRatings}</TableCell>
                <TableCell>{user.numberOfRents}</TableCell>
                <TableCell>{formatDate(user.recentlyActive)}</TableCell>
                <TableCell>{user.potentialScore.toFixed(2)}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {error && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
          <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={formData.name || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="totalAverageWeightRatings"
            label="Average Rating"
            type="number"
            fullWidth
            value={formData.totalAverageWeightRatings || 0}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="numberOfRents"
            label="Number of Rents"
            type="number"
            fullWidth
            value={formData.numberOfRents || 0}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSaveUser} disabled={loading} variant="contained">
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 