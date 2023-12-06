import { Helmet } from 'react-helmet-async';

import { AppointmentsView } from 'src/sections/appointments/view';

// ----------------------------------------------------------------------

export default function AppointmentsPage() {
  return (
    <>
      <Helmet>
        <title> User </title>
      </Helmet>

      <AppointmentsView />
    </>
  );
}
