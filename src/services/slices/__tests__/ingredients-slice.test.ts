import { ingredientsReducer, fetchIngredients } from '../ingredients-slice';

import type { TIngredient } from '@/utils/types';

const initialState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

const mockIngredient: TIngredient = {
  _id: '6acd6b8163765e371c0bd9eb',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://norma.ffapi.ru/images/bun-02.png',
  image_mobile: 'https://norma.ffapi.ru/images/bun-02-mobile.png',
  image_large: 'https://norma.ffapi.ru/images/bun-02-large.png',
};

describe('ingredientsReducer', () => {
  test('должен вернуть начальное состояние при вызове с неизвестным экшеном и undefined в качестве начального состояния', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('должен перевести isLoading в true и сбросить error при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен сохранить массив ингредиентов и выключить загрузку при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: [mockIngredient],
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([mockIngredient]);
  });

  test('должен сохранить ошибку и выключить загрузку при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки ингредиентов' },
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toEqual({ message: 'Ошибка загрузки ингредиентов' });
  });
});
