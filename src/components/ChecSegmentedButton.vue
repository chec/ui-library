<template>
  <button
    class="segmented-btn"
    type="button"
    :class="{ 'segmented-btn--active': active }"
    :value="value"
    @click="handleClick"
    @keydown.right="onKeyDownRight"
    @keydown.left="onKeyDownLeft"
  >
    <!--
      @slot Label to display within the segmented button
    -->
    <slot />
  </button>
</template>

<script>
export default {
  name: 'ChecSegmentedButton',
  props: {
    /**
     * The value of the segmented button
     */
    value: {
      type: String,
      required: true,
    },
    /**
     * Whether this button should appear as "active" - having been selected
     */
    active: Boolean,
  },
  methods: {
    handleClick() {
      /**
       * Emitted the button is clicked
       * @event click
       * @property {string} The current value
       */
      this.$emit('click', this.value);
    },
    onKeyDownRight() {
      /**
       * Emitted the keyboard event is down
       * @event keydown
       * @property {string} The current value
       */
      this.$emit('move-next', this.value);
    },
    onKeyDownLeft() {
      /**
       * Emitted the keyboard event is down
       * @event keydown
       * @property {string} The current value
       */
      this.$emit('move-prev', this.value);
    },
  },
};
</script>

<style lang="scss">
.segmented-btn {
  @apply cursor-pointer bg-gray-200 px-3 py-1 rounded-sm text-gray-500 caps-xs;

  &:disabled {
    @apply cursor-not-allowed opacity-50;
  }

  &--active,
  &:active,
  &:focus {
    &:enabled {
      @apply bg-gray-500 outline-none text-white;
    }
  }
}
</style>
