<template>
  <div
    class="option"
    :class="{'option--disabled': disabled }"
    @click="emitOptionsSelectedEvent"
    @keyup.enter="emitOptionsSelectedEvent"
    tabindex="0"
  >
    <input
      v-if="selectOption"
      type="checkbox"
      class="mr-3"
      :id="value.value"
      :checked="checked"
      :name="value.value"
      :disabled="value.disabled"
      :indeterminate.prop="indeterminate"
    />
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
     * Set's the option as a selectable option
     */
    selectOption: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 0,
    },
    /**
     *
     * option object
     */
    value: {
      type: [String, Object],
      default: () => ({}),
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
    emitInput(value) {
      if (!this.disabled) {
        this.$emit('input', value);
        this.emitOptionsSelectedEvent();
      }
    },
  },
  computed: {
    valueModel: {
      get() { return this.value; },
      set(value) {
        this.emitInput(value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
  .option {
    @apply w-full flex items-center font-lato text-sm text-gray-500 px-4 py-3 outline-none cursor-pointer bg-white;
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
