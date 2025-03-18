export function getRecordProperty<T extends Record<string, unknown>>(
  item: T | string | null | undefined,
  key: string,
): string {
  if (typeof item === 'string') {
    return item
  }

  if (item == null) {
    return '-'
  }

  return (
    (key.split('.').reduce<unknown>((val, k) => {
      if (val && typeof val === 'object' && k in val) {
        return (val as Record<string, unknown>)[k]
      }
      return null
    }, item) as string) ?? '-'
  )
}
