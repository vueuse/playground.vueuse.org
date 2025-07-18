<script setup lang="ts">
import { getVersionsBatch } from 'fast-npm-meta'
import semver from 'semver'

const { data: versions, status, error, refresh: fetchVersions } = await useAsyncData(
  'versions',
  async () => getVersionsBatch(['@vueuse/core', 'vue']),
  { default: () => ([]) },
)

const loadingVersions = computed(() => {
  return status.value === 'pending'
})

const { vueVersion, vueuseVersion } = useReplStore()

watch(() => versions.value, () => {
  if (versions.value.length > 0 && !vueVersion.value) {
    const vue = versions.value.find(p => p.name === 'vue')
    vueVersion.value = vue?.distTags.latest
  }
  if (versions.value.length > 0 && !vueuseVersion.value) {
    const vueuse = versions.value.find(p => p.name === '@vueuse/core')
    vueuseVersion.value = vueuse?.distTags.latest
  }
}, { immediate: true })

watch(() => versions.value, () => {
  if (versions.value.length > 0 && !vueVersion.value) {
    const vue = versions.value.find(p => p.name === 'vue')
    vueVersion.value = vue?.distTags.latest
  }
}, { immediate: true })

const vueVersions = computed(() => {
  const vue = versions.value.find(p => p.name === 'vue')
  if (vue?.error || error.value)
    return []
  return vue?.versions ?? []
})

const vueVersionsSorted = useSorted(vueVersions, (a, b) => semver.compare(b, a))

const vueUseVersions = computed(() => {
  const vueuse = versions.value.find(p => p.name === '@vueuse/core')
  if (vueuse?.error || error.value)
    return []
  return vueuse?.versions ?? []
})

const vueuseVersionsSorted = useSorted(vueUseVersions, (a, b) => semver.compare(b, a))

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const ssr = useRouteQuery<string, boolean>('ssr', 'false', {
  transform: stringToBooleanTransformer,
})

const prod = useRouteQuery<string, boolean>('prod', 'false', {
  transform: stringToBooleanTransformer,
})
</script>

<template>
  <UApp>
    <header class="flex items-center justify-around h-(--header-height)">
      <div class="flex gap-2 items-center">
        <UIcon name="i-logos-vueuse" class="size-8" />VueUse Playground
      </div>

      <div class="flex gap-2 items-center">
        <USwitch v-model="ssr" label="SSR" />
        <USwitch v-model="prod" label="Prod" />
        <USelectMenu v-model="vueuseVersion" :items="vueuseVersionsSorted" class="w-32" icon="i-logos-vueuse" :loading="loadingVersions" />
        <USelectMenu v-model="vueVersion" :items="vueVersionsSorted" class="w-32" icon="i-logos-vue" :loading="loadingVersions" />
        <UButton icon="i-lucide-refresh-ccw" size="md" color="primary" variant="soft" @click="() => fetchVersions()" />
        <UButton
          color="neutral" variant="ghost"
          :icon="colorMode.preference === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          aria-label="color mode"
          @click="toggleColorMode"
        />

        <UTooltip text="Open on GitHub">
          <UButton
            color="neutral"
            variant="ghost"
            to="https://github.com/vueuse"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
          />
        </UTooltip>
      </div>
    </header>

    <main class="h-[calc(100vh-var(--header-height))]">
      <slot />
    </main>
  </UApp>
</template>
