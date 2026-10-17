import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import type { TOrder } from '@/utils/types';

type TOrdersState = {
  orderModalData: TOrder | null;
  orders: TOrder[];
  orderData: TOrder | null;
  orderRequest: boolean;
  error: SerializedError | null;
};

const initialState: TOrdersState = {
  orderModalData: null,
  orders: [],
  orderData: null,
  orderRequest: false,
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
    },
  },
  selectors: {
    selectOrderModalData: (state) => state.orderModalData,
    selectOrders: (state) => state.orders,
    selectOrderData: (state) => state.orderData,
    selectOrderRequest: (state) => state.orderRequest,
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
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderData = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export const {
  selectOrderModalData,
  selectOrders,
  selectOrderData,
  selectOrderRequest,
  selectOrderError,
} = orderSlice.selectors;
export const orderReducer = orderSlice.reducer;
