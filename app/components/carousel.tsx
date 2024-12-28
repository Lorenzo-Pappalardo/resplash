'use client';

import styled from '@emotion/styled';
import { Box, Checkbox, Grid2 } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import { Basic } from 'unsplash-js/dist/methods/photos/types';
import { searchPhotos } from '../actions/unsplash';
import useGlobalStore from '../state';

const Carousel = ({ photos }: CarouselProps) => {
  const globalState = useGlobalStore();
  const router = useRouter();
  const [selectedPhotos, updateSelectedPhotos] = useReducer<
    (
      state: Array<Basic['urls']['raw']>,
      photoURL: Basic['urls']['raw']
    ) => Array<Basic['urls']['raw']>
  >((state, photoURL) => {
    const type = state.includes(photoURL) ? 'remove' : 'add';

    switch (type) {
      case 'add':
        return state.concat(photoURL);
      case 'remove':
        return state.filter(photo => photo !== photoURL);
      default:
        return state;
    }
  }, []);

  const processData = (data: typeof photos, columnsCount: number = 3) => {
    if (data === undefined) {
      return [];
    }

    const masonryLike: Array<(typeof data)['results']> = [];

    for (let i = 0; i < columnsCount; i++) {
      masonryLike.push([]);
    }

    for (let i = 0; i < data.results.length; i++) {
      masonryLike[i % masonryLike.length].push(data.results[i]);
    }

    return masonryLike;
  };

  const handleOnClick = (photoID: string) => {
    router.push(`/photo/${photoID}`);
  };

  const handleSelection = (url: string) => {
    updateSelectedPhotos(url);
  };

  const getImageElement = (photo: Basic, key?: string) => {
    return (
      <StyledBox selected={selectedPhotos.includes(photo.urls.raw)} key={key} position="relative">
        <Box
          className="checkbox"
          position={'absolute'}
          zIndex={1}
          top={0}
          right={0}
          margin={1}
          borderRadius={2}>
          <Checkbox onChange={() => handleSelection(photo.urls.raw)} />
        </Box>
        <StyledImage
          className="photo"
          src={photo.urls.regular}
          alt={photo.description ?? photo.id}
          onClick={() => {
            handleOnClick(photo.id);
          }}></StyledImage>
      </StyledBox>
    );
  };

  return (
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
              {column.map(photo => getImageElement(photo, photo.id))}
            </Grid2>
          ))
        : photos?.results.map(photo => (
            <Grid2 key={photo.id} size={{ xs: 4, sm: 4, md: 4 }}>
              {getImageElement(photo)}
            </Grid2>
          ))}
    </Grid2>
  );
};

export default Carousel;

interface CarouselProps {
  photos?: Awaited<ReturnType<typeof searchPhotos>>;
}

const StyledBox = styled(Box)<{ selected: boolean }>(({ selected }) => ({
  '> .checkbox': {
    display: 'none'
  },

  '> .photo': {
    borderColor: selected ? 'yellow' : 'transparent'
  },

  '&:hover': {
    '> .checkbox': {
      display: 'block'
    },

    '> .photo': {
      borderColor: selected ? 'yellow' : '#888'
    }
  }
}));

const StyledImage = styled.img`
  width: 100%;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
  padding: 2px;
`;
