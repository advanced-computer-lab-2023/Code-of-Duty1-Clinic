import { Helmet } from 'react-helmet-async';

import { AddressesView } from 'src/sections/addresses';

// ----------------------------------------------------------------------

export default function AddressesPage() {
  return (
    <>
      <Helmet>
        <title> addresses </title>
      </Helmet>

      <AddressesView />
    </>
  );
}
