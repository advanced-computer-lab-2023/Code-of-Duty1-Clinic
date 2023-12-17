import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const userRoutes = {
  Patient: [
    { path: 'appointments', element: <AppointmentsPage /> },
    { path: 'chat', element: <ViewChat /> },
    { path: 'requests', element: <RequestsPage /> },
    { path: '/medical-history', element: <MedicalHistoryPage /> },
    { path: 'health-record', element: <HealthRecordPage /> },
    { path: 'prescription', element: <PrescriptionsPage /> },
    { path: 'packages', element: <PackagePage /> },
    { path: 'family', element: <FamilyPage /> },
    { path: 'addFamily', element: <AddFamilyPage /> },
    { path: 'viewPackage', element: <ViewPackagePage /> },
    { path: 'orders', element: <OrdersPage /> },
    { path: 'cart', element: <CartPage /> },
    { path: 'view-medicine-image', element: <ViewMedicineImage /> },
    { path: 'addresses', element: <AddressesPage /> }
  ],
  Doctor: [
    { path: 'appointments', element: <AppointmentsPage /> },
    { path: 'chat', element: <ViewChat /> },
    { path: '/upload-document', element: <DoctorDocumentUploadPage /> },
    { path: '/medical-history', element: <MedicalHistoryPage /> },
    { path: 'patients', element: <PatientsPage /> },
    { path: 'health-record/:patientID', element: <HealthRecordPage /> },
    { path: 'prescription/:patientID', element: <PrescriptionsPage /> },
    { path: 'contract', element: <ContractPage /> },
    { path: 'addSlotsOrAppointment', element: <AddSlotsOrAppointmentPage /> }
  ],
  Pharmacist: [
    { path: 'chat', element: <ViewChat /> },
    { path: '/upload-document', element: <DoctorDocumentUploadPage /> },
    { path: 'contract', element: <ContractPage /> },
    { path: 'orders', element: <OrdersPage /> },
    { path: 'upload-medicine-image', element: <MedicineImageUploadPage /> },
    { path: 'view-medicine-image', element: <ViewMedicineImage /> },
    { path: 'report', element: <ReportPage /> }
  ],
  Admin: [
    { path: 'requests', element: <RequestsPage /> },
    { path: 'packages-admin', element: <PackageAdmin /> },
    { path: 'users', element: <UsersPage /> },
    { path: 'add-admin', element: <AddAdminPage /> },
    { path: 'report', element: <ReportPage /> }
  ]
};

const navConfigByRole = {
  Patient: [
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics')
    },
    {
      title: 'Appointments',
      path: '/appointments',
      icon: icon('ic_user')
    },
    {
      title: 'Requests',
      path: '/requests',
      icon: icon('ic_user')
    },
    {
      title: 'Packages',
      path: '/packages',
      icon: icon('ic_cart')
    },
    {
      title: 'My package',
      path: '/viewPackage',
      icon: icon('ic_cart')
    }
    // ... Add other patient-specific items
  ],

  Doctor: [
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics')
    },
    {
      title: 'Appointments',
      path: '/appointments',
      icon: icon('ic_user')
    },
    {
      title: 'Doctors',
      path: '/doctors',
      icon: icon('ic_user')
    },
    {
      title: 'Medical History',
      path: '/medical-history',
      icon: icon('ic_disabled')
    },
    {
      title: 'Patients',
      path: '/patients',
      icon: icon('ic_user')
    }
    // ... Add other doctor-specific items
  ],

  Pharmacist: [
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics')
    },
    {
      title: 'chat',
      path: '/chat',
      icon: icon('ic_analytics')
    },
    {
      title: 'Orders',
      path: '/orders',
      icon: icon('ic_analytics')
    },
    {
      title: 'Report',
      path: '/report',
      icon: icon('ic_analytics')
    }
    // ... Add other pharmacist-specific items
  ],

  Admin: [
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics')
    },
    {
      title: 'Requests',
      path: '/requests',
      icon: icon('ic_user')
    },
    {
      title: 'Manage packages',
      path: '/packages-admin',
      icon: icon('ic_cart')
    },
    {
      title: 'Users',
      path: '/users',
      icon: icon('ic_analytics')
    },
    {
      title: 'Add Admin',
      path: '/add-admin',
      icon: icon('ic_analytics')
    }
    // ... Add other admin-specific items
  ]
};

// Assuming `role` is the user's role, you can access the relevant items using navConfigByRole[role]

const userNavConfig = navConfigByRole[role] || [];

export default navConfig;
