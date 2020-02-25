<template>
  <div
    class="option"
    :class="{'option--disabled': disabled }"
    @click="emitOptionsSelectedEvent"
    @keyup.enter="emitOptionsSelectedEvent"
    tabindex="0">
    <slot>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'BaseOption',
  props: {
    /**
     *
     * option object
     */
    value: {
      type: String,
    },
    /**
     *
     * disables option
     */
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    emitOptionsSelectedEvent() {
      if (!this.disabled) {
        this.$emit('option-selected', this.value);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .option {
    @apply font-lato text-sm text-gray-600 px-4 py-3 outline-none cursor-pointer bg-white;
    &:hover {
      @apply bg-gray-100;
    }
    &:focus,
    &:active {
      @apply bg-gray-100;
    }
    &:not(:last-child) {
      @apply border-b border-gray-200;
    }
    &--disabled {
      @apply opacity-50;
      &:hover,
      &:active,
      &:focus {
        @apply bg-white;
      }
    }
  }
</style>
