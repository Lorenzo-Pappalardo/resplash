'use client';

import { Box, Grid2, TablePagination, Typography } from '@mui/material';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { searchPhotos } from '../actions/unsplash';
import useGlobalStore from '../state';

const Carousel = () => {
  const globalState = useGlobalStore();
  const [photos, setPhotos] = useState<Awaited<ReturnType<typeof searchPhotos>>>();

  useEffect(() => {
    const fetchData = async () => {
      const apiResult = await searchPhotos(globalState.page, globalState.pageSize);

      if (apiResult !== undefined) {
        setPhotos(apiResult);
      }
    };

    fetchData();
  }, [globalState.page, globalState.pageSize]);

  const processData = (data: typeof photos) => {
    if (data === undefined) {
      return [];
    }

    const masonryLike: ReadonlyArray<(typeof data)['results']> = [[], [], []];

    for (let i = 0; i < data.results.length; i++) {
      masonryLike[i % masonryLike.length].push(data.results[i]);
    }

    return masonryLike;
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    globalState.setPage(newPage + 1);
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
      <Grid2 container flex={1} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {globalState.masonryLikeEnabled
          ? processData(photos).map((column, i) => (
              <Grid2
                key={i}
                display="flex"
                flexDirection="column"
                gap={4}
                flex={1}
                position="relative">
                {column.map(photo => (
                  <img
                    key={photo.id}
                    src={photo.urls.regular}
                    alt={photo.description ?? photo.id}
                    width="100%"></img>
                ))}
              </Grid2>
            ))
          : photos?.results.map(photo => (
              <Grid2 key={photo.id} size={{ xs: 4, sm: 4, md: 3 }}>
                <img
                  src={photo.urls.regular}
                  alt={photo.description ?? photo.id}
                  width="100%"></img>
              </Grid2>
            ))}
      </Grid2>
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

export default Carousel;
