import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import DoctorPage from './pages/DoctorPage'
import PatientPage from './pages/PatientPage'
import AdministratorPage from './pages/AdminstratorPage'
import ProfilePage from './pages/ProfilePage'
import GuestPage from './pages/GuestPage'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/ProfilePage" element={<ProfilePage />} />
      <Route path="/AdminstratorPage" element={<AdministratorPage />} />
      <Route path="/PatientPage" element={<PatientPage />} />
      <Route path="/DoctorPage" element={<DoctorPage />} />
      <Route path="/GuestPage" element={<GuestPage />} />


    </Routes>
  );
}

export default App;
