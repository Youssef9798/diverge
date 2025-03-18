import type { DirectiveBinding } from 'vue'

interface clickAwayElement extends HTMLElement {
  clickAwayEvent?: (event: Event) => void
}

export default {
  beforeMount(el: clickAwayElement, binding: DirectiveBinding) {
    el.clickAwayEvent = (event: Event) => {
      if (!el.contains(event.target as Node)) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickAwayEvent)
  },
  unmounted(el: clickAwayElement) {
    if (el.clickAwayEvent) {
      document.removeEventListener('click', el.clickAwayEvent)
      delete el.clickAwayEvent
    }
  },
}
