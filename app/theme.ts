'use client';

import { colors } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'media'
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), var(--font-geist-mono)'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: colors.amber['500']
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: colors.amber['500']
        }
      }
    }
  }
});

export default theme;
