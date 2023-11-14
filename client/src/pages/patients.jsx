import { Helmet } from 'react-helmet-async';

import { PatientView } from 'src/sections/patients/view';

// ----------------------------------------------------------------------

export default function PatientPage() {
  return (
    <>
      <Helmet>
        <title> Patients </title>
      </Helmet>

      <PatientView />
    </>
  );
}
