import { loginUser, selectUserError } from '@/services/slices/user-slice';
import { useDispatch, useSelector } from '@/services/store';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const loginPageError = useSelector(selectUserError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }))
      .unwrap()
      .catch((error) => {
        console.error('Ошибка при логине: ', error);
      });
  };

  return (
    <LoginUI
      errorText={loginPageError?.message}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
