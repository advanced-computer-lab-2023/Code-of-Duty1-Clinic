import { Helmet } from 'react-helmet-async';

import { DoctorsView } from 'src/sections/doctors/view';

// ----------------------------------------------------------------------

export default function DoctorsPage() {
  return (
    <>
      <Helmet>
        <title> Doctors </title>
      </Helmet>

      <DoctorsView />
    </>
  );
}
