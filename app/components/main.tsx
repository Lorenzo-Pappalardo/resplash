'use client';

import { Box, Grid2 } from '@mui/material';
import { useEffect, useState } from 'react';
import { searchPhotos } from '../actions/unsplash';

const Carousel = () => {
  const [masonryLikeEnabled, setMasonryLikeEnabled] = useState<boolean>(false);
  const [photos, setPhotos] = useState<Awaited<ReturnType<typeof searchPhotos>>>();

  useEffect(() => {
    const fetchData = async () => {
      const apiResult = await searchPhotos();

      if (apiResult !== undefined) {
        setPhotos(apiResult);
      }
    };

    fetchData();
  }, []);

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

  return (
    <Box padding={4}>
      <Grid2 container flex={1} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {masonryLikeEnabled
          ? processData(photos).map((column, i) => (
              <Box
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
              </Box>
            ))
          : photos?.results.map(photo => (
              <Grid2 key={photo.id} size={{ xs: 2, sm: 4, md: 4 }}>
                <img
                  key={photo.id}
                  src={photo.urls.regular}
                  alt={photo.description ?? photo.id}
                  width="100%"></img>
              </Grid2>
            ))}
      </Grid2>
    </Box>
  );
};

export default Carousel;
