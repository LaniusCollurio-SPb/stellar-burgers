import {
  moveIngredient,
  removeIngredient,
} from '@/services/slices/burgerConstructor-slice';
import { useDispatch } from '@/services/store';
import { BurgerConstructorElementUI } from '@ui';
import { memo, useCallback } from 'react';

import type { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();
  const handleMoveDown = useCallback((): void => {
    if (index >= totalItems - 1) return;
    dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
  }, [dispatch, index, totalItems]);

  const handleMoveUp = useCallback((): void => {
    if (index <= 0) return;
    dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
  }, [dispatch, index]);

  const handleClose = useCallback((): void => {
    dispatch(removeIngredient(ingredient.id));
  }, [dispatch, ingredient.id]);

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
