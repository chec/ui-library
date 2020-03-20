<template>
  <div class="card">
    <div class="card__inner-wrapper" :class="tailwindClasses">
      <slot>
      </slot>
    </div>
  </div>
</template>
<script>
import TailwindClasses from '../mixins/TailwindClasses';

export default {
  name: 'ChecCard',
  props: {
    /**
     * Class to pass to inner container
     */
    innerClass: {
      type: String,
      default: '',
    },
  },
  mixins: [TailwindClasses('p-4 bg-white')],
};
</script>
<style scoped lang="scss">
  .card {
    @apply relative shadow-sm rounded-lg p-1;
    background-image: inline("../assets/media/hologram-bg.png");

    &__inner-wrapper {
      @apply rounded-md h-full;
    }
  }
</style>
