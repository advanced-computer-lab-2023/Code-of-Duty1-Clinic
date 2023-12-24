import { useState } from 'react';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfigByRole = {
  Patient: [
    {
      title: 'Medicine',
      path: '/products',
      icon: icon('ic_medicine')
    },
    {
      title: 'Doctors',
      path: '/doctors',
      icon: icon('ic_doctor')
    },
    {
      title: 'Appointments',
      path: '/appointments',
      icon: icon('ic_appointment')
    },
    {
      title: 'My Prescriptions',
      path: '/prescription',
      icon: icon('ic_prescriptions')
    },
    {
      title: 'Medical History',
      path: `/medical-history/`,
      icon: icon('ic_history')
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
      title: 'Orders',
      path: '/orders',
      icon: icon('ic_order')
    },
    {
      title: 'Addresses',
      path: '/addresses',
      icon: icon('ic_address')
    },
    {
      title: 'chat',
      path: '/chat',
      icon: icon('ic_chat')
    }
  ],

  Doctor: [
    {
      title: 'Appointments',
      path: '/appointments',
      icon: icon('ic_appointment')
    },
    {
      title: 'Patients',
      path: '/patients',
      icon: icon('ic_patient')
    },
    {
      title: 'Weekly slots',
      path: '/slots',
      icon: icon('ic_add')
    },
    {
      title: 'Upload Documents',
      path: '/upload-document',
      icon: icon('ic_upload')
    },
    {
      title: 'Medicine',
      path: '/products',
      icon: icon('ic_medicine')
    },
    {
      title: 'Doctors',
      path: '/doctors',
      icon: icon('ic_doctor')
    },
    {
      title: 'Contract',
      path: '/contract',
      icon: icon('ic_contract')
    },
    {
      title: 'Chat',
      path: '/chat',
      icon: icon('ic_chat')
    }
  ],

  Pharmacist: [
    {
      title: 'Medicine',
      path: '/products',
      icon: icon('ic_medicine')
    },
    {
      title: 'Doctors',
      path: '/doctors',
      icon: icon('ic_doctor')
    },
    {
      title: 'Orders',
      path: '/orders',
      icon: icon('ic_order')
    },
    {
      title: 'Report',
      path: '/report',
      icon: icon('ic_report')
    },
    {
      title: 'Upload Documents',
      path: '/upload-document',
      icon: icon('ic_upload')
    },
    {
      title: 'Chat',
      path: '/chat',
      icon: icon('ic_chat')
    }
  ],

  Admin: [
    {
      title: 'Requests',
      path: '/requests',
      icon: icon('ic_requests')
    },
    {
      title: 'Report',
      path: '/report',
      icon: icon('ic_report')
    },
    {
      title: 'Manage packages',
      path: '/packages-admin',
      icon: icon('ic_cart')
    },
    {
      title: 'Users',
      path: '/users',
      icon: icon('ic_user')
    },
    {
      title: 'Add Admin',
      path: '/add-admin',
      icon: icon('ic_addAdmin')
    }
  ]
};

const navConfig = (role) => [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics')
  },

  ...navConfigByRole[role]
];

export default navConfig;
