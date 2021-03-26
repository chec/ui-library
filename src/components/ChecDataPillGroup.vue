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

  .data-pill {
    @apply inline-block;
  }

  > .data-pill {
    @apply rounded-r-none flex items-center text-right;

    + .data-pill {
      @apply rounded-l-none rounded-r-full text-left;
    }
  }
}
</style>
