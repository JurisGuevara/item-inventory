import authToken from '../helpers/authToken';

const routes = [
  // {
  //   path: '/',
  //   component: () => import('pages/Home.vue'),
  //   beforeEnter: (to, from, next) => {
  //     authToken(to, from, next);
  //   },
  //   redirect: to => {
  //     return { path: '/login' }
  //   },
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/IndexPage.vue') }
  //   ]
  // },
  {
    path: '/login',
    component: () => import('pages/Login.vue'),
    beforeEnter: (to, from, next) => {
      authToken.notAuthToken(to, from, next);
    }
  },
  {
    path: '/itemlist',
    component: () => import('pages/ItemList'),
    beforeEnter: (to, from, next) => {
      authToken.authToken(to, from, next);
    }
  },
  {
    path: '/setlist',
    component: () => import('pages/SetList'),
    beforeEnter: (to, from, next) => {
      authToken.authToken(to, from, next);
    }
  },
  {
    path: '/setdetailslist',
    component: () => import('pages/SetDetailsList'),
    beforeEnter: (to, from, next) => {
      authToken.authToken(to, from, next);
    }
  },
  {
    path: '/additem',
    component: () => import('pages/AddItem'),
    beforeEnter: (to, from, next) => {
      authToken.authToken(to, from, next);
    }
  },
  {
    path: '/addset',
    component: () => import('pages/AddSet'),
    beforeEnter: (to, from, next) => {
      authToken.authToken(to, from, next);
    }
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },
]

export default routes
