'use client';

import { AppBar, Button, TextField, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { getProfile } from '../actions/unsplash';
import useGlobalStore from '../state';

const Header = () => {
  const router = useRouter();
  const searchKeyword = useGlobalStore(state => state.searchKeyword);
  const setSearchKeyword = useGlobalStore(state => state.setSearchKeyword);
  const [visuallyShownKeyword, setVisuallyShownKeyword] = useState<string>(searchKeyword);
  const debounceTimeoutID = useRef<ReturnType<typeof setTimeout>>();
  const debounceTimeout = 500;

  const [userFirstName, setUserFirstName] = useState<string>();

  useEffect(() => {
    const getProfileInformation = async () => {
      const profile = await getProfile();

      if (profile !== undefined) {
        setUserFirstName(profile.first_name);
      }
    };

    getProfileInformation();
  }, []);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVisuallyShownKeyword(event.target.value);

    if (debounceTimeoutID.current !== undefined) {
      clearTimeout(debounceTimeoutID.current);
    }

    debounceTimeoutID.current = setTimeout(() => {
      setSearchKeyword(event.target.value);
    }, debounceTimeout);
  };

  const handleLogin = () => {
    router.push('/authentication');
  };

  return (
    <AppBar position="sticky" style={{ padding: '8px' }}>
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
        {userFirstName === undefined ? (
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        ) : (
          <Button variant="text">{userFirstName}</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
