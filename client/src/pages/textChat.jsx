import { Helmet } from 'react-helmet-async';
import DoctorView from 'src/sections/textChat/view/patient-doctor/patientForDoctorView';
import PatientView from 'src/sections/textChat/view/patient-doctor/doctorForPatientView';
import Landing from 'src/sections/textChat/view/chatLandingView';
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

      <Landing />
    </>
  );
}
