import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes, useParams } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import { RegistrationUpload, UploadView } from 'src/sections/upload';

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

export const CartPage = lazy(() => import('src/pages/cart'));
export const OrdersPage = lazy(() => import('src/pages/orders'));
export const PharmacistDocumentUploadPage = lazy(() => import('src/pages/pharmacist-upload-document'));
export const MedicineImageUploadPage = lazy(() => import('src/pages/uploadMedicineImage'));
export const ViewMedicineImage = lazy(() => import('src/pages/view-medicine-image'));
export const AddressesPage = lazy(() => import('src/pages/addresses'));
export const ViewChat = lazy(() => import('src/pages/textChat'));
export const UsersPage = lazy(() => import('src/pages/users'));
export const ReportPage = lazy(() => import('src/pages/report'));
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '',
      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { index: true, element: <IndexPage /> },
        { path: 'appointments', element: <AppointmentsPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'doctors', element: <DoctorsPage /> },
        { path: 'requests', element: <RequestsPage /> },
        { path: '/upload-document', element: <DoctorDocumentUploadPage /> },
        { path: '/medical-history', element: <MedicalHistoryPage /> },
        // { path: 'requests-list', element: <RequestsListPage /> },
        { path: 'patients', element: <PatientsPage /> },
        { path: 'health-record/:patientID', element: <HealthRecordPage /> },
        { path: 'health-record', element: <HealthRecordPage /> },
        { path: 'prescription/:patientID', element: <PrescriptionsPage /> },
        { path: 'prescription', element: <PrescriptionsPage /> },
        { path: 'doctors', element: <DoctorsPage /> },
        { path: 'packages', element: <PackagePage /> },
        { path: 'family', element: <FamilyPage /> },
        { path: 'addFamily', element: <AddFamilyPage /> },
        { path: 'viewPackage', element: <ViewPackagePage /> },
        { path: 'contract', element: <ContractPage /> },
        { path: 'addSlotsOrAppointment', element: <AddSlotsOrAppointmentPage /> },
        { path: 'reset-password', element: <ResetPage /> },

        { path: 'orders', element: <OrdersPage /> },
        { path: 'cart', element: <CartPage /> },
        { path: 'upload-medicine-image', element: <MedicineImageUploadPage /> },
        { path: 'view-medicine-image', element: <ViewMedicineImage /> },
        { path: 'addresses', element: <AddressesPage /> },
        { path: 'chat', element: <ViewChat /> },
        { path: 'report', element: <ReportPage /> },
        { path: 'users', element: <UsersPage /> },

      ]
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
