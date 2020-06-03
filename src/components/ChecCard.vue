<template>
  <div class="card" :class="classObject">
    <div class="card__inner-wrapper" :class="[tailwindClasses, innerClass]">
      <!--
      @slot Card content
      -->
      <slot />
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
     * The style of the borders on the card. One of "full", "none", "vertical", "horizontal".
     */
    borders: {
      type: String,
      default: 'full',
      validator(value) {
        return ['full', 'none', 'vertical', 'horizontal'].includes(value);
      },
    },
    /**
     * A "compact" variant that reduces border width and radius
     */
    compact: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**
     * Returns the computed class name for the variant type, e.g. `card--borderless`
     *
     * @returns {string}
     */
    classObject() {
      return [
        `card--border-${this.borders}`,
        { 'card--compact': this.compact },
      ];
    },
  },
  mixins: [TailwindClasses('p-8 bg-white')],
};
</script>
<style lang="scss">
.card {
  @apply relative shadow-sm rounded-lg p-1 bg-hologram;

  &__inner-wrapper {
    @apply rounded-md h-full;
  }

  &--compact {
    @apply rounded;
    padding: 2px;

    .card__inner-wrapper {
      @apply rounded-sm;
    }
  }

  &--border-none {
    @apply p-0 rounded-md;
  }

  &--border-vertical {
    @apply px-0 overflow-hidden;
    .card__inner-wrapper {
      @apply rounded-none;
    }
  }

  &--border-horizontal {
    @apply py-0 overflow-hidden;
    .card__inner-wrapper {
      @apply rounded-none;
    }
  }
}
</style>
