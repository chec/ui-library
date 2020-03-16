<template>
  <div class="loading">
    <div class="loading__message">{{ message }}</div>
  </div>
</template>
<script>
export default {
  name: 'ChecLoading',
  props: {
    message: {
      type: String,
      default: 'Loading...',
    },
  },
};
</script>
<style scoped lang="scss">
.loading {
  @apply absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center;
  // Custom: Overlay / Light
  background: rgba(255, 255, 255, 0.9);

  &__message {
    @apply uppercase font-bold tracking-wider text-gray-500 text-xs;
  }
}
</style>
