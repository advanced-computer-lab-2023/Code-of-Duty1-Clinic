import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Register',
    path: '/register',
    icon: icon('ic_lock'),
  },
  {
    title: 'Doctors',
    path: '/doctors',
    icon: icon('ic_user'),
  },
  {
    title: 'Patients',
    path: '/patients',
    icon: icon('ic_user'),
  },
  {
    title: 'Upload Documents',
    path: '/upload-document',
    icon: icon('ic_disabled')
  },
  {
    title: 'Medical History',
    path: '/medical-history',
    icon: icon('ic_disabled')
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled')
  },
  {
    title: 'View Requests',
    path: '/requests-list',
    icon: icon('ic_disabled')
  },
];

export default navConfig;
