<template>
  <div class="segmented-btn">
    <button
      class="segmented-btn__btn"
      @click="handleClick"
      :class="{ 'segmented-btn__btn--active': active }"
    >
      <span class="segmented-btn__label">
        <!--
          @slot Label to display within the segmented button
          @binding active Whether the button is active
        -->
        <slot v-bind="{ active }" />
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ChecSegmentedButton',
  props: {
    /**
     * Button is selected (active)
     */
    active: {
      type: Boolean,
      default: false,
    },
    /**
     * Used to determine which button is active
     */
    value: {
      type: String,
      default: '',
    },
  },
  // computed: {
  //   isActive() {
  //     return this.value === this.active;
  //   },
  // },
  methods: {
    handleClick() {
      /**
       * Emitted the button is clicked
       * @event click
       * @type {$event}
       */
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss">
.segmented-btn {
  @apply cursor-pointer;
  &__btn {
    @apply bg-gray-200 px-3 py-1 text-xs text-gray-500 font-bold uppercase;
    &__label {
      @apply text-gray-500;
    }
    &--active, &:active, &:focus {
      // @apply bg-gray-500;
      &:enabled {
        @apply bg-gray-500 outline-none;
        .segmented-btn__label {
          @apply text-white;
        }
      }
    }
  }
}
</style>
