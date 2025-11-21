import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MainState {
  loader: {
    isLoading: boolean;
    message: string;
  };
  error: {
    message: string;
    fatal: boolean;
  };
}

const initialState: MainState = {
  loader: {
    isLoading: false,
    message: '',
  },
  error: {
    message: '',
    fatal: false,
  },
};

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setLoading: (state: any, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.loader.isLoading = action.payload.isLoading;
      if (action.payload.message !== undefined) state.loader.message = action.payload.message;
    },
    toggleLoading: (state: any) => {
      state.loader.isLoading = !state.loader.isLoading;
    },
    setError: (state, action: PayloadAction<{ message: string; fatal?: boolean }>) => {
      state.error = { message: action.payload.message, fatal: !!action.payload.fatal };
    },
    clearError: (state) => {
      state.error = { message: '', fatal: false };
    },
  },
});

export const { setLoading, toggleLoading, setError, clearError } = mainSlice.actions;
export const mainReducer = mainSlice.reducer;
