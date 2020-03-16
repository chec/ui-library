<template>
  <div class="tabs-group">
    <slot />
  </div>
</template>
<script>
export default {
  name: 'TabsGroup',
};
</script>
<style scoped lang="scss">
  .tabs-group {
    @apply rounded-md bg-gray-500 p-2 text-sm;
    > button {
        @apply mx-1;
    }
  }
</style>
