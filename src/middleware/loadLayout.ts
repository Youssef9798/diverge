import type { RouteLocation } from 'vue-router'

export async function loadLayoutMiddleware(route: RouteLocation) {
  try {
    const layout = route.meta.layout

    const layoutComponent = await import(`@/layouts/${layout}.vue`)

    route.meta.layoutComponent = layoutComponent.default
  } catch (e) {
    const layout = 'DefaultLayout'

    console.error('Error occurred in processing of layouts: ', e)
    console.log('Mounted default layout: ', layout)

    const layoutComponent = await import(`@/layouts/${layout}.vue`)

    route.meta.layoutComponent = layoutComponent.default
  }
}
