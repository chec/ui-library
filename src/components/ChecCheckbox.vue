<template>
  <label :for="id" class="checkbox" :class="{ 'active' : isChecked, disabled }">
    <input
      type="checkbox"
      :id="id"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      class="checkbox__input"
      @input="handleInput"
      :indeterminate="indeterminate"
    />
    <!-- Display none check icon and display when checked -->
    <span v-show="!indeterminate && isChecked" class="checkbox__check">
      <chec-icon icon="check" />
    </span>
    <!-- Display none minus icon and display when indeterminate -->
    <span v-show="indeterminate" class="checkbox__minus">
      <chec-icon icon="minus" />
    </span>
    <!--
      @slot Custom label slot
      @bind label string
      @bind isChecked boolean
      @bind disabled boolean
    -->
    <div v-if="label" class="checkbox__label" :class="{ disabled: disabled }">
      <slot v-bind="{ label, isChecked, disabled }">
        {{ label }}
      </slot>
    </div>
  </label>
</template>

<script>
import _uniqueId from 'lodash.uniqueid';
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecCheckbox',
  components: {
    ChecIcon,
  },
  model: {
    prop: 'selected',
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
     * Used to determine if the checkbox is selected
     */
    value: {
      type: String,
      default: 'on',
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
    indeterminate: {
      type: Boolean,
      default: false,
    },
    /**
     * States whether element is required
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Disables the checkbox
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Check if checkbox is selected.
     */
    selected: {
      type: [Array, Boolean],
      default: false,
    },
  },
  computed: {
    isChecked() {
      if (typeof this.selected === 'boolean') {
        return this.selected;
      }
      // Does the selected include the value, compare against the value
      return this.selected.includes(this.value);
    },
    id() {
      // generates unique id concating id, name, value
      return _uniqueId(`${this.name || 'checkbox'}_${this.value}_`);
    },
  },
  methods: {
    handleInput() {
      /**
       * Emitted when input is selected.
       * @event input
       */
      if (typeof this.selected === 'boolean') {
        this.$emit('input', !this.selected);
        return;
      }
      // Store selected w/ spread operator on selected keys in array
      let selected = [...this.selected];
      if (selected.includes(this.value)) {
        // uncheck
        selected = selected.filter((value) => value !== this.value);
      } else {
        // check
        selected.push(this.value);
      }
      this.$emit('input', selected);
    },
  },
};
</script>

<style lang="scss">

.checkbox {
  @apply cursor-pointer font-lato flex items-center text-sm text-gray-600 cursor-pointer;

  &__input {
    @apply
      flex
      align-middle
      m-0
      relative
      appearance-none
      bg-white
      rounded-sm
      border border-gray-400
      shadow-sm
      h-4 w-4;

    &:focus {
      @apply outline-none;
    }

    &:hover{
      @apply cursor-pointer bg-white border border-gray-500;
    }

    &:active{
      @apply bg-gray-300 border border-gray-500;
    }

    &:disabled{
      @apply bg-white border border-gray-300 cursor-not-allowed;
    }

    &:checked:after {
      @apply text-white absolute;
    }

    &:checked{
      @apply bg-gray-500 border-none;
    }

    &:indeterminate:after {
      @apply text-white absolute;
    }

    &:indeterminate {
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
    @apply text-gray-300 cursor-not-allowed;
  }
}

</style>
