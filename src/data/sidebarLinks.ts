import type { MenuCategory } from '../types/sidebarLinks'

const menu: MenuCategory[] = [
  {
    category: 'links.content.index',
    permissions: ['view_dashboard', 'view_users'],
    children: [
      {
        name: 'links.content.dashboard',
        path: '/',
        icon: 'viewDashboard',
        permissions: ['view_dashboard'],
      },
      {
        name: 'links.content.users',
        path: '/users',
        icon: 'accountMultiple',
        permissions: ['view_users'],
      },
    ],
  },
]

export default menu
