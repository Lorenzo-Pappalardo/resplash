import { create } from 'zustand';

const useGlobalStore = create<GlobalState>()(set => ({
  searchKeyword: '',
  page: 0,
  pageSize: 10,
  setSearchKeyword: newSearchKeyword => set({ searchKeyword: newSearchKeyword }),
  setPage: newPage => set({ page: newPage }),
  setPageSize: newPageSize => set({ pageSize: newPageSize }),
  masonryLikeEnabled: false,
  toggleMasonryLikeEnabled: () => set(state => ({ masonryLikeEnabled: !state.masonryLikeEnabled }))
}));

export default useGlobalStore;

interface GlobalState {
  searchKeyword: string;
  page: number;
  pageSize: number;
  setSearchKeyword: (newSearchKeyword: string) => void;
  setPage: (newPage: number) => void;
  setPageSize: (newPageSize: number) => void;
  masonryLikeEnabled: boolean;
  toggleMasonryLikeEnabled: () => void;
}
