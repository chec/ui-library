<template>
  <label
    v-if="selectOption"
    class="option"
    :class="{'option--disabled': disabled }"
    tabindex="0"
    :for="value.value">
    <input
      type="checkbox"
      class="mr-3"
      :id="value.value"
      v-model="value.checked"
      @input="onCheckboxChange"
      :name="value.value"
      :disabled="value.disabled">
    <slot></slot>
  </label>
  <div
    v-else
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
     * Set's the option as a selectable option
     */
    selectOption: {
      type: Boolean,
      default: false,
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
    onCheckboxChange() {
      if (!this.disabled) {
        this.valueModel = { ...this.value, checked: !this.value.checked };
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
