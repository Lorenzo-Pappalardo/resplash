'use client';

import styled from '@emotion/styled';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Checkbox, Fab, Grid2 } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useReducer, useState } from 'react';
import { Basic } from 'unsplash-js/dist/methods/photos/types';
import { downloadPhotos, searchPhotos } from '../actions/unsplash';
import useGlobalStore from '../state';

const Carousel = ({ photos }: CarouselProps) => {
  const globalState = useGlobalStore();
  const router = useRouter();
  const [selectedPhotos, updateSelectedPhotos] = useReducer<
    (
      state: Array<Basic['urls']['raw']>,
      action:
        | { type: 'manipulate'; photoURL: Basic['urls']['raw'] }
        | {
            type: 'clear';
            photoURL?: never;
          }
    ) => Array<Basic['urls']['raw']>
  >((state, action) => {
    switch (action.type) {
      case 'manipulate':
        if (state.includes(action.photoURL)) {
          return state.filter(photo => photo !== action.photoURL);
        }

        return state.concat(action.photoURL);
      case 'clear':
        return [];
      default:
        return state;
    }
  }, []);
  const [downloadEnabled, _] = useState(process.env.NEXT_PUBLIC_ENABLE_DOWNLOAD === 'true');

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
    updateSelectedPhotos({ type: 'manipulate', photoURL: url });
  };

  const handleDeselection = () => {
    updateSelectedPhotos({ type: 'clear' });
  };

  const handleDownload = async () => {
    if (!downloadEnabled) {
      return;
    }

    const downloadURL = await downloadPhotos(selectedPhotos);

    if (downloadURL !== undefined) {
      window.open(downloadURL, '_blank', 'noreferrer');
    }
  };

  const getImageElement = (photo: Basic, key?: string) => {
    const photoElement = (
      <StyledImage
        className="photo"
        src={photo.urls.regular}
        alt={photo.description ?? photo.id}
        onClick={() => {
          handleOnClick(photo.id);
        }}></StyledImage>
    );

    if (!downloadEnabled) {
      return photoElement;
    }

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
          <Checkbox
            checked={selectedPhotos.includes(photo.urls.raw)}
            onChange={() => handleSelection(photo.urls.raw)}
          />
        </Box>
        {photoElement}
      </StyledBox>
    );
  };

  return (
    <>
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
      {downloadEnabled && selectedPhotos.length > 0 && (
        <Box position="fixed" bottom={16} right={16} display="flex" gap={1}>
          <Fab variant="extended" color="primary" onClick={handleDownload}>
            <DownloadIcon sx={{ mr: 1 }} />
            Download {selectedPhotos.length}
          </Fab>
          <Fab color="primary" size="medium" onClick={handleDeselection}>
            <CancelIcon />
          </Fab>
        </Box>
      )}
    </>
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
    borderWidth: '2px',
    borderStyle: 'solid',
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
  padding: 2px;
`;
