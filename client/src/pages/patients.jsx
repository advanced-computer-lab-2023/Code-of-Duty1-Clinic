import { Helmet } from 'react-helmet-async';

import {PatientsView} from 'src/sections/patients';


export default function PatientPage() {
  return (
    <>
      <Helmet>
        <title> Patients </title>
      </Helmet>

      <PatientsView />
    </>
  );
}
