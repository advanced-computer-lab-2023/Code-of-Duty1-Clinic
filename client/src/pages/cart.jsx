import { Helmet } from 'react-helmet-async';

import { cart as CartComponent } from 'src/sections/cart';

// ----------------------------------------------------------------------

export default function CartPage() {
  return (
    <>
      <Helmet>
        <title> cart </title>
      </Helmet>

      <CartComponent />
    </>
  );
}
