<template>
    <button
      class="segmented-btn"
      :class="{ 'segmented-btn--active': $attrs.active }"
      @click="handleClick"
      :value="value"
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
      default: '',
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
    onKeyDownRight() {
      /**
       * Emitted the keyboard event is down
       * @event keydown
       * @type {$event}
       */
      this.$emit('move-next', this.value);
    },
    onKeyDownLeft() {
      /**
       * Emitted the keyboard event is down
       * @event keydown
       * @type {$event}
       */
      this.$emit('move-prev', this.value);
    },
  },
};
</script>

<style lang="scss">
.segmented-btn {
  @apply cursor-pointer bg-gray-200 px-3 py-1 text-xs rounded-sm text-gray-500 uppercase font-bold;

  &:enabled {
    &:active, &:focus {
      @apply bg-gray-500 outline-none text-white;
    }
  }
}
</style>
