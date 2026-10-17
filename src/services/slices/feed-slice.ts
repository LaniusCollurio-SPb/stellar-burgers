import { getFeedsApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TFeedState, TOrder, TOrdersData } from '@/utils/types';

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const feedFetch = createAsyncThunk(
  'feed/fetch',
  async (): Promise<TOrdersData> => {
    const { orders, total, totalToday } = await getFeedsApi();
    return { orders, total, totalToday };
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectFeedOrders: (state): TOrder[] => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedError: (state) => state.error,
    selectFeedIsLoading: (state) => state.isLoading,
  },
  extraReducers: (builder) => {
    builder
      .addCase(feedFetch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(feedFetch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(feedFetch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить заказы';
      });
  },
});

export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedError,
  selectFeedIsLoading,
} = feedSlice.selectors;
export const feedReducer = feedSlice.reducer;
