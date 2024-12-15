'use client';

import { Box, FormControlLabel, Switch, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { searchPhotos } from '../actions/unsplash';
import useGlobalStore from '../state';
import Carousel from './carousel';
import MobileFriendlyTablePagination from './mobileFriendlyTablePagination';

const MainContent = () => {
  const globalState = useGlobalStore();
  const [photos, setPhotos] = useState<Awaited<ReturnType<typeof searchPhotos>>>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      const apiResult = await searchPhotos(
        globalState.page,
        globalState.pageSize,
        globalState.searchKeyword
      );

      if (apiResult !== undefined) {
        setPhotos(apiResult);
      }
    };

    const placeholders: Array<any> = new Array(20).fill(0).reduce((acc, _, i) => {
      acc.push({
        id: (Math.random() * 1000).toString(8) + i,
        urls: {
          regular: 'https://placehold.co/600x400'
        }
      });

      return acc;
    }, []);

    setPhotos({
      results: placeholders,
      total: placeholders.length
    });

    // fetchData();
  }, [globalState.page, globalState.pageSize, globalState.searchKeyword]);

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    globalState.setPage(newPage);
  };

  const handlePageSizeChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: string | number = event.target.value;

    if (typeof value === 'string') {
      value = Number.parseInt(value);
    }

    globalState.setPageSize(value);
  };

  return (
    <Box padding="0 2rem">
      <Box
        display="flex"
        gap={4}
        padding="1rem 0 1rem"
        justifyContent="space-between"
        alignItems={isMobile ? 'start' : 'center'}
        flexDirection={isMobile ? 'column' : 'row'}>
        <Typography variant="h6" marginLeft={2}>
          {globalState.searchKeyword.length > 0
            ? `Showing results for: ${globalState.searchKeyword}`
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
                  checked={globalState.masonryLikeEnabled}
                  onChange={globalState.toggleMasonryLikeEnabled}
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
            page={globalState.page}
            onPageChange={handlePageChange}
            rowsPerPage={globalState.pageSize}
            onRowsPerPageChange={handlePageSizeChange}
          />
        </Box>
      </Box>
      <Carousel photos={photos} />
      <Box display="flex" justifyContent="center">
        <MobileFriendlyTablePagination
          count={photos?.total ?? 10}
          page={globalState.page}
          onPageChange={handlePageChange}
          rowsPerPage={globalState.pageSize}
          onRowsPerPageChange={handlePageSizeChange}
        />
      </Box>
    </Box>
  );
};

export default MainContent;
