import { selectUser, selectUserIsAuthChecked } from '@/services/slices/user-slice';
import { useSelector } from '@/services/store';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '../ui';

import type { ReactElement } from 'react';
import type React from 'react';

export type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuthorized?: boolean;
};

type TProtectedRouteLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuthorized = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();

  const isAuthChecked = useSelector(selectUserIsAuthChecked);
  const user = useSelector(selectUser);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuthorized && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onlyUnAuthorized && user) {
    const state = location.state as TProtectedRouteLocationState | null;
    const from = state?.from ?? { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  return children;
};
