import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes, useParams } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import { RegistrationUpload, UploadView } from 'src/sections/upload';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const DoctorsPage = lazy(() => import('src/pages/doctors'));
export const PatientsPage = lazy(() => import('src/pages/patients'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const HealthRecordPage = lazy(() => import('src/pages/health-record'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ForgotPage = lazy(() => import('src/pages/forgot-password'));
export const ResetPage = lazy(() => import('src/pages/reset-password'));

export const DoctorDocumentUploadPage = lazy(() => import('src/pages/doctor-document-upload'));
export const RequestsListPage = lazy(() => import('src/pages/requests-list'));
export const MedicalHistoryPage = lazy(() => import('src/pages/medical-history'));
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
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'doctors', element: <DoctorsPage /> },
        { path: 'reset-password', element: <ResetPage /> },
        { path: '/upload-document', element: <DoctorDocumentUploadPage /> },
        { path: '/medical-history', element: <MedicalHistoryPage /> },
        { path: 'requests-list', element: <RequestsListPage /> },
        { path: 'patients', element: <PatientsPage /> },
        { path: 'health-record/:patientID', element: <HealthRecordPage /> },
        { path: 'health-record', element: <HealthRecordPage /> }
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
