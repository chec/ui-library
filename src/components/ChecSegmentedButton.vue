<template>
  <div class="segmented-btn">
    <button
      class="segmented-btn__btn"
      :class="{ 'segmented-btn__btn--active': isActive }"
      @click="handleClick"
      :value="value"
      :active="isActive"
    >
      <span class="segmented-btn__label">
        <!--
          @slot Label to display within the segmented button
          @binding active Whether the button is active
        -->
        <slot v-bind="{ isActive }" />
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ChecSegmentedButton',
  model: {
    prop: 'active',
    event: 'click',
  },
  props: {
    /**
     * Check if the button is selected (active)
     */
    active: {
      type: Boolean,
      default: false,
    },
    /**
     * The value of the segmented button
     */
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    isActive() {
      return this.value === this.active;
    },
  },
  methods: {
    handleClick() {
      /**
       * Emitted the button is clicked
       * @event click
       * @type {$event}
       */
      this.$emit('click', this.value);
    },
  },
};
</script>

<style lang="scss">
.segmented-btn {
  @apply cursor-pointer;
  &__btn {
    @apply bg-gray-200 px-3 py-1 text-xs text-gray-500 font-bold uppercase rounded-sm;
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
