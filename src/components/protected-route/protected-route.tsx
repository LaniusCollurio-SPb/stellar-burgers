import { selectUser, selectUserIsAuthChecked } from '@/services/slices/user-slice';
import { useSelector } from '@/services/store';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '../ui';

import type { ReactElement, ReactNode } from 'react';
import type React from 'react';

import styles from './protected-route.module.css';

export type TProtectedRoutProps = {
  children: ReactElement;
  onlyUnAuthorized?: boolean;
  title?: ReactNode;
};

type TProtectedRouteLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuthorized = false,
  title,
}: TProtectedRoutProps): React.JSX.Element => {
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

  return (
    <>
      {title != null && (
        <h3
          className={`text text_type_main-medium ${styles.text} ${styles.detailPageWrap} ${styles.detailHeader}`}
          style={{ textAlign: 'center' }}
        >
          {title}
        </h3>
      )}
      {children}
    </>
  );
};
