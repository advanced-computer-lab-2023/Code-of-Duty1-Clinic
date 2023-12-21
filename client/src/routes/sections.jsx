import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes, useParams } from 'react-router-dom';

import { CircularProgress } from '@mui/material';
import ReactLoading from 'react-loading';

import DashboardLayout from 'src/layouts/dashboard';

import { useAuthContext } from 'src/contexts/userContext';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const AppointmentsPage = lazy(() => import('src/pages/appointments'));
export const DoctorsPage = lazy(() => import('src/pages/doctors'));
export const PatientsPage = lazy(() => import('src/pages/patients'));
export const RequestsPage = lazy(() => import('src/pages/requests'));
export const ContractPage = lazy(() => import('src/pages/contract'));
export const AddSlotsOrAppointmentPage = lazy(() => import('src/pages/addSlotsOrAppointment'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const HealthRecordPage = lazy(() => import('src/pages/health-record'));
export const PrescriptionsPage = lazy(() => import('src/pages/prescriptions'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ForgotPage = lazy(() => import('src/pages/forgot-password'));
export const ResetPage = lazy(() => import('src/pages/reset-password'));
export const PackagePage = lazy(() => import('src/pages/packages'));
export const AddFamilyPage = lazy(() => import('src/pages/addFamily'));
export const FamilyPage = lazy(() => import('src/pages/family'));
export const ViewPackagePage = lazy(() => import('src/pages/viewPackage'));
export const DoctorDocumentUploadPage = lazy(() => import('src/pages/doctor-document-upload'));
// export const RequestsListPage = lazy(() => import('src/pages/requests-list'));
export const MedicalHistoryPage = lazy(() => import('src/pages/medical-history'));

export const ProfilePage = lazy(() => import('src/pages/profile'));

export const PackageAdmin = lazy(() => import('src/pages/package-admin'));

export const CartPage = lazy(() => import('src/pages/cart'));
export const OrdersPage = lazy(() => import('src/pages/orders'));
export const PharmacistDocumentUploadPage = lazy(() => import('src/pages/pharmacist-upload-document'));
export const MedicineImageUploadPage = lazy(() => import('src/pages/uploadMedicineImage'));
export const ViewMedicineImage = lazy(() => import('src/pages/view-medicine-image'));
export const AddressesPage = lazy(() => import('src/pages/addresses'));
export const ViewChat = lazy(() => import('src/pages/textChat'));
export const UsersPage = lazy(() => import('src/pages/users'));
export const ReportPage = lazy(() => import('src/pages/report'));
export const AddAdminPage = lazy(() => import('src/pages/addAdmin'));
// ----------------------------------------------------------------------
export default function Router() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  const userRoutes = {
    Patient: [
      { path: 'products', element: <ProductsPage /> },
      { path: 'doctors', element: <DoctorsPage /> },
      { path: 'appointments', element: <AppointmentsPage /> },
      { path: 'chat', element: <ViewChat /> },
      { path: 'requests', element: <RequestsPage /> },
      { path: '/medical-history/:patientID', element: <MedicalHistoryPage /> },
      { path: 'health-record', element: <HealthRecordPage /> },
      { path: 'prescription', element: <PrescriptionsPage /> },
      { path: 'packages', element: <PackagePage /> },
      { path: 'family', element: <FamilyPage /> },
      { path: 'addFamily', element: <AddFamilyPage /> },
      { path: 'viewPackage', element: <ViewPackagePage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'view-medicine-image', element: <ViewMedicineImage /> },
      { path: 'addresses', element: <AddressesPage /> },
      {
        path: 'profile/:id',
        element: <ProfilePage />
      },
    ],
    Doctor: [
      { path: 'products', element: <ProductsPage /> },
      { path: 'doctors', element: <DoctorsPage /> },
      { path: 'appointments', element: <AppointmentsPage /> },
      { path: 'chat', element: <ViewChat /> },
      { path: '/upload-document', element: <DoctorDocumentUploadPage /> },
      { path: '/medical-history/:patientID', element: <MedicalHistoryPage /> },
      { path: 'patients', element: <PatientsPage /> },
      { path: 'health-record/:patientID', element: <HealthRecordPage /> },
      { path: 'prescription/:patientID', element: <PrescriptionsPage /> },
      { path: 'contract', element: <ContractPage /> },
      { path: 'slots', element: <AddSlotsOrAppointmentPage /> },
      {
        path: 'profile/:id',
        element: <ProfilePage />
      },
    ],
    Pharmacist: [
      { path: 'products', element: <ProductsPage /> },
      { path: 'doctors', element: <DoctorsPage /> },
      { path: 'chat', element: <ViewChat /> },
      { path: '/upload-document', element: <DoctorDocumentUploadPage /> },
      { path: 'contract', element: <ContractPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'view-medicine-image', element: <ViewMedicineImage /> },
      { path: 'report', element: <ReportPage /> },
      {
        path: 'profile/:id',
        element: <ProfilePage />
      },
    ],
    Admin: [
      { path: 'requests', element: <RequestsPage /> },
      { path: 'packages-admin', element: <PackageAdmin /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'add-admin', element: <AddAdminPage /> },
      { path: 'report', element: <ReportPage /> },
      {
        path: 'profile/:id',
        element: <ProfilePage />
      },
    ]
  };

  const routes = useRoutes([
    {
      path: '',
      element: token ? (
        <DashboardLayout>
          <Suspense fallback={<CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [{ index: true, element: <IndexPage /> },
      {
        path: 'reset-password',
        element: <ResetPage />
      },
      ...(userRoutes[role] || [])]
    },
    {
      path: 'login',
      element: <LoginPage />
    },
    {
      path: 'register',
      element: <RegisterPage />
    },

    {
      path: 'forgot-password',
      element: <ForgotPage />
    },
    {
      path: '404',
      element: <Page404 />
    },

    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ]);

  return routes;
}
