<template>
 <div class="popover">
  <slot />
 </div>
</template>

<script>
export default {
  name: 'BasePopover',
};
</script>

<style lang="scss" scoped>
 .popover {
  @apply absolute w-full bg-white border border-gray-300 rounded-sm;
 }
</style>
