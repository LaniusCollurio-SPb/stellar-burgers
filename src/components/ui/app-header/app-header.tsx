import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

type TToggleNavLinkStyleState = {
  isActive: boolean;
};

const toggleNavLinkStyle = ({ isActive }: TToggleNavLinkStyleState): string =>
  clsx(styles.link, { [styles.link_active]: isActive });

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink to="/" end className={toggleNavLinkStyle}>
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">Конструктор</p>
            </>
          )}
        </NavLink>
        <NavLink to="/feed" end className={toggleNavLinkStyle}>
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">Лента заказов</p>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.logo}>
        <NavLink to="/" className={styles.logo}>
          <Logo className="" />
        </NavLink>
      </div>
      <div className={styles.link_position_last}>
        <NavLink to="/profile" end className={toggleNavLinkStyle}>
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">
                {userName ?? 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
