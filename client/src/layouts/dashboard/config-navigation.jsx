import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

/*
Refer to sections for role-based routes

const navConfigByRole = {
  Patient: [
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics'),
    },
    {
      title: 'Appointments',
      path: '/appointments',
      icon: icon('ic_user'),
    },
    {
      title: 'Requests',
      path: '/requests',
      icon: icon('ic_user'),
    },
    {
      title: 'Packages',
      path: '/packages',
      icon: icon('ic_cart'),
    },
    {
      title: 'My package',
      path: '/viewPackage',
      icon: icon('ic_cart'),
    },
    // ... Add other patient-specific items
  ],

  Doctor: [
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics'),
    },
    {
      title: 'Appointments',
      path: '/appointments',
      icon: icon('ic_user'),
    },
    {
      title: 'Doctors',
      path: '/doctors',
      icon: icon('ic_user'),
    },
    {
      title: 'Medical History',
      path: '/medical-history',
      icon: icon('ic_disabled'),
    },
    {
      title: 'Patients',
      path: '/patients',
      icon: icon('ic_user'),
    },
    // ... Add other doctor-specific items
  ],

  Pharmacist: [
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics'),
    },
    {
      title: 'chat',
      path: '/chat',
      icon: icon('ic_analytics'),
    },
    {
      title: 'Orders',
      path: '/orders',
      icon: icon('ic_analytics'),
    },
    {
      title: 'Report',
      path: '/report',
      icon: icon('ic_analytics'),
    },
    // ... Add other pharmacist-specific items
  ],

  Admin: [
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics'),
    },
    {
      title: 'Requests',
      path: '/requests',
      icon: icon('ic_user'),
    },
    {
      title: 'Manage packages',
      path: '/packages-admin',
      icon: icon('ic_cart'),
    },
    {
      title: 'Users',
      path: '/users',
      icon: icon('ic_analytics'),
    },
    {
      title: 'Add Admin',
      path: '/add-admin',
      icon: icon('ic_analytics'),
    },
    // ... Add other admin-specific items
  ],
};

const userNavConfig = navConfigByRole[role] || [];

*/

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics')
  },
  {
    title: 'Appointments',
    path: '/appointments',
    icon: icon('ic_appointment')
  },
  {
    title: 'Requests',
    path: '/requests',
    icon: icon('ic_requests')
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
  },

  {
    title: 'Manage packages',
    path: '/packages-admin',
    icon: icon('ic_cart')
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog')
  },
  {
    title: 'contract',
    path: '/contract',
    icon: icon('ic_contract')
  },
  {
    title: 'Weekly slots',
    path: '/addSlotsOrAppointment',
    icon: icon('ic_add')
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock')
  },
  {
    title: 'Register',
    path: '/register',
    icon: icon('ic_requests')
  },
  {
    title: 'Doctors',
    path: '/doctors',
    icon: icon('ic_doctor')
  },
  {
    title: 'Medical History',
    path: `/medical-history/${localStorage.getItem("userID")}`,
    icon: icon('ic_disabled')
  },
  {
    title: 'Patients',
    path: '/patients',
    icon: icon('ic_patient')
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart')
  },
  {
    title: 'Upload Documents',
    path: '/upload-document',
    icon: icon('ic_upload')
  },
  {
    title: 'My Health Records',
    path: '/health-record',
    icon: icon('ic_healthRecords')
  },
  {
    title: 'My Prescriptions',
    path: '/prescription',
    icon: icon('ic_prescriptions')
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled')
  },
  {
    title: 'Family Members',
    path: '/family',
    icon: icon('ic_family')
  },
  {
    title: 'Add Family Member',
    path: '/addFamily',
    icon: icon('ic_addMember')
  },
  {
    title: 'Forgot Password',
    path: '/forgot-password',
    icon: icon('ic_reset')
  },
  {
    title: 'View Requests',
    path: '/requests-list',
    icon: icon('ic_requests')
  },
  {
    title: 'Addresses',
    path: '/addresses',
    icon: icon('ic_address')
  },
  {
    title: 'orders',
    path: '/orders',
    icon: icon('ic_order')
  },
  {
    title: 'chat',
    path: '/chat',
    icon: icon('ic_chat')
  },
  {
    title: 'report',
    path: '/report',
    icon: icon('ic_report')
  },
  {
    title: 'users',
    path: '/users',
    icon: icon('ic_user')
  },
  {
    title: 'add-admin',
    path: '/add-admin',
    icon: icon('ic_addAdmin')
  }
];

export default navConfig;
