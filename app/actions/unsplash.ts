'use server';

import { cookies } from 'next/headers';
import { createApi } from 'unsplash-js';
import { Basic } from 'unsplash-js/dist/methods/photos/types';

const authTokenKey = 'UNSPLASH_JWT';
const unsplashAPILocation = 'https://api.unsplash.com';
const defaultHeaders = {
  'Accept-Version': 'v1'
};

class UnsplashClient {
  static #instance?: UnsplashClient;

  #authenticated: boolean = false;
  #authToken?: string;
  #client: ReturnType<typeof createApi> & {
    likePhoto: (id: string) => Promise<boolean>;
    unlikePhoto: (id: string) => Promise<boolean>;
  } = Object.assign(
    createApi({
      accessKey: process.env.NEXT_PUBLIC_ACCESS_KEY!,
      apiVersion: 'v1'
    }),
    { likePhoto: () => Promise.resolve(false), unlikePhoto: () => Promise.resolve(false) }
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
        this.#authToken = authToken;
        this.setClient(
          createApi({
            headers: {
              Authorization: `Bearer ${authToken}`
            },
            accessKey: process.env.NEXT_PUBLIC_ACCESS_KEY!,
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
      likePhoto: this.likePhoto,
      unlikePhoto: this.unlikePhoto
    });
  }

  private likePhoto = async (id: string) => {
    const res = await fetch(`${unsplashAPILocation}/photos/${id}/like`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${this.#authToken}`
      }
    });

    const data = await res.json();

    if (res.status !== 201) {
      console.log(data.errors);
    }

    return res.status === 201;
  };

  private unlikePhoto = async (id: string) => {
    const res = await fetch(`${unsplashAPILocation}/photos/${id}/like`, {
      method: 'DELETE',
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${this.#authToken}`
      }
    });

    const data = await res.json();

    if (res.status !== 200) {
      console.log(data.errors);
    }

    return res.status === 200;
  };
}

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
