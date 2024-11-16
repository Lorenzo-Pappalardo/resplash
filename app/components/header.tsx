import { AppBar, Box, Button, TextField, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 4 }}>
          <Typography variant="h5" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Resplash
          </Typography>
          <TextField fullWidth label="Search" variant="outlined" placeholder="Search" />
          <Button variant="contained">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
