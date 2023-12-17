import { Helmet } from 'react-helmet-async';

import { ReqTable } from 'src/sections/users';

// ----------------------------------------------------------------------

export default function RequestsPage() {
  return (
    <>
      <Helmet>
        <title> Requests </title>
      </Helmet>

      <ReqTable />
    </>
  );
}
