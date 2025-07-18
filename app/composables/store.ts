export const useReplStore = createSharedComposable(() => {
  const hash = useRouteHash(undefined, { mode: 'replace' })

  const params = useUrlSearchParams('history')

  const vueuseVersionQuery = computed<string | null>({
    get: () => {
      return (Array.isArray(params.vueuse) ? params.vueuse[0] : params.vueuse) ?? null
    },
    set: (raw) => {
      params.vueuse = raw ?? ''
    },
  })

  const vueVersion = shallowRef<string>()

  const vueuseVersion = shallowRef<string | null>((Array.isArray(vueuseVersionQuery.value) ? vueuseVersionQuery.value[0] : vueuseVersionQuery.value) ?? null)

  const stop = watch(() => hash.value, (newValue) => {
    if (!newValue)
      return
    const hashValue = newValue?.startsWith('#') ? newValue.slice(1) : hash.value
    if (!hashValue)
      return
    const newVersion = JSON.parse(atou(hashValue))?._version
    if (!newVersion)
      return
    vueVersion.value = newVersion
  }, { immediate: true })

  watch(() => vueVersion.value, () => {
    stop()
  }, { once: true })

  watch(() => vueuseVersion.value, (newVersion) => {
    vueuseVersionQuery.value = newVersion
  })

  return {
    vueVersion,
    vueuseVersion,
  }
})
