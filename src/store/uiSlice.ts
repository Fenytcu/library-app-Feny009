import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  searchQuery: string;
  selectedCategory: string | null;
  currentPage: number;
}

const initialState: UIState = {
  searchQuery: '',
  selectedCategory: null,
  currentPage: 1,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset ke hal 1 jika user mencari sesuatu
    },
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset ke hal 1 jika ganti kategori
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = null;
      state.currentPage = 1;
    },
  },
});

export const { 
  setSearchQuery, 
  setCategory, 
  setCurrentPage, 
  resetFilters 
} = uiSlice.actions;

export default uiSlice.reducer;