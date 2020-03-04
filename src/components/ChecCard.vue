<template>
  <div class="card">
    <div class="card__inner-wrapper">
      <slot>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ChecCard',
};
</script>
<style scoped lang="scss">
  .card {
    @apply relative shadow-sm rounded-md;
    z-index: 1;
    &__inner-wrapper {
      @apply bg-white rounded-md h-full w-full;
    }
    &:before, &:after {
      @apply shadow-sm rounded-lg;
      content: "";
      position: absolute;
      top: -0.25rem;
      bottom: -0.25rem;
      left: -0.25rem;
      right: -0.25rem;
      z-index: -1;
      background-image: url(../assets/media/hologram-bg.png);
      background-size: 100% auto;
      background-position: 0 0;
    }
  }
</style>
