<template>
    <div
        class="checkbox"
        :class="{ 'active' : isChecked, disabled }"
    >
      <label :for="id" class="checkbox__container">
        <input
            type="checkbox"
            :id="id"
            :name="name"
            :value="value"
            :checked="isChecked"
            :disabled="disabled"
            class="checkbox__input"
            @input="handleInput"
        />
        <span v-show="isChecked" class="checkbox__check">
          <chec-icon icon="check" />
        </span>
        <!--
          @slot Custom label slot
          @bind label string
          @bind isChecked boolean
          @bind disabled boolean
        -->
        <slot name="label" v-bind="{ label, isChecked, disabled }">
          <div v-if="label" class="checkbox__label">{{ label }}</div>
        </slot>
      </label>
    </div>
</template>

<script>
import _uniqueId from 'lodash.uniqueid';
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecCheckmark',
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
      default: () => [],
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
      } else {
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
      }
    },
  },
};
</script>

<style lang="scss">

.checkbox {
    @apply p-3 relative cursor-pointer;

    &__container {
       @apply flex font-lato text-sm text-gray-600 cursor-pointer;
    }

    &__input {
      @apply
        align-middle
        flex
        m-0
        relative
        appearance-none
        bg-white
        rounded-sm
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
        @apply bg-gray-300 border border-gray-500;
      }

      &:disabled{
        @apply bg-white border border-gray-300;
      }

      &:checked:after {
        @apply text-white absolute;
      }

      &:checked{
        @apply bg-gray-500 border-none;
      }
    }

    &__check {
      margin-top: 1px;
      @apply flex absolute h-4 w-4 self-center justify-around;
      svg {
        @apply h-3 w-3 self-center text-white;
      }
    }

    &__label {
      @apply pl-3;
    }
}

</style>
