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
    title: 'user',
    path: '/user',
    icon: icon('ic_user')
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart')
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog')
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
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled')
  },
  {
    title: 'Forgot Password',
    path: '/forgot-password',
    icon: icon('ic_disabled')
  }
];

export default navConfig;
