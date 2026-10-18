import {
  selectFeedError,
  selectFeedIsLoading,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
} from '@/services/slices/feed-slice';
import { useSelector } from '@/services/store';
import { FeedInfoUI } from '@ui';

import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);
  const isLoading = useSelector(selectFeedIsLoading);
  const error = useSelector(selectFeedError);

  const feed = {
    orders,
    total,
    totalToday,
    isLoading,
    error,
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
