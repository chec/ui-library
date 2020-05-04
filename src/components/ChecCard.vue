<template>
  <div class="card" :class="classObject">
    <div class="card__inner-wrapper" :class="[tailwindClasses, innerClass]">
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
    /**
     * The style variant for the card.
     One of "bordered", "borderless", "border-vertical", "border-horizontal". Default is "bordered"
     */
    variant: {
      type: String,
      default: 'bordered',
      validator(value) {
        return ['bordered', 'borderless', 'border-vertical', 'border-horizontal'].includes(value);
      },
    },
  },
  computed: {
    /**
     * Returns the computed class name for the variant type, e.g. `card--borderless`
     *
     * @returns {string}
     */
    classObject() {
      return this.variant ? `card--${this.variant}` : '';
    },
  },
  mixins: [TailwindClasses('p-8 bg-white')],
};
</script>
<style scoped lang="scss">
  .card {
    @apply relative shadow-sm rounded-lg p-1;
    background-image: inline("../assets/media/hologram-bg.png");

    &__inner-wrapper {
      @apply rounded-md h-full;
    }

    &--borderless {
      @apply p-0 rounded-md;
    }

    &--border-vertical {
      @apply px-0 overflow-hidden;
      .card__inner-wrapper {
        border-radius: 0;
      }
    }
    &--border-horizontal {
      @apply py-0 overflow-hidden;
      .card__inner-wrapper {
        border-radius: 0;
      }
    }
  }
</style>
