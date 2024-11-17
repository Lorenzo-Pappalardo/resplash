'use client';

import { AppBar, Button, TextField, Toolbar, Typography } from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';
import useGlobalStore from '../state';

const Header = () => {
  const searchKeyword = useGlobalStore(state => state.searchKeyword);
  const setSearchKeyword = useGlobalStore(state => state.setSearchKeyword);
  const [visuallyShownKeyword, setVisuallyShownKeyword] = useState<string>(searchKeyword);
  const debounceTimeoutID = useRef<ReturnType<typeof setTimeout>>();
  const debounceTimeout = 500;

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVisuallyShownKeyword(event.target.value);

    if (debounceTimeoutID.current !== undefined) {
      clearTimeout(debounceTimeoutID.current);
    }

    debounceTimeoutID.current = setTimeout(() => {
      setSearchKeyword(event.target.value);
    }, debounceTimeout);
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ gap: 4 }}>
        <Typography variant="h5" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Resplash
        </Typography>
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          placeholder="Search"
          value={visuallyShownKeyword}
          onChange={handleOnChange}
        />
        <Button variant="contained">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
