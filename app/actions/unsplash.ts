import { createApi } from 'unsplash-js';
import { Basic } from 'unsplash-js/dist/methods/photos/types';

const unsplashClient = createApi({
  accessKey: process.env.NEXT_PUBLIC_ACCESS_KEY!,
  headers: {
    'Accept-Version': 'v1'
  }
});

export const searchPhotos = async (): Promise<
  undefined | Awaited<ReturnType<typeof unsplashClient.photos.list>>['response']
> => {
  const data = await unsplashClient.photos.list({
    page: 1,
    perPage: 50
  });

  if (data.type === 'success') {
    return data.response;
  }
};

export const searchPhotosMasonry = async (): Promise<undefined | ReadonlyArray<Array<Basic>>> => {
  const data = await unsplashClient.photos.list({
    page: 1,
    perPage: 50
  });

  if (data.type === 'success') {
    return processData(data.response);
  }
};

const processData = (
  data: Required<Awaited<ReturnType<typeof unsplashClient.photos.list>>>['response']
) => {
  const masonryLike: ReadonlyArray<(typeof data)['results']> = [[], [], []];

  for (let i = 0; i < data.results.length; i++) {
    masonryLike[i % masonryLike.length].push(data.results[i]);
  }

  return masonryLike;
};
