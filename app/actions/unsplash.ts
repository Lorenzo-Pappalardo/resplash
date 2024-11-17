import { createApi } from 'unsplash-js';

const unsplashClient = createApi({
  accessKey: process.env.NEXT_PUBLIC_ACCESS_KEY!,
  headers: {
    'Accept-Version': 'v1'
  }
});

export const searchPhotos = async (
  page = 1,
  pageSize = 10
): Promise<undefined | Awaited<ReturnType<typeof unsplashClient.photos.list>>['response']> => {
  const data = await unsplashClient.photos.list({
    page,
    perPage: pageSize
  });

  if (data.type === 'success') {
    return data.response;
  }
};
