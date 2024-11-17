import { createApi } from 'unsplash-js';
import { Basic } from 'unsplash-js/dist/methods/photos/types';

const unsplashClient = createApi({
  accessKey: process.env.NEXT_PUBLIC_ACCESS_KEY!,
  headers: {
    'Accept-Version': 'v1'
  }
});

export const searchPhotos = async (
  page = 0,
  pageSize = 10,
  searchKeyword = ''
): Promise<undefined | Awaited<ReturnType<typeof unsplashClient.photos.list>>['response']> => {
  const data =
    searchKeyword.length > 0
      ? await unsplashClient.search.getPhotos({
          query: searchKeyword,
          page: page + 1,
          perPage: pageSize
        })
      : await unsplashClient.photos.list({
          page: page + 1,
          perPage: pageSize
        });

  if (data.type === 'success') {
    return data.response;
  }
};

export const getSpecifiedPhoto = async (photoId: Basic['id']) => {
  const data = await unsplashClient.photos.get({
    photoId
  });

  if (data.type === 'success') {
    return data.response;
  }
};
