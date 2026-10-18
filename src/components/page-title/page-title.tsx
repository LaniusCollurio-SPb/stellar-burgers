import type { ReactElement, ReactNode } from 'react';

import styles from './page-title.module.css';

export type TPageTitleProps = {
  title?: ReactNode;
  children: ReactElement;
  variant?: 'iceland';
};

export const PageTitle = ({
  title,
  children,
  variant,
}: TPageTitleProps): React.JSX.Element => {
  if (title == null) {
    return <>{children}</>;
  }

  const variantClass = variant === 'iceland' ? styles.fontIceland : '';

  return (
    <>
      <h3
        className={`text text_type_main-medium ${styles.text} ${styles.detailPageWrap} ${styles.detailHeader} ${variantClass}`.trim()}
        style={{ textAlign: 'center' }}
      >
        {title}
      </h3>
      {children}
    </>
  );
};
