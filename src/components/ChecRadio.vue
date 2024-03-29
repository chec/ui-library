<template>
  <label :for="id" class="chec-radio" :class="{ 'active' : isChecked, disabled }">
    <input
      :id="id"
      type="radio"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      :name="name"
      class="chec-radio__input"
      @input="handleInput"
    >
    <span class="chec-radio__fill" />
    <div v-if="label" class="chec-radio__label">{{ label }}</div>
  </label>
</template>

<script>
import _uniqueId from 'lodash.uniqueid';

export default {
  name: 'ChecRadio',
  model: {
    prop: 'selected',
    event: 'input',
  },
  props: {
    /**
     * Name of the radio button
     */
    name: {
      type: String,
      default: '',
    },
    /**
     * The value of the radio button
     */
    value: {
      type: String,
      default: '',
    },
    /**
     * Sets the label for the input option.
     */
    label: {
      type: String,
      default: '',
    },
    /**
     * Disables the radio button
     */
    disabled: Boolean,
    /**
     * Check if radio button is selected.
     */
    selected: {
      type: String,
      default: '',
    },
  },
  computed: {
    isChecked() {
      return this.value === this.selected;
    },
    id() {
      return _uniqueId(`${this.name || 'radio'}_${this.value}_`);
    },
  },
  methods: {
    handleInput() {
      /**
       * Emitted when input is selected.
       * @event input
       */
      this.$emit('input', this.value);
    },
  },
};
</script>

<style lang="scss">

.chec-radio {
  @apply cursor-pointer flex text-sm text-gray-600 items-center;

  &.disabled {
    @apply text-gray-400 cursor-not-allowed;
  }

  // Hides browser's default radio style
  &__input {
    @apply
      flex
      relative
      appearance-none
      bg-white
      rounded-full
      border border-gray-400
      shadow-inner
      h-4 w-4;

    &:focus {
      @apply outline-none;
    }

    &:hover {
      @apply cursor-pointer bg-white border border-gray-500;
    }

    &:active {
      @apply bg-gray-300 border border-gray-600;
    }

    &:disabled {
      @apply bg-white border border-gray-300 cursor-not-allowed;
    }
  }

  &__input:checked::after {
    @apply self-center left-0 right-0 mx-auto w-2 h-2 bg-white rounded-full absolute;

    content: '';
  }

  &__input:checked {
    @apply bg-gray-500 border-none;
  }

  &__label {
    @apply pl-3;
  }
}

</style>
