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
  @apply absolute bg-white border border-gray-300 rounded overflow-hidden z-50 shadow-md;
}
</style>
