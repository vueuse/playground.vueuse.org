// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  sourcemap: false,
  modules: ['@nuxt/ui', '@vueuse/nuxt'],
  vite: {
    optimizeDeps: {
      exclude: ['@vue/repl'],
    },
    build: {
      rollupOptions: {
        external: ['typescript'],
      },
    },
    ssr: {
      noExternal: ['@vue/repl'],
    },
  },
  css: ['~/assets/css/main.css'],
  ssr: true,
})
