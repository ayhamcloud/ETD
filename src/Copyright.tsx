import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright(props) {
  return (
    <Typography variant="body2" color="text" align="center" {...props}>
      {'Made with 💪 by '}
      <MuiLink color="inherit" href="https://github.com/ayham291">
        Ayham
      </MuiLink>{' '}
      and{' '}
      <MuiLink color="inherit" href="https://www.instagram.com/raphael_bgr_9900/">
      Raphi
      </MuiLink>{' '}
      {new Date().getFullYear()} - {'©'}.
    </Typography>
  );
}
