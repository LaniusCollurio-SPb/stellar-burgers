import {
  selectUser,
  selectUserError,
  selectUserIsLoading,
  updateUser,
} from '@/services/slices/user-slice';
import { useDispatch, useSelector } from '@/services/store';
import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import type { TRegisterData } from '@/utils/burger-api';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUserError) ?? null;
  const isLoading = useSelector(selectUserIsLoading);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    if (!user) return;

    setFormValue({
      name: user.name,
      email: user.email,
      password: '',
    });
  }, [user]);

  const isFormChanged =
    user !== null &&
    (formValue.name !== user?.name ||
      formValue.email !== user?.email ||
      !!formValue.password);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (!user || !isFormChanged || isLoading) return;

    const updateUserData: Partial<TRegisterData> = {};

    if (formValue.name !== user?.name) updateUserData.name = formValue.name;
    if (formValue.email !== user?.email) updateUserData.email = formValue.email;
    if (formValue.password !== '') updateUserData.password = formValue.password;
    void dispatch(updateUser(updateUserData))
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({ ...prev, password: '' }));
      })
      .catch((error) => {
        console.error('Ошибка изменения данных пользователя:', error);
      });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (!user) return;

    setFormValue({
      name: user.name,
      email: user.email,
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;
    setFormValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError?.message}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
