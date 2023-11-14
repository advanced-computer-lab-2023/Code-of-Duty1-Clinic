import { Helmet } from 'react-helmet-async';

import { ForgotView } from 'src/sections/forgot/view';

// ----------------------------------------------------------------------

export default function ForgotPage() {
  return (
    <>
      <Helmet>
        <title> Forgot </title>
      </Helmet>

      <ForgotView />
    </>
  );
}
