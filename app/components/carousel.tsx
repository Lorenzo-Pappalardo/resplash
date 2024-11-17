import { Grid2 } from '@mui/material';
import { searchPhotos } from '../actions/unsplash';
import useGlobalStore from '../state';

const Carousel = ({ photos }: CarouselProps) => {
  const globalState = useGlobalStore();

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
              <img src={photo.urls.regular} alt={photo.description ?? photo.id} width="100%"></img>
            </Grid2>
          ))}
    </Grid2>
  );
};

export default Carousel;

interface CarouselProps {
  photos?: Awaited<ReturnType<typeof searchPhotos>>;
}