'use client';

import { Box, Grid2 } from '@mui/material';
import { useEffect, useState } from 'react';
import { Basic } from 'unsplash-js/dist/methods/photos/types';
import { searchPhotosMasonry } from '../actions/unsplash';

const Carousel = () => {
  const [masonryLike, setMasonryLike] = useState<ReadonlyArray<Array<Basic>>>([[], [], []]);
  // const [photos, setPhotos] = useState<Awaited<ReturnType<typeof searchPhotos>>>();

  useEffect(() => {
    const fetchData = async () => {
      const apiResult = await searchPhotosMasonry();

      if (apiResult !== undefined) {
        // setPhotos(apiResult);
        setMasonryLike(apiResult);
      }
    };

    fetchData();
  }, []);

  return (
    <Box padding={4}>
      <Grid2 container flex={1} spacing={2}>
        {masonryLike.map((column, i) => (
          <Box key={i} display="flex" flexDirection="column" gap={4} flex={1} position="relative">
            {column.map(photo => (
              <img
                key={photo.id}
                src={photo.urls.regular}
                alt={photo.description ?? photo.id}
                width="100%"></img>
            ))}
          </Box>
        ))}
      </Grid2>
    </Box>
  );
};

export default Carousel;
