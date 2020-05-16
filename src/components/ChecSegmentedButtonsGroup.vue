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
<style scoped lang="scss">
.segmented-btns-group {
  @apply flex;
}
</style>
