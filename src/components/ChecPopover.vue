<template>
  <div class="popover">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ChecPopover',
};
</script>

<style lang="scss" scoped>
.popover {
  @apply absolute bg-white border border-gray-300 rounded z-50 shadow-md;
}
</style>
