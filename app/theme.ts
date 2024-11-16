'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#ededed'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#171717'
        }
      }
    }
  }
});

export default theme;
