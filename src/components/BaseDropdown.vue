<template>
  <div class="dropdown" ref="dropdown-el">
    <input v-if="!multiselect" type="hidden" :name="name" v-model="value" />
    <input
      v-else
      type="hidden"
      :name="`${name}[]`"
      v-for="optionValue in value"
      :key="optionValue"
      :value="optionValue"
    />
    <div
      class="dropdown__control"
      :class="{ 'dropdown__control--open': showDropdown}"
      tabindex="0"
      @click="toggleDropdown"
      @keyup="onKeyPress"
    >
      <span>
        {{ shownValue }}
        &nbsp;
        <div class="dropdown__down-arrow">
          <SvgDownArrow />
        </div>
      </span>
    </div>
    <BasePopover v-show="showDropdown" class="dropdown__base-popover" :style="{ width: `${dropdownElWidth}px`  }">
      <BaseOption
        v-for="option in renderableOptions"
        :key="option.value"
        :class="baseOptionClass"
        :option="option"
        @option-selected="onBaseOptionSelect"
        :show-checkbox="multiselect"
        :checked="!isIndeterminate(option) && isChecked(option)"
        :indeterminate="isIndeterminate(option)"
      >
        {{option.label}}
      </BaseOption>
    </BasePopover>
  </div>
</template>

<script>
import SvgDownArrow from '../assets/svgs/down-arrow.svg';

import BaseOption from './BaseOption.vue';
import BasePopover from './BasePopover.vue';

export default {
  name: 'BaseDropdown',
  components: {
    SvgDownArrow,
    BaseOption,
    BasePopover,
  },
  props: {
    /**
     * Indicates that multiple options may be selected. In this case the bound v-model will be an array of values
     */
    multiselect: {
      type: Boolean,
      default: false,
    },
    /**
     * Used as name attribute on hidden input
     */
    name: {
      type: String,
    },
    /**
     * Class to pass to inner options
     */
    baseOptionClass: {
      type: String,
    },
    /**
     * The current value of selected option for the dropdown. Array for multi-select. String for single select
     */
    value: {
      type: [String, Array],
    },
    /**
     * The options for the dropdown
     */
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showDropdown: false,
      dropdownElWidth: 0,
    };
  },
  created() {
    // add event listener to listen to outside click events
    window.addEventListener('click', this.onOutsideClick);
  },
  mounted() {
    // set BasePopover width to match root's width since this component is has a 'static' position by default to
    // allow for popping out of scrollable overflow
    const dropdownEl = this.$refs['dropdown-el'];
    this.dropdownElWidth = dropdownEl.clientWidth;
  },
  beforeDestroy() {
    // remove event listeners
    window.removeEventListener('click', this.onOutsideClick);
  },
  methods: {
    /**
     * Determines if the option is provided as a "parent" to child options
     *
     * @param {Object} option
     * @returns {boolean}
     */
    isParentOption(option) {
      return Object.hasOwnProperty.call(option, 'group');
    },
    /**
     * Handle an option being selected
     *
     * @param {Object} option
     */
    onBaseOptionSelect(option) {
      const { value } = option;
      // Normal selects are easy...
      if (!this.multiselect) {
        this.toggleDropdown();
        this.emitInput(value);
        return;
      }

      // We need to only use the values of the bottom level children. Parents can only be chosen to (de)select all of
      // their children. The next little bit will reduce the selected option to only the values of non-parent options
      const valueReducer = (acc, config) => {
        if (config.disabled) {
          return acc;
        }

        if (!this.isParentOption(config)) {
          return [...acc, config.value];
        }
        return [...acc, ...config.group.reduce(valueReducer, [])];
      };
      const values = this.isParentOption(option) ? option.group.reduce(valueReducer, []) : [option.value];

      // Now we calculate whether all the options should be added or removed from the actual "value". They're only
      // removed if _all_ of the options are currently selected
      if (this.value.length > 0 && values.every(candidate => this.value.includes(candidate))) {
        // Remove all options
        this.emitInput(this.value.filter(candidate => !values.includes(candidate)));
        return;
      }

      this.emitInput([
        ...this.value,
        ...values.filter(candidate => !this.value.includes(candidate)),
      ]);
    },
    /**
     * Container for the input event
     *
     * @param {string} value
     */
    emitInput(value) {
      /**
      * Emitted when an option is selected.
      * @event input
      * @type {String}
      * @property {String} - key - the value of the option
      */
      this.$emit('input', value);
    },
    /**
     * Toggles visibility of the dropdown
     */
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    /**
     * Handle a keyboard key press while the dropdown is focused
     */
    onKeyPress() {
      // TODO Add keyboard navigation of options
      this.toggleDropdown();
    },
    /**
     * A handler bound on the window while the component is mounted that closes the dropdown when clicked away
     *
     * @param {Event} event
     */
    onOutsideClick(event) {
      if (!this.$refs['dropdown-el'].contains(event.target) && this.showDropdown) {
        this.toggleDropdown();
      }
    },
    /**
     * Determines whether an option is "checked" - used for filling the prop of `BaseOption`
     *
     * @param {Object} option
     */
    isChecked(option) {
      if (!this.isParentOption(option)) {
        return this.value.includes(option.value);
      }
      return option.group.every(candidate => this.isChecked(candidate));
    },
    /**
     * Determines whether an option is "indeterminate" - used for filling the prop of `BaseOption`
     *
     * @param {Object} option
     */
    isIndeterminate(option) {
      if (!this.isParentOption(option)) {
        return false;
      }

      return option.group.some(candidate => this.isChecked(candidate)) && !this.isChecked(option);
    },
  },
  computed: {
    /**
     * Flattens the provided options into an ordered list, and adds a "level" prop to show what level of indentation
     * a child option will need.
     *
     * @returns {Array<Object>}
     */
    renderableOptions() {
      if (!this.multiselect) {
        return this.options;
      }

      const reducer = (level = 0) => (acc, candidate) => {
        if (this.isParentOption(candidate)) {
          return [...acc, {
            ...candidate,
            level,
          }, ...candidate.group.reduce(reducer(level + 1), [])];
        }

        return [...acc, {
          ...candidate,
          level,
        }];
      };

      return this.options.reduce(reducer(), []);
    },
    /**
     * Returns an array of the currently selected options. Note that for a single select, this still returns an array,
     * but with only one element
     *
     * @returns {Array<Object>}
     */
    selectedOptions() {
      if (!this.multiselect) {
        return [this.options.find(candidate => candidate.value === this.value)];
      }
      return this.renderableOptions.filter(candidate => this.value.includes(candidate.value));
    },
    /**
     * The value that should be shown in the field
     *
     * @returns {string|*}
     */
    shownValue() {
      if (!this.multiselect) {
        // Note: \xa0 is the hex code for a non-breaking space. This is used so Vue will still render it.
        return this.selectedOptions.lengthl > 0 ? this.selectedOptions[0].label : '\xa0';
      }

      if (this.selectedOptions.length === 0) {
        return '\xa0';
      }

      const validOptions = this.selectedOptions.filter(option => !this.isParentOption(option));
      if (validOptions.length <= 2) {
        return validOptions.map((option) => option.label).join(' and ');
      }

      return [
        ...validOptions.slice(0, 2).map(option => option.label),
        ` and ${validOptions.length - 2} more`,
      ].join(', ');
    },
  },
};
</script>

<style lang="scss" scoped>
  .dropdown {
    @apply static w-full text-gray-500;
    &__control {
      @apply
        w-full
        bg-white
        shadow-sm
        rounded
        outline-none
        transition-all
        ease-in
        duration-200
        cursor-pointer
        border
        border-transparent;
      &:hover {
        @apply border border-gray-400;
      }
      &:focus,
      &:active {
        @apply border border-gray-500;
      }
      > span {
        @apply flex items-center justify-between w-full p-4 text-sm;
      }
      &--open {
        @apply border border-gray-500;
      }
    }
    &__option {
      @apply text-sm text-gray-600 px-4 py-3;
      &:not(:last-child) {
        @apply border-b border-gray-200;
      }
    }
    &__base-popover {
      @apply overflow-scroll;
      max-height: 50vh;
    }
    &__down-arrow {
      @apply flex flex-col justify-center w-5 h-5 fill-current text-gray-600;
    }
  }
</style>
