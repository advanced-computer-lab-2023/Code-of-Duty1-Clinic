import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { PrescriptionView } from 'src/sections/prescriptions';

// ----------------------------------------------------------------------

export default function PrescriptionPage() {
  let { patientID } = useParams();
  return (
    <>
      <Helmet>
        <title> Prescriptions </title>
      </Helmet>

      <PrescriptionView patientID={patientID} />
    </>
  );
}
