<script setup lang="ts"></script>

<template>
  <div class="card-base">
    <slot></slot>
  </div>
</template>

<style scoped>
.card-base {
  @apply flex flex-col gap-8 p-14 lg:min-w-[654px] lg:min-h-[559px] bg-white-smoke rounded-2xl;
}
</style>
