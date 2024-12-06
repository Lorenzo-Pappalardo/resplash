'use client';

import {
  Box,
  FormControlLabel,
  Switch,
  TablePagination,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { searchPhotos } from '../actions/unsplash';
import useGlobalStore from '../state';
import Carousel from './carousel';

const MainContent = () => {
  const globalState = useGlobalStore();
  const [photos, setPhotos] = useState<Awaited<ReturnType<typeof searchPhotos>>>();
  const theme = useTheme();
  const enableFlexColumn = useMediaQuery(theme.breakpoints.down('sm'));

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

    fetchData();
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
        alignItems="center"
        flexDirection={enableFlexColumn ? 'column' : 'row'}>
        <Typography variant="h6">
          {globalState.searchKeyword.length > 0
            ? `Showing results for: ${globalState.searchKeyword}`
            : 'Showing results from the Editorial feed'}
        </Typography>
        <Box
          display="flex"
          flexDirection={enableFlexColumn ? 'column' : 'row'}
          justifyContent={'center'}
          gap={4}>
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
          />
          <TablePagination
            component="div"
            count={photos?.total ?? 10}
            page={globalState.page}
            onPageChange={handlePageChange}
            rowsPerPage={globalState.pageSize}
            onRowsPerPageChange={handlePageSizeChange}
            labelRowsPerPage="Photos per page:"
            rowsPerPageOptions={[10, 15, 20, 25, 30]}
          />
        </Box>
      </Box>
      <Carousel photos={photos} />
      <Box display="flex" justifyContent="center">
        <TablePagination
          component="div"
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
