<template>
  <div
    ref="container"
    class="dropdown"
    :class="classNames"
    @click="toggleDropdown"
    @keyup="onKeyPress"
  >
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
    <div>
      <label v-if="label" class="dropdown__label">
        {{ label }}
      </label>
      <div class="dropdown__value">
        {{ shownValue }}
      </div>
    </div>
    <ChecIcon icon="down" class="dropdown__down-arrow" />
    <ChecPopover
      target-ref="container"
      :open="showDropdown"
      placement="bottom-end"
      :popper-options="popoverOptions"
    >
      <div
        ref="popper"
        class="dropdown__popover"
        :style="{
          width: `${dropdownElWidth}px`,
        }"
      >
        <div v-if="showSearch" class="dropdown__option-search">
          <TextField
            ref="search"
            :label="$t('general.search')"
            icon="search"
            :value="searchValue"
            @input="handleSearch"
            @focusin="handleSearchFocusIn"
            @focusout="handleSearchFocusOut"
          />
        </div>
        <div ref="options" class="dropdown__options">
          <ChecOption
            v-for="option in renderableOptions"
            :key="option.value"
            :class="checOptionClass"
            :option="option"
            :show-checkbox="multiselect"
            :checked="multiselect && !isIndeterminate(option) && isChecked(option)"
            :indeterminate="multiselect && isIndeterminate(option)"
            @option-selected="onChecOptionSelect"
          >
            {{ option.label }}
          </ChecOption>
          <ChecOption v-if="loading" loading />
        </div>
      </div>
    </ChecPopover>
  </div>
</template>

<script>
import TextField from '@/components/TextField';
import ChecOption from './ChecOption.vue';
import ChecPopover from './ChecPopover.vue';
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecDropdown',
  components: {
    TextField,
    ChecIcon,
    ChecOption,
    ChecPopover,
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
     * The state of the text field. One of "disabled", "error".
     */
    variant: {
      type: String,
      default: '',
    },
    /**
    * Force label to always be in the minimized position.
    */
    minimizedLabel: Boolean,
    /**
     * Optional placeholder used when no option has been selected
     */
    placeholder: String,
    /**
     * Used as name attribute on hidden input
     */
    name: {
      type: String,
    },
    /**
     * Class to pass to inner options
     */
    checOptionClass: {
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
    /**
     * Whether to show a search box that is fixed above the list of options
     */
    showSearch: Boolean,
    /**
     * The value within the search field (if shown)
     */
    searchValue: {
      type: String,
      default: '',
    },
    /**
     * Whether to append a loading row to the existing options in the dropdown
     */
    loading: Boolean,
  },
  data() {
    return {
      isFocus: false,
      showDropdown: false,
      dropdownElWidth: 0,
      searchIsFocused: false,
      popoverOptions: {
        onFirstUpdate: () => {
          if (this.showSearch) {
            this.$refs.search.$el.querySelector('input').focus();
          }

          this.$refs.options
            .addEventListener('scroll', ({ target: element }) => {
              if (
                element.scrollHeight !== element.clientHeight
                && element.scrollHeight - element.scrollTop === element.clientHeight
              ) {
                /**
                 * Emitted when the user scrolls the list of options to the bottom
                 */
                this.$emit('scroll-to-bottom');
              }
            });
        },
      },
    };
  },
  computed: {
    classNames() {
      const {
        isFocus,
        label,
        showDropdown,
        showingPlaceholder,
        variant,
        minimizedLabel,
      } = this;

      return {
        'dropdown--with-inline-label': isFocus && label,
        'dropdown--showing-placeholder': showingPlaceholder,
        'dropdown--open': showDropdown,
        'dropdown--labeless': !label,
        'dropdown--minimized-label': minimizedLabel,
        [`dropdown--${variant}`]: variant !== '',
      };
    },
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
    shownValue() {
      const emptyLabel = this.hasPlaceholder ? this.placeholder : '\xa0';
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
    hasPlaceholder() {
      return typeof this.placeholder === 'string' && this.placeholder.length > 0;
    },
    showingPlaceholder() {
      if (!this.hasPlaceholder) {
        return false;
      }

      if (Array.isArray(this.selectedOptions)) {
        return this.selectedOptions.length === 0;
      }

      return !this.selectedOptions || !this.selectedOptions.label.trim();
    },
  },
  watch: {
    value(selection) {
      this.isFocus = selection.length > 0;
    },
  },
  created() {
    if (this.value && this.value !== '' && this.value.length !== 0) {
      this.isFocus = true;
    }
    this.validateValue();

    // add event listener to listen to outside click events
    window.addEventListener('click', this.onOutsideClick);
    // update this.dropdownElWidth on resize
    window.addEventListener('resize', this.setDropdownElWidth);
  },
  mounted() {
    if (window) {
      window.requestAnimationFrame(() => this.setDropdownElWidth());
    }
  },
  beforeDestroy() {
    // remove event listeners
    window.removeEventListener('click', this.onOutsideClick);
    window.removeEventListener('resize', this.setDropdownElWidth);
  },
  methods: {
    /**
     * Ensures the provided value attribute is acceptable, given the options provided
     */
    validateValue() {
      if (!this.value || this.value === '' || this.value.length === 0) {
        return;
      }

      const values = Array.isArray(this.value) ? this.value : [this.value];
      const optionValues = this.renderableOptions.map((option) => option.value);

      values.forEach((value) => {
        if (!optionValues.includes(value)) {
          throw new Error(`Provided value ${value} must be one of the provided options.`);
        }
      });
    },
    /**
     * Handle the search field losing focus
     */
    handleSearchFocusOut() {
      // Delay the focus update for a bit for double-clicks and event ordering
      setTimeout(() => {
        this.searchIsFocused = false;
      }, 200);
    },
    /**
     * Handle the search field gaining focus
     */
    handleSearchFocusIn() {
      this.searchIsFocused = true;
    },
    /**
     * Handle the "input" event of the search field
     * @param args
     */
    handleSearch(...args) {
      /**
       * Emitted when the search field (if shown) is typed into
       *
       * @event input
       * @type {String}
       * @property {String} - The new value of the underlying text field
       * @property {Event} - The original input event.
       */
      this.$emit('search', ...args);
    },
    /** Method used to size set the root element's width in the state */
    setDropdownElWidth() {
      // set ChecPopover width to match root's width since this component is has a 'static' position by default to
      // allow for popping out of scrollable overflow
      const dropdownEl = this.$refs.container;
      if (!dropdownEl) {
        return;
      }
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
    onChecOptionSelect(option) {
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
      if (this.variant === 'disabled') {
        return;
      }

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
      if (this.searchIsFocused) {
        return;
      }

      if (!this.showDropdown) {
        return;
      }

      if (this.$refs.container.contains(event.target) || this.$refs.popper.contains(event.target)) {
        return;
      }

      this.toggleDropdown();
    },
    /**
     * Determines whether an option is "checked" - used for filling the prop of `ChecOption`
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
     * Determines whether an option is "indeterminate" - used for filling the prop of `ChecOption`
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

<style lang="scss">
.dropdown {
  @apply relative flex items-center w-full text-gray-500 bg-white rounded outline-none cursor-pointer border
    border-gray-200 px-4 flex items-center shadow-sm justify-between text-left;

  &__label {
    @apply absolute pointer-events-none ml-5 mt-4 leading-tight text-gray-500
      transition-transform duration-150 origin-top-left truncate w-10/12;

    // Counteract the border width. Text-field doesn't have this problem becuase the label is relative to a parent that
    // doesn't have a border
    left: -1px;
    top: -1px;

    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  }

  &__popover {
    @apply static bg-white border border-gray-300 rounded-md z-50 shadow-md overflow-hidden;
  }

  &__value {
    @apply leading-tight py-4 text-sm text-gray-600 pr-2;
  }

  &:hover {
    @apply border border-gray-400;
  }

  &:focus,
  &:active {
    @apply border border-gray-500 shadow-light-focus;
  }

  &__option {
    @apply text-sm text-gray-600 px-4 py-3;

    &:not(:last-child) {
      @apply border-b border-gray-200;
    }
  }

  &__options {
    @apply overflow-y-auto overflow-x-hidden;
    max-height: 40vh;
  }

  &__down-arrow {
    @apply flex flex-col flex-shrink-0 justify-center w-4 h-4 transform transition-transform duration-200;
  }

  &__option-search {
    @apply px-4 py-3 border-b border-gray-200 w-full bg-white;
  }

  &--open {
    @apply border border-gray-500 shadow-light-focus;

    .dropdown__down-arrow {
      @apply -rotate-180;
    }
  }

  &--with-inline-label,
  &--showing-placeholder {
    .dropdown__label {
      transform: translate(-0.2rem, -0.5rem) scale(0.8, 0.8);
    }

    .dropdown__value {
      @apply pt-6 pb-2;
    }
  }

  &--showing-placeholder {
    .dropdown__value {
      @apply text-gray-400;
    }

    &.dropdown--labeless {
      .dropdown__value {
        @apply py-4;
      }
    }
  }

  &--disabled {
    @apply opacity-50 cursor-not-allowed;

    &:hover,
    &:focus,
    &:active {
      @apply border-gray-300 transition-opacity duration-300 ease-in-out opacity-50;
    }
  }

  &--error {
    @apply border-red-400;

    &.dropdown--open {
      @apply shadow-error-focus;
    }

    &:hover,
    &:focus,
    &:active {
      @apply border-red-300;
    }

    &:focus,
    &:active {
      @apply shadow-error-focus;
    }
  }

  &--minimized-label {
    .dropdown__label {
      transform: translate(-0.2rem, -0.5rem) scale(0.8, 0.8);
    }
  }
}
</style>
