import { Helmet } from 'react-helmet-async';

import { AddView } from 'src/sections/addSlotsOrAppointment/view';

// ----------------------------------------------------------------------

export default function AddSlotsPage() {
  return (
    <>
      <Helmet>
        <title> Add Slots Or Appointment </title>
      </Helmet>

      <AddView />
    </>
  );
}
