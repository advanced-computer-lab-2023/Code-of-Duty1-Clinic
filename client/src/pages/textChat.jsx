import { Helmet } from 'react-helmet-async';
import DoctorView from 'src/sections/textChat/doctor-patient/view/doctorView';
import PatientView from 'src/sections/textChat/doctor-patient/view/patientView';

// ----------------------------------------------------------------------

export default function ViewChat() {
  let content;
  console.log(localStorage.getItem('userRole'));
  switch (localStorage.getItem('userRole')) {
    case 'Patient':
      content = <PatientView />;
      break;
    case 'Doctor':
      content = <DoctorView />;
      break;
    default:
      content = null;
  }

  return (
    <>
      <Helmet>
        <title> User </title>
      </Helmet>

      {content}
    </>
  );
}
