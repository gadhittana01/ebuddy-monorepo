'use client';

import { CircularProgress, Box, BoxProps } from '@mui/material';

interface LoadingIndicatorProps extends BoxProps {
  size?: number;
}

export const LoadingIndicator = ({ size = 40, ...boxProps }: LoadingIndicatorProps) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      {...boxProps}
    >
      <CircularProgress size={size} />
    </Box>
  );
}; 