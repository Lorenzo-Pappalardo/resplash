'use client';

import { Box, TablePagination, Typography } from '@mui/material';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { searchPhotos } from '../actions/unsplash';
import useGlobalStore from '../state';
import Carousel from './carousel';

const MainContent = () => {
  const globalState = useGlobalStore();
  const [photos, setPhotos] = useState<Awaited<ReturnType<typeof searchPhotos>>>();

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
        alignItems="center">
        <Typography variant="h6">Showing results from the Editorial feed</Typography>
        <Box display="flex" gap={4}>
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
