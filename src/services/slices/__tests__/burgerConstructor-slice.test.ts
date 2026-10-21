import {
  burgerConstructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearIngredients,
} from '../burgerConstructor-slice';
import { createOrder } from '../order-slice';

import type { TIngredient } from '@/utils/types';

const initialState = {
  bun: null,
  ingredients: [],
};

const mockBun: TIngredient = {
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

const mockIngredient: TIngredient = {
  _id: '6acd6b8163765ed1960bd9f3',
  name: 'Соус традиционный галактический',
  type: 'sauce',
  proteins: 42,
  fat: 24,
  carbohydrates: 42,
  calories: 99,
  price: 15,
  image: 'https://norma.ffapi.ru/images/sauce-03.png',
  image_mobile: 'https://norma.ffapi.ru/images/sauce-03-mobile.png',
  image_large: 'https://norma.ffapi.ru/images/sauce-03-large.png',
};

describe('burgerConstructorReducer', () => {
  test('должен вернуть начальное состояние при вызове с неизвестным экшеном и undefined в качестве начального состояния', () => {
    expect(burgerConstructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('должен добавить булку в поле bun и сгенерировать уникальный id при вызове экшена addIngredient', () => {
    const action = addIngredient(mockBun);
    const state = burgerConstructorReducer(initialState, action);

    expect(state.bun).not.toBeNull();
    expect(state.bun?._id).toBe('6acd6b8163765e371c0bd9eb');
    expect(state.bun?.id).toBeDefined();
    expect(state.ingredients).toHaveLength(0);
  });

  test('должен добавить начинку в массив ingredients и сгенерировать уникальный id при вызове экшена addIngredient', () => {
    const action = addIngredient(mockIngredient);
    const state = burgerConstructorReducer(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('6acd6b8163765ed1960bd9f3');
    expect(state.ingredients[0].id).toBeDefined();
    expect(state.bun).toBeNull();
  });

  test('должен удалить начинку из массива по её уникальному id при вызове экшена removeIngredient', () => {
    const stateWithIngredient = burgerConstructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    const ingredientId = stateWithIngredient.ingredients[0].id;

    const state = burgerConstructorReducer(
      stateWithIngredient,
      removeIngredient(ingredientId)
    );

    expect(state.ingredients).toHaveLength(0);
  });

  test('должен поменять порядок начинок при вызове экшена moveIngredient', () => {
    const secondIngredient: TIngredient = {
      _id: '6acd6b8163765e331a0bd9f2',
      name: 'Соус фирменный Space Sauce',
      type: 'sauce',
      proteins: 50,
      fat: 22,
      carbohydrates: 11,
      calories: 14,
      price: 80,
      image: 'https://norma.ffapi.ru/images/sauce-04.png',
      image_mobile: 'https://norma.ffapi.ru/images/sauce-04-mobile.png',
      image_large: 'https://norma.ffapi.ru/images/sauce-04-large.png',
    };

    let state = burgerConstructorReducer(initialState, addIngredient(mockIngredient));
    state = burgerConstructorReducer(state, addIngredient(secondIngredient));

    state = burgerConstructorReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients[0]._id).toBe('6acd6b8163765e331a0bd9f2');
    expect(state.ingredients[1]._id).toBe('6acd6b8163765ed1960bd9f3');
  });

  test('должен полностью очистить конструктор при вызове экшена clearIngredients', () => {
    let state = burgerConstructorReducer(initialState, addIngredient(mockBun));
    state = burgerConstructorReducer(state, addIngredient(mockIngredient));

    state = burgerConstructorReducer(state, clearIngredients());

    expect(state).toEqual(initialState);
  });

  test('должен очистить конструктор при обработке асинхронного экшена createOrder.fulfilled', () => {
    let state = burgerConstructorReducer(initialState, addIngredient(mockBun));
    state = burgerConstructorReducer(state, addIngredient(mockIngredient));

    state = burgerConstructorReducer(state, {
      type: createOrder.fulfilled.type,
      payload: { number: 558 },
    });

    expect(state).toEqual(initialState);
  });
});
