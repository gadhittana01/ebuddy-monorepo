'use client';

import { Typography, TypographyProps } from '@mui/material';

interface StatusMessageProps extends TypographyProps {
  message: string;
  type: 'error' | 'success' | 'info' | 'warning';
}

export const StatusMessage = ({ message, type, ...props }: StatusMessageProps) => {
  if (!message) return null;

  const colorMap = {
    error: 'error',
    success: 'success',
    info: 'info',
    warning: 'warning',
  };

  return (
    <Typography color={colorMap[type]} {...props}>
      {message}
    </Typography>
  );
}; 