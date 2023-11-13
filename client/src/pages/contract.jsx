import { Helmet } from 'react-helmet-async';

import { DoctorContract } from 'src/sections/contract';

// ----------------------------------------------------------------------

export default function ContarctPage() {
  return (
    <>
      <Helmet>
        <title> Contract </title>
      </Helmet>

      <DoctorContract />
    </>
  );
}
