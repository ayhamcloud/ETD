import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright(props) {
  return (
    <Typography variant="body2" color="text" align="center" {...props}>
      {'Made with 💪 by ETD-Team '}
      {new Date().getFullYear()} - {'©'}.
    </Typography>
  );
}
