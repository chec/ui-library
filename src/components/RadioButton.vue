<template>
    <div
        class="radio-btn"
        :class="{ 'active' : isChecked, disabled }"
    >
      <label :for="value" class="radio-btn__container">
        <input
            type="radio"
            :id="'name' + 'value'"
            :checked="isChecked"
            :disabled="disabled"
            class="radio-btn__input"
            @input="handleInput"
        />
        <span class="radio-btn__fill"></span>
        <!--  Custom label slot (bind 'label' string, 'isChecked' boolean, 'disabled' boolean -->
        <slot name="label" v-bind="{ label, isChecked, disabled }">
          <div v-if="label" class="radio-btn__label">{{ label }}</div>
        </slot>

      </label>
    </div>
</template>

<script>

export default {
  name: 'RadioButton',
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
     * States whether element is required
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Disables the radio button
     */
    disabled: {
      type: Boolean,
      default: false,
    },
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

.radio-btn {
    @apply p-3 relative cursor-pointer;

    &__container{
       @apply flex font-lato text-sm text-gray-600 cursor-pointer;
    }

    // Hides browser's default radio style
    &__input{
        @apply
          align-middle
          flex
          m-0
          relative
          appearance-none
          bg-white
          rounded-full
          border border-gray-400
          shadow-sm
          h-4 w-4 mt-1;

        &:focus {
            @apply outline-none;
        }

        &:hover{
          @apply cursor-pointer bg-white border border-gray-500;
        }

        &:active{
          @apply bg-gray-300 border border-gray-600;
        }

        &:disabled{
          @apply bg-white border border-gray-300;
        }
    }

    &__input:checked:after {
        @apply bg-gray-500 rounded-full absolute;
        content: '';
        width: 8px;
        height: 8px;
        top: 3px;
        left: 3px;
    }

    &__input:checked{
      @apply bg-white border border-gray-500;
    }

    &__label {
        @apply pl-3;
    }
}

</style>
