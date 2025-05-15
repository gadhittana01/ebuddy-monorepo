'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { updateUser } from '@/apis/userApi';
import styles from './UpdateButton.module.css';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { User } from '@repo/shared';

interface UpdateButtonProps {
  userId: string;
  user?: User;
  onUpdate?: () => void;
  className?: string;
}

export default function UpdateButton({ userId, user, onUpdate, className }: UpdateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    totalAverageWeightRatings: user?.totalAverageWeightRatings || 0,
    numberOfRents: user?.numberOfRents || 0
  });
  const { user: authUser } = useAuth();

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

  const handleOpenModal = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        totalAverageWeightRatings: user.totalAverageWeightRatings || 0,
        numberOfRents: user.numberOfRents || 0
      });
    }
    setModalOpen(true);
    setStatus(null);
  };

  const handleCloseModal = () => {
    if (!loading) {
      setModalOpen(false);
      setStatus(null);
    }
  };

  const handleUpdate = async () => {
    if (!authUser) {
      setStatus({
        message: 'You must be logged in to update profiles',
        type: 'error'
      });
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await updateUser(userId, formData);
      
      setStatus({
        message: 'Profile updated successfully!',
        type: 'success'
      });
      
      if (onUpdate) {
        onUpdate();
      }

      setTimeout(() => {
        setLoading(false);
        handleCloseModal();
      }, 1500);
    } catch (error) {
      setStatus({
        message: 'Failed to update profile: ' + error,
        type: 'error'
      });
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <button 
        onClick={handleOpenModal}
        className={styles.button}
        disabled={loading}
      >
        Update Profile
      </button>
      
      <Dialog 
        open={modalOpen} 
        onClose={handleCloseModal} 
        maxWidth="sm" 
        fullWidth
        disableEscapeKeyDown={loading}
      >
        <DialogTitle>
          Update User Profile
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 16,
                marginTop: '-12px'
              }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {status && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography color={status.type === 'error' ? 'error' : 'success'}>
                {status.message}
              </Typography>
            </Box>
          )}
          <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={formData.name || ''}
            onChange={handleInputChange}
            disabled={loading}
          />
          <TextField
            margin="dense"
            name="totalAverageWeightRatings"
            label="Average Rating"
            type="number"
            fullWidth
            value={formData.totalAverageWeightRatings || 0}
            onChange={handleInputChange}
            inputProps={{ step: 0.1, min: 0, max: 5 }}
            disabled={loading}
          />
          <TextField
            margin="dense"
            name="numberOfRents"
            label="Number of Rents"
            type="number"
            fullWidth
            value={formData.numberOfRents || 0}
            onChange={handleInputChange}
            inputProps={{ min: 0 }}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseModal} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={loading} 
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
