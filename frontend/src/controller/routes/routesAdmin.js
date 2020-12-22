import React from 'react';
import HomeAdmin from '../admin/HomeAdmin';
import Training from '../admin/Training';
import Testing from '../admin/Testing';
import ShowTraining from '../admin/ShowTraining';
import UpdateTraining from '../admin/UpdateTraining';
import CrossValidation from '../admin/CrossValidation';

const routesAdmin = [
  {
    name: 'Home',
    fas: 'fas fa-home',
    path: '/',
    exact: true,
    main: () => <HomeAdmin />,
  },
  {
    name: 'Training',
    path: '/training',
    fas: 'fas fa-image',
    exact: true,
    main: () => <Training />,
  },
  {
    name: 'Menu Testing',
    path: '/testing',
    fas: 'fas fa-images',
    exact: true,
    main: () => <Testing />,
  }
  ,
  {
    name: 'Show Training',
    path: '/show_train',
    fas: 'fas fa-images',
    exact: true,
    main: () => <ShowTraining />,
  },
  {
    name: 'Update Training',
    path: '/update_train',
    fas: 'fas fa-images',
    exact: true,
    main: (props) => <UpdateTraining id={props} />,
  },
  {
    name: 'Menu Testing',
    path: '/cross_validation',
    fas: 'fas fa-images',
    exact: true,
    main: () => <CrossValidation />,
  }
];

export default routesAdmin;
