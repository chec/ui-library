<template>
  <div ref="dropdown-el" class="dropdown" :class="{ 'dropdown--with-inline-label': isFocus && label }">
    <input
      v-if="!multiselect"
      :value="value"
      type="hidden"
      :name="name"
    >
    <input
      v-for="optionValue in value"
      v-else
      :key="optionValue"
      type="hidden"
      :name="`${name}[]`"
      :value="optionValue"
    >
    <div
      class="dropdown__control"
      :class="{ 'dropdown__control--open': showDropdown}"
      tabindex="0"
      @click="toggleDropdown"
      @keyup="onKeyPress"
    >
      <div class="dropdown-inner">
        <label v-if="label || placeholder" class="dropdown-inner__label">
          {{ shownLabel }}
        </label>
        <span class="dropdown-inner__value">
          {{ shownValue }}
        </span>
      </div>
      <div class="dropdown__down-arrow">
        <SvgDownArrow />
      </div>
    </div>
    <BasePopover v-show="showDropdown" class="dropdown__base-popover" :style="{ width: `${dropdownElWidth}px` }">
      <BaseOption
        v-for="option in renderableOptions"
        :key="option.value"
        :class="baseOptionClass"
        :option="option"
        :show-checkbox="multiselect"
        :checked="multiselect && !isIndeterminate(option) && isChecked(option)"
        :indeterminate="multiselect && isIndeterminate(option)"
        @option-selected="onBaseOptionSelect"
      >
        {{ option.label }}
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
     *  When in single select mode, a value must be selected. If false, an empty option will be prepended.
     */
    required: Boolean,
    /**
     * Indicates that multiple options may be selected. In this case the bound v-model will be an array of values
     */
    multiselect: Boolean,
    /**
     * Placeholder used when no option has been selected
     */
    placeholder: {
      type: String,
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
    /**
     * The label to use
     */
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isFocus: false,
      showDropdown: false,
      dropdownElWidth: 0,
    };
  },
  computed: {
    /**
     * Flattens the provided options into an ordered list, and adds a "level" prop to show what level of indentation
     * a child option will need.
     *
     * @returns {Array<Object>}
     */
    renderableOptions() {
      const options = [...this.options];

      if (!this.multiselect) {
        if (!this.required) {
          options.unshift({ value: '', label: '\xa0' });
        }
        return options;
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

      return options.reduce(reducer(), []);
    },
    /**
     * Returns an array of the currently selected options. Note that for a single select, this still returns an array,
     * but with only one element
     *
     * @returns {Array<Object>}
     */
    selectedOptions() {
      if (!this.multiselect) {
        return this.options.find(candidate => candidate.value === this.value);
      }
      return this.renderableOptions.filter(candidate => this.value.includes(candidate.value));
    },
    /**
     * The Label that should be shown if placeholder supplied
     *
     * @returns {string|*}
     */
    shownValue() {
      const emptyLabel = '\xa0';
      if (!this.multiselect) {
        // Note: \xa0 is the hex code for a non-breaking space. This is used so Vue will still render it.
        return this.selectedOptions && this.selectedOptions.label.trim()
          ? this.selectedOptions.label.trim()
          : emptyLabel;
      }

      if (this.selectedOptions.length === 0) {
        return emptyLabel;
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
    /**
     * The Label that should be shown
     *
     * @returns {string|*}
     */
    shownLabel() {
      if (!this.isFocus) {
        return this.placeholder || this.label;
      }
      return this.label;
    },
  },
  watch: {
    value(selection) {
      this.isFocus = selection.length > 0;
    },
  },
  created() {
    if (this.value !== '' && this.value.length !== 0) {
      this.isFocus = true;
    }
    // add event listener to listen to outside click events
    window.addEventListener('click', this.onOutsideClick);
    // update this.dropdownElWidth on resize
    window.addEventListener('resize', this.setDropdownElWidth);
  },
  mounted() {
    this.setDropdownElWidth();
  },
  beforeDestroy() {
    // remove event listeners
    window.removeEventListener('click', this.onOutsideClick);
    window.removeEventListener('resize', this.setDropdownElWidth);
  },
  methods: {
    /** Method used to size set the root element's width in the state */
    setDropdownElWidth() {
      // set BasePopover width to match root's width since this component is has a 'static' position by default to
      // allow for popping out of scrollable overflow
      const dropdownEl = this.$refs['dropdown-el'];
      this.dropdownElWidth = dropdownEl.clientWidth;
    },
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
};
</script>

<style lang="scss" scoped>
.dropdown {
  @apply static w-full text-gray-500;

  &-inner {
    @apply flex flex-col;
    width: inherit;

    &__label {
      @apply text-left absolute inline-block origin-top-left transition-transform duration-150
        truncate w-10/12;
      backface-visibility: hidden;

      transform: translate3d(0, 0.5rem, 0) scale3d(1, 1, 1);
    }

    &__value {
      @apply py-2 text-sm;
    }
  }

  &__control {
    @apply
      relative
      left-0
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
      border-transparent
      py-2
      px-4
      flex
      items-center
      justify-between;

    &:hover {
      @apply border border-gray-400;
    }

    &:focus,
    &:active {
      @apply border border-gray-500;
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
    @apply overflow-y-auto overflow-x-hidden;

    max-height: 50vh;
  }

  &__down-arrow {
    @apply flex flex-col justify-center w-4 h-4 fill-current text-gray-600;
  }

  &--with-inline-label {
    .dropdown-inner {
      .dropdown-inner__value {
        @apply pt-4 pb-0;
      }

      .dropdown-inner__label {
        transform: translate3d(0, 0, 0) scale3d(0.8, 0.8, 1);
      }
    }
  }
}
</style>
