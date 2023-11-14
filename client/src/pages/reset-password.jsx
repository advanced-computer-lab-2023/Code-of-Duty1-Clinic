import { Helmet } from 'react-helmet-async';

import { ResetView } from 'src/sections/reset/view';

// ----------------------------------------------------------------------

export default function ResetPage() {
  return (
    <>
      <Helmet>
        <title> Reset </title>
      </Helmet>

      <ResetView />
    </>
  );
}
