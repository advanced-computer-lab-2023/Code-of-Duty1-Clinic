import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { HealthRecordView } from 'src/sections/healthRecords';

// ----------------------------------------------------------------------

export default function HealthRecordPage() {
  let { patientID } = useParams();
  return (
    <>
      <Helmet>
        <title> Health Records </title>
      </Helmet>

      <HealthRecordView patientID={patientID} />
    </>
  );
}
