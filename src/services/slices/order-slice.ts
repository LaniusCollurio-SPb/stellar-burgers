import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import { logoutUser } from './user-slice';

import type { TOrder } from '@/utils/types';

type TOrdersState = {
  orderModalData: TOrder | null;
  orders: TOrder[];
  orderData: TOrder | null;
  orderRequest: boolean;
  isOrdersLoading: boolean;
  isOrderDataLoading: boolean;
  error: SerializedError | null;
};

const initialState: TOrdersState = {
  orderModalData: null,
  orders: [],
  orderData: null,
  orderRequest: false,
  isOrdersLoading: false,
  isOrderDataLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[]): Promise<TOrder> => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (): Promise<TOrder[]> => {
    const response = await getOrdersApi();
    return response;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (orderNumber: number): Promise<TOrder | null> => {
    const response = await getOrderByNumberApi(orderNumber);
    return response.orders[0] ?? null;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
      state.orderData = null;
      state.orderRequest = false;
      state.isOrderDataLoading = false;
    },
  },
  selectors: {
    selectOrderModalData: (state) => state.orderModalData,
    selectOrders: (state) => state.orders,
    selectOrderData: (state) => state.orderData,
    selectOrderRequest: (state) => state.orderRequest,
    selectIsOrdersLoading: (state) => state.isOrdersLoading,
    selectIsOrderDataLoading: (state) => state.isOrderDataLoading,
    selectOrderError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isOrderDataLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isOrderDataLoading = false;
        state.orderData = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isOrderDataLoading = false;
        state.error = action.error;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isOrdersLoading = false;
        state.isOrderDataLoading = false;
        state.orderData = null;
        state.orderModalData = null;
        state.orders = [];
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export const {
  selectOrderModalData,
  selectOrders,
  selectOrderData,
  selectOrderRequest,
  selectIsOrdersLoading,
  selectIsOrderDataLoading,
  selectOrderError,
} = orderSlice.selectors;
export const orderReducer = orderSlice.reducer;
