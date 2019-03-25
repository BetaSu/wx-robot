import Vue from 'vue'
import Router from 'vue-router'

import ApiItem from '@/containers/items/api'
import IntervalItem from '@/containers/items/interval'
import ManageItem from '@/containers/items/manage'
import Process from '@/containers/process'
import Admin from '../admin';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'signup',
      component: Process
    },
    {
      path: '/d',
      name: 'admin',
      redirect: '/d/api',
      component: Admin,
      children: [
        {
          path: 'api',
          component: ApiItem
        },
        {
          path: 'interval',
          component: IntervalItem
        },
        {
          path: 'manage',
          component: ManageItem
        }
      ]
    }
  ]
})
