import { Helmet } from 'react-helmet-async';

import { HealthRecordView } from 'src/sections/healthRecords';

// ----------------------------------------------------------------------

export default function HealthRecordPage() {
  return (
    <>
      <Helmet>
        <title> Health Records </title>
      </Helmet>

      <HealthRecordView />
    </>
  );
}
