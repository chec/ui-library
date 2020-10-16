<template>
  <label :for="id" class="chec-checkbox" :class="labelClasses">
    <input
      :id="id"
      type="checkbox"
      :name="name"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      class="chec-checkbox__input"
      :indeterminate.prop="indeterminate"
      @input="handleInput"
    >
    <!-- Display none check icon and display when checked -->
    <span v-show="!indeterminate && checked" class="chec-checkbox__check">
      <ChecIcon icon="check" />
    </span>
    <!-- Display none minus icon and display when indeterminate -->
    <span v-show="indeterminate" class="chec-checkbox__minus">
      <ChecIcon icon="minus" />
    </span>
    <!--
      @slot Custom label slot
      @bind label string
      @bind checked boolean
      @bind disabled boolean
    -->
    <span v-if="label" class="chec-checkbox__label" :class="{ disabled: disabled }">
      <slot v-bind="{ label, checked, disabled }">
        {{ label }}
      </slot>
    </span>
  </label>
</template>

<script>
import uniqueId from '@/lib/helpers/createUniqueId';
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecCheckbox',
  components: {
    ChecIcon,
  },
  model: {
    prop: 'checked',
    event: 'input',
  },
  props: {
    /**
     * Name of the checkbox
     */
    name: {
      type: String,
      default: '',
    },
    /**
     * Used to determine if the checkbox is checked
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
     * Puts checkbox into an indeterminate state
     */
    indeterminate: Boolean,
    /**
     * Disables the checkbox
     */
    disabled: Boolean,
    /**
     * Check if checkbox is checked.
     */
    checked: Boolean,
  },
  computed: {
    id() {
      return this.$attrs.id || uniqueId(this.name, this.value, 'checkbox')();
    },
    labelClasses() {
      const { checked, disabled, indeterminate } = this;

      return {
        'chec-checkbox--active': checked,
        'chec-checkbox--disabled': disabled,
        'chec-checkbox--indeterminate': indeterminate,
      };
    },
  },
  methods: {
    handleInput() {
      /**
       * Emitted when input is checked.
       * @event input
       */
      this.$emit('input', !this.checked);
    },
  },
};
</script>

<style lang="scss">

.chec-checkbox {
  @apply cursor-pointer flex items-center text-sm text-gray-600 cursor-pointer relative;

  &__input {
    @apply
      flex
      align-middle
      m-0
      relative
      appearance-none
      bg-white
      rounded
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
      @apply bg-gray-300 border border-gray-500;
    }

    &:disabled {
      @apply bg-white border border-gray-300 cursor-not-allowed;
    }

    &:checked::after {
      @apply text-white absolute;
    }

    &:checked {
      @apply bg-gray-500 border-none;
    }

    &:indeterminate::after,
    .chec-checkbox--indeterminate &::after {
      @apply text-white absolute;
    }

    &:indeterminate,
    .chec-checkbox--indeterminate & {
      @apply bg-gray-500 border-none;
    }
  }

  &__check {
    @apply flex items-center justify-center absolute h-4 w-4;

    svg {
      @apply text-white h-3 w-3;
    }
  }

  &__minus {
    @apply flex items-center justify-center absolute h-4 w-4;

    svg {
      @apply text-white h-3 w-3;
    }
  }

  &__label {
    @apply ml-3;
  }

  &__label.disabled {
    @apply text-gray-400 cursor-not-allowed;
  }
}

</style>
