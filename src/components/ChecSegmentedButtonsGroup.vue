<template>
  <div class="segmented-btns-group">
    <slot />
  </div>
</template>
<script>
export default {
  name: 'ChecSegmentedButtonsGroup',
};
</script>
<style lang="scss">
.segmented-btns-group {
  @apply flex cursor-pointer overflow-hidden;
}
</style>
