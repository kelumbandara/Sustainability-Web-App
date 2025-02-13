import * as React from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number; size?: number }
) {
  const { value, size = 40 } = props;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100}  // Full circle for the background
        size={size}
        sx={{
          color: 'lightgray', // Track color (gray outline)
        }}
      />
      <CircularProgress
        variant="determinate"
        value={value}  // Actual progress value
        size={size}
        sx={{
          color: value > 0 ? 'var(--pallet-blue)' : 'transparent', // Filled with blue for > 0%
          position: 'absolute', // Place the progress over the background
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="overline"
          component="div"
          sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default CircularProgressWithLabel;
