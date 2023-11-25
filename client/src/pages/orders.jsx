import { Helmet } from 'react-helmet-async';

import { OrdersView } from 'src/sections/orders';
// ----------------------------------------------------------------------

export default function OrdersPage() {
  return (
    <>
      <Helmet>
        <title> Orders </title>
      </Helmet>

      <OrdersView />
    </>
  );
}
