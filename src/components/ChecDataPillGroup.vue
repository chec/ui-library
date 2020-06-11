<template>
  <div class="data-pill-group">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ChecDataPillGroup',
};
</script>

<style lang="scss">
.data-pill-group {
  @apply flex;

  > .data-pill {
    @apply rounded-r-none;

    + .data-pill {
      @apply rounded-l-none rounded-r-full;
    }
  }
}
</style>
