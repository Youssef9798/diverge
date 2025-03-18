export type MenuItem = {
  name: string
  path: string
  icon: string
  permissions: string[]
}

export type MenuCategory = {
  category: string
  permissions: string[]
  children: MenuItem[]
}
