import { getIngredientsApi } from '@/utils/burger-api';
import { createSlice, createAsyncThunk, type SerializedError } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';

export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIngredientById: (state, id) =>
      state.ingredients.find((ingredient) => ingredient._id === id),
    selectIngredientsIsLoading: (state) => state.isLoading,
    selectIngredientsError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const {
  selectIngredients,
  selectIngredientById,
  selectIngredientsIsLoading,
  selectIngredientsError,
} = ingredientsSlice.selectors;

export const ingredientsReducer = ingredientsSlice.reducer;
