<template>
  <div class="card">
    <div class="card__inner-wrapper" :class="innerClassWithDefault">
      <slot>
      </slot>
    </div>
  </div>
</template>
<script>
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
  computed: {
    innerClassWithDefault() {
      // If the dev hasn't already provided a background class, make it white
      if (!this.innerClass.match(/(^|\s+)bg-/)) {
        return `${this.innerClass} bg-white`;
      }
      return this.innerClass;
    },
  },
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
