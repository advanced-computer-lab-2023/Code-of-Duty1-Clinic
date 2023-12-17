import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
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
    icon: icon('ic_lock')
  },
  {
    title: 'Doctors',
    path: '/doctors',
    icon: icon('ic_user')
  },
  {
    title: 'Medical History',
    path: `/medical-history/${localStorage.getItem("userID")}`,
    icon: icon('ic_disabled')
  },
  {
    title: 'Patients',
    path: '/patients',
    icon: icon('ic_user')
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart')
  },
  {
    title: 'Upload Documents',
    path: '/upload-document',
    icon: icon('ic_disabled')
  },
  {
    title: 'My Health Records',
    path: '/health-record',
    icon: icon('ic_analytics')
  },
  {
    title: 'My Prescriptions',
    path: '/prescription',
    icon: icon('ic_analytics')
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled')
  },
  {
    title: 'Family Members',
    path: '/family',
    icon: icon('ic_user')
  },
  {
    title: 'Add Family Member',
    path: '/addFamily',
    icon: icon('ic_user')
  },
  {
    title: 'Forgot Password',
    path: '/forgot-password',
    icon: icon('ic_disabled')
  },
  {
    title: 'View Requests',
    path: '/requests-list',
    icon: icon('ic_disabled')
  },
  {
    title: 'Addresses',
    path: '/addresses',
    icon: icon('ic_analytics')
  },
  {
    title: 'orders',
    path: '/orders',
    icon: icon('ic_analytics')
  },
  {
    title: 'chat',
    path: '/chat',
    icon: icon('ic_analytics')
  },
  {
    title: 'report',
    path: '/report',
    icon: icon('ic_analytics')
  },
  {
    title: 'users',
    path: '/users',
    icon: icon('ic_analytics')
  },
  {
    title: 'add-admin',
    path: '/add-admin',
    icon: icon('ic_analytics')
  },

];

export default navConfig;
