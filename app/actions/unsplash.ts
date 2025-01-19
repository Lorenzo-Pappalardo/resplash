'use server';

import { cookies } from 'next/headers';
import { createApi } from 'unsplash-js';
import { Basic } from 'unsplash-js/dist/methods/photos/types';

const authTokenKey = 'UNSPLASH_JWT';
const unsplashAPILocation = 'https://api.unsplash.com';
const headers: {
  'Accept-Version': 'v1';
  Authorization?: string;
} = {
  'Accept-Version': 'v1'
};

class UnsplashClient {
  static #instance?: UnsplashClient;

  #authenticated: boolean = false;
  #client = Object.assign<
    ReturnType<typeof createApi>,
    {
      getProfile: () => Promise<undefined | { first_name: string }>;
      likePhoto: (id: string) => Promise<boolean>;
      unlikePhoto: (id: string) => Promise<boolean>;
    }
  >(
    createApi({
      accessKey: process.env.ACCESS_KEY!,
      apiVersion: 'v1'
    }),
    {
      getProfile: () => Promise.resolve(undefined),
      likePhoto: () => Promise.resolve(false),
      unlikePhoto: () => Promise.resolve(false)
    }
  );

  private constructor() {}

  static get instance() {
    if (this.#instance === undefined) {
      this.#instance = new UnsplashClient();
    }

    return this.#instance;
  }

  async getClient() {
    if (!this.#authenticated) {
      const authToken = (await cookies()).get(authTokenKey)?.value;

      if (authToken !== undefined) {
        this.#authenticated = true;
        headers.Authorization = `Bearer ${authToken}`;
        this.setClient(
          createApi({
            headers: headers,
            accessKey: process.env.ACCESS_KEY!,
            apiVersion: 'v1'
          })
        );

        console.log('Authenticated');
      }
    }

    return this.#client;
  }

  private setClient(newClient: ReturnType<typeof createApi>) {
    this.#client = Object.assign(newClient, {
      getProfile: this.getProfile,
      likePhoto: this.likePhoto,
      unlikePhoto: this.unlikePhoto
    });
  }

  private async getProfile() {
    const res = await fetch(`${unsplashAPILocation}/me`, { headers });
    const data = await res.json();
    return data;
  }

  private async likePhoto(id: string) {
    const res = await fetch(`${unsplashAPILocation}/photos/${id}/like`, {
      method: 'POST',
      headers
    });

    const data = await res.json();

    if (res.status !== 201) {
      console.log(data.errors);
    }

    return res.status === 201;
  }

  private async unlikePhoto(id: string) {
    const res = await fetch(`${unsplashAPILocation}/photos/${id}/like`, {
      method: 'DELETE',
      headers
    });

    const data = await res.json();

    if (res.status !== 200) {
      console.log(data.errors);
    }

    return res.status === 200;
  }
}

export const getProfile = async () => (await UnsplashClient.instance.getClient()).getProfile();

export const searchPhotos = async (page = 0, pageSize = 10, searchKeyword = '') => {
  const unsplashClient = await UnsplashClient.instance.getClient();

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
  const unsplashClient = await UnsplashClient.instance.getClient();

  const data = await unsplashClient.photos.get({
    photoId
  });

  if (data.type === 'success') {
    return data.response;
  }
};

export const likePhoto = async (id: string) =>
  (await UnsplashClient.instance.getClient()).likePhoto(id);

export const unlikePhoto = async (id: string) =>
  (await UnsplashClient.instance.getClient()).unlikePhoto(id);

export const downloadPhotos = async (urls: ReadonlyArray<string>) => {
  if (process.env.NEXT_PUBLIC_ENABLE_DOWNLOAD) {
    const res = await fetch(`${process.env.DOWNLOAD_SERVER_ADDRESS}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(urls)
    });

    if (res.ok) {
      return `${process.env.DOWNLOAD_SERVER_ADDRESS}/download/${await res.text()}`;
    }
  }

  return undefined;
};
