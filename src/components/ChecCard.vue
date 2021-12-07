<template>
  <div class="card" :class="classObject">
    <div
      class="card__inner-wrapper"
      :class="[tailwindClasses, innerClassBackground, innerClass]"
    >
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
  mixins: [TailwindClasses('p-8')],
  props: {
    /**
     * Class to pass to inner container
     */
    innerClass: {
      type: [String, Array],
      default: '',
    },
    /**
     * The style of the borders on the card. One of "full", "none", "vertical", "horizontal".
     */
    borders: {
      type: String,
      default: 'none',
      validator(value) {
        return [
          'none',
          'full',
          'vertical',
          'horizontal',
        ].includes(value);
      },
    },
    /**
     * The color of the borders on the card. One of "holo", "dark", "light".
     */
    borderStyle: {
      type: String,
      default: 'holo',
      validator(value) {
        return [
          'holo',
          'light',
          'dark',
        ].includes(value);
      },
    },
    /**
     * The background color of the card. One of "white", "dark", "gray", "transparent".
     */
    background: {
      type: String,
      default: 'white',
      validator(value) {
        return [
          'white',
          'transparent',
          'dark',
          'gray',
        ].includes(value);
      },
    },
    /**
     * A "compact" variant that reduces border width and radius
     */
    compact: Boolean,
    /**
     * allows card to apply the css class '.card--active' on pointer hovers
     */
    hoverable: Boolean,
    /**
     * Allows card to have shadow
     */
    shadow: Boolean,
    /**
     * sets card to active, applying the css class '.card--active' by default
     */
    active: Boolean,
  },
  computed: {
    /**
     * Returns the computed class name for the variant type, e.g. `card--borderless`
     *
     * @returns {string}
     */
    classObject() {
      return [
        `card--background-${this.background}`,
        `card--border-${this.borders}`,
        `card--border-style-${this.borderStyle}`,
        {
          'card--compact': this.compact,
          'card--hoverable': this.hoverable,
          'card--shadow': this.shadow,
          'card--active': this.active,
        },
      ];
    },
    innerClassBackground() {
      return [`card__inner-wrapper--background-${this.background}`];
    },
  },
};
</script>

<style lang="scss">
.card {
  @apply relative rounded-md border-4 p-1;

  &--hoverable {
    @apply transition duration-200 ease-in-out;

    &:hover {
      @extend .card--active;
    }
  }

  &__inner-wrapper {
    @apply rounded-md h-full;

    &--background-white {
      @apply bg-white;
    }

    &--background-gray {
      @apply bg-gray-300;
    }

    &--background-dark {
      @apply bg-gray-600;
    }

    &--background-transparent {
      @apply bg-transparent;
    }
  }

  &--compact {
    @apply rounded border-2;

    padding: 2px;

    .card__inner-wrapper {
      @apply rounded-sm;
    }
  }

  &--shadow {
    @apply shadow-sm;
  }

  &--background-white {
    @apply bg-white;
  }

  &--background-dark {
    @apply bg-gray-600;
  }

  &--background-gray {
    @apply bg-gray-300;
  }

  &--background-transparent {
    @apply bg-transparent;
  }

  &--border-none {
    @apply border-0 p-0;
  }

  &--border-style-holo {
    @apply bg-hologram border-0;
  }

  &--border-style-dark {
    @apply border-gray-500 p-0;
  }

  &--border-style-light {
    @apply border-gray-300 p-0;
  }

  &--border-vertical {
    @apply py-0 border-b-0 border-t-0 overflow-hidden;

    .card__inner-wrapper {
      @apply rounded-none;
    }
  }

  &--border-horizontal {
    @apply px-0 border-r-0 border-l-0 overflow-hidden;

    .card__inner-wrapper {
      @apply rounded-none;
    }
  }

  &--active {
    @apply shadow-holo;
  }
}
</style>
