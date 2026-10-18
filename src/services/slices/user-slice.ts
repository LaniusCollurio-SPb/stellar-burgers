import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '@/utils/burger-api';
import { setCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import type { TUser } from '@/utils/types';

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: SerializedError | null;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

const saveTokens = ({ accessToken, refreshToken }: Tokens): void => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const deleteTokens = (): void => {
  setCookie('accessToken', '', { expires: -1 });
  localStorage.removeItem('refreshToken');
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData): Promise<TUser> => {
    const response = await registerUserApi(data);
    saveTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData): Promise<TUser> => {
    const response = await loginUserApi(data);
    saveTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>): Promise<TUser> => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async (): Promise<void> => {
  await logoutApi();
  deleteTokens();
});

export const fetchUser = createAsyncThunk('user/fetchUser', async (): Promise<TUser> => {
  try {
    const response = await getUserApi();
    return response.user;
  } catch (error) {
    deleteTokens();
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Не удалось получить данные пользователя');
    }
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (state: TUserState) => state.user,
    selectUserIsAuthChecked: (state: TUserState) => state.isAuthChecked,
    selectUserIsLoading: (state: TUserState) => state.isLoading,
    selectUserError: (state: TUserState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.error ?? null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.error ?? null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error ?? null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.error ?? null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
        state.error = action.error ?? null;
      });
  },
});

export const {
  selectUser,
  selectUserIsAuthChecked,
  selectUserIsLoading,
  selectUserError,
} = userSlice.selectors;
export const userReducer = userSlice.reducer;
