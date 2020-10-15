<template>
  <span class="data-pill" :class="classObject">
    <!--
      @slot Text to display within the pill
    -->
    <slot />
  </span>
</template>

<script>
export default {
  name: 'ChecDataPill',
  props: {
    /**
     * The color the data pill - specifically the text. Options are: 'gray', 'green', 'orange', 'purple', 'red',
     * 'blue', and 'opaque'. Note that `opaque` is the "soft white" variant.
     */
    color: {
      type: String,
      default: 'gray',
      validator: value => ['gray', 'green', 'orange', 'purple', 'red', 'blue', 'opaque'].includes(value),
    },
    /**
     * Indicates the "filled" variant should be used, where the background color matches the color prop.
     */
    filled: Boolean,
  },
  computed: {
    /**
     * Returns the computed classes for the pill
     *
     * @returns {string}
     */
    classObject() {
      return {
        [`data-pill--${this.color}`]: true,
        'data-pill--filled': this.filled,
      };
    },
  },
};
</script>

<style lang="scss">
$colors: 'green', 'orange', 'purple', 'red', 'blue';

.data-pill {
  @apply py-1 px-2 rounded-full caps-xxs;

  @each $color in $colors {
    &--#{$color} {
      @apply bg-#{$color}-100 text-#{$color}-600;

      &.data-pill--filled {
        @apply bg-#{$color}-500 text-#{$color}-100;
      }
    }
  }

  // Special cases
  &--gray {
    @apply bg-gray-200 text-gray-500;

    &.data-pill--filled {
      @apply bg-gray-400 text-white;
    }
  }

  &--opaque {
    @apply bg-white bg-opacity-20 text-white;
  }
}
</style>
