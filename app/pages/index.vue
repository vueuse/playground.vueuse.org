<script setup lang="ts">
import type { OutputModes } from '@vue/repl'
import { mergeImportMap, useStore, useVueImportMap } from '@vue/repl'

const showOutput = useRouteQuery<string, boolean>('showOutput', 'false', {
  transform: stringToBooleanTransformer,
})

const outputMode = useRouteQuery<OutputModes, OutputModes>('outputMode', 'preview')

const ssr = useRouteQuery<string, boolean>('ssr', 'false', {
  transform: stringToBooleanTransformer,
})

const prod = useRouteQuery<string, boolean>('prod', 'false', {
  transform: stringToBooleanTransformer,
})

const hash = useRouteHash(undefined, { mode: 'replace' })

const {
  importMap: builtinImportMap,
  vueVersion,
  productionMode,
} = useVueImportMap()

const { vueVersion: injectedVueVersion, vueuseVersion } = useReplStore()

const vueUsePackages = [
  '@vueuse/metadata',
  '@vueuse/shared',
  '@vueuse/core',
  '@vueuse/integrations',
  '@vueuse/math',
  '@vueuse/rxjs',
]

function generateVueUseImportCDNs() {
  return vueUsePackages.map((p) => {
    return [p, `https://cdn.jsdelivr.net/npm/${p}@${vueuseVersion.value}/index.mjs`]
  })
}

const importMap = computed(() => {
  return mergeImportMap(builtinImportMap.value, {
    imports: Object.fromEntries([...generateVueUseImportCDNs(), ['vue-demi', 'https://cdn.jsdelivr.net/npm/vue-demi@0.14.10/lib/index.mjs'], ['yaml', 'https://cdn.jsdelivr.net/npm/yaml@2.7.1/+esm']]),
  })
})

const { template } = useTemplate()

watch(() => injectedVueVersion.value, (newVersion) => {
  vueVersion.value = newVersion ?? null
})

watch(() => prod.value, (newProd) => {
  productionMode.value = newProd
}, { immediate: true })

const store = useStore(
  {
    // pre-set import map
    builtinImportMap: importMap,
    vueVersion,
    // starts on the output pane (mobile only) if the URL has a showOutput query
    showOutput,
    // starts on a different tab on the output pane if the URL has a outputMode query
    // and default to the "preview" tab
    outputMode,
    template,
  },
  // initialize repl with previously serialized state
  hash.value ?? undefined,
)

// persist state to URL hash
watchEffect(() => hash.value = store.serialize())
</script>

<template>
  <ReplEditor :ssr="ssr" :store="store" />
</template>
