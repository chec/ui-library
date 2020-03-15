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
    @apply rounded-md bg-gray-500 p-2;
    > button {
      &:before, &:after {
        @apply mx-2;
      }
    }
  }
</style>
