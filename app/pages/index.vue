<template>
  <client-only>
    <ReplEditor />
    <template #fallback>
      <div class="flex w-full h-full justify-center items-center px-12">
        <UProgress animation="swing" />
      </div>
    </template>
  </client-only>
</template>
