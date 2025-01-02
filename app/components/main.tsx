'use client';

import {
  Alert,
  Box,
  FormControlLabel,
  Snackbar,
  Switch,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { searchPhotos } from '../actions/unsplash';
import useGlobalStore from '../state';
import Carousel from './carousel';
import MobileFriendlyTablePagination from './mobileFriendlyTablePagination';

const MainContent = () => {
  const {
    page,
    pageSize,
    searchKeyword,
    masonryLikeEnabled,
    setPage,
    setPageSize,
    toggleMasonryLikeEnabled
  } = useGlobalStore();
  const [photos, setPhotos] = useState<Awaited<ReturnType<typeof searchPhotos>>>();
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      const apiResult = await searchPhotos(page, pageSize, searchKeyword);

      if (apiResult !== undefined) {
        setPhotos(apiResult);
      } else {
        setError('Error fetching data');
      }
    };

    // fillWithPlaceholders();

    fetchData();
  }, [page, pageSize, searchKeyword]);

  const fillWithPlaceholders = () => {
    const placeholders: Array<any> = [];

    for (let i = 0; i < 20; i++) {
      placeholders.push({
        id: (i * 1 ** 5).toString(8),
        urls: {
          regular: 'https://placehold.co/600x400'
        }
      });
    }

    setPhotos({
      results: placeholders,
      total: placeholders.length
    });
  };

  const onSnackbarClose = () => {
    setError('');
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: string | number = event.target.value;

    if (typeof value === 'string') {
      value = Number.parseInt(value);
    }

    setPageSize(value);
  };

  return (
    <Box display="flex" flexDirection="column" flex={1} padding="0 2rem">
      <Box
        display="flex"
        gap={4}
        padding="1rem 0 1rem"
        justifyContent="space-between"
        alignItems={isMobile ? 'start' : 'center'}
        flexDirection={isMobile ? 'column' : 'row'}>
        <Typography variant="h6" marginLeft={2}>
          {searchKeyword.length > 0
            ? `Showing results for: ${searchKeyword}`
            : 'Showing results from the Editorial feed'}
        </Typography>
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent={'center'}
          width={isMobile ? '100%' : 'unset'}
          gap={4}>
          {!isMobile && (
            <FormControlLabel
              control={
                <Switch
                  title="Masonry (Experimental)"
                  checked={masonryLikeEnabled}
                  onChange={toggleMasonryLikeEnabled}
                />
              }
              label="Masonry (Experimental):"
              labelPlacement="start"
              sx={{
                justifyContent: 'start'
              }}
            />
          )}
          <MobileFriendlyTablePagination
            count={photos?.total ?? 10}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handlePageSizeChange}
          />
        </Box>
      </Box>
      <Carousel photos={photos} />
      <Box display="flex" justifyContent="center">
        <MobileFriendlyTablePagination
          count={photos?.total ?? 10}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handlePageSizeChange}
        />
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        open={error.length > 0}
        onClose={onSnackbarClose}>
        <Alert onClose={onSnackbarClose} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainContent;
