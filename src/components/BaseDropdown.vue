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
    <div class="dropdown__control"
      :class="{ 'dropdown__control--open': showDropdown}"
      tabindex="0"
      @click="toggleDropdown"
      @keyup.space="toggleDropdown"
      @keyup.up="toggleDropdown">
      <span>
        {{ shownValue }}
        <div class="dropdown__down-arrow">
          <SvgDownArrow />
        </div>
      </span>
    </div>
    <BasePopover v-if="showDropdown" class="overflow-scroll h-auto">
      <BaseOption
        v-for="option in renderableOptions"
        :key="option.value"
        :disabled="option.disabled"
        :class="baseOptionClass"
        :value="option.value"
        @option-selected="onBaseOptionSelect"
        :select-option="multiselect"
        :checked="!isIndeterminate(option) && isChecked(option)"
        :indeterminate="isIndeterminate(option)"
        :level="option.level"
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
     * Used as name attribute on hidden input
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
      default: () => ([]),
    },
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  watch: {
    selectableOptions() {
      this.onSelectableOptionChange();
    },
  },
  created() {
    // add event listener to listen to outside click events
    window.addEventListener('click', this.onOutsideClick);
  },
  beforeDestroy() {
    // remove event listeners
    window.removeEventListener('click', this.onOutsideClick);
  },
  methods: {
    isParentOption(option) {
      return Object.hasOwnProperty.call(option, 'group');
    },
    onBaseOptionSelect(value) {
      // Normal selects are easy...
      if (!this.multiselect) {
        this.toggleDropdown();
        this.emitInput(value);
        return;
      }

      // We need to only use the values of the bottom level children. Parents can only be chosen to (de)select all of
      // their children. The next little bit will reduce the selected option to only the values of non-parent options
      const option = this.renderableOptions.find(candidate => candidate.value === value);
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
    emitInput(value) {
      /**
      * Emitted when an option is selected.
      * @event input
      * @type {String}
      * @property {String} - key - the value of the option
      */
      this.$emit('input', value);
    },
    onSelectableOptionChange() {
      // toggle dropdown
      this.$emit('input', this.selectableOptions);
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    onOutsideClick(e) {
      if (!this.$refs['dropdown-el'].contains(e.target) && this.showDropdown) {
        this.toggleDropdown();
      }
    },
    selectAll() {
      this.renderableOptions.map((option) => option.value);
    },
    isChecked(option) {
      if (!this.isParentOption(option)) {
        return this.value.includes(option.value);
      }
      return option.group.filter(candidate => !candidate.disabled).every(candidate => this.isChecked(candidate));
    },
    isIndeterminate(option) {
      if (!this.isParentOption(option)) {
        return false;
      }

      return !this.isChecked(option)
        && option.group.filter(candidate => !candidate.disabled).some(candidate => this.isChecked(candidate));
    },
  },
  computed: {
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
    selectedOptions() {
      if (!this.multiselect) {
        return [this.options.find(candidate => candidate.value === this.value)];
      }
      return this.renderableOptions.filter(candidate => this.value.includes(candidate.value));
    },
    shownValue() {
      if (!this.multiselect) {
        return this.selectedOption ? this.selectedOption.label : '';
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
    selectedOption() {
      return this.options.find((option) => option.value === (this.value || ''));
    },
  },
};
</script>

<style lang="scss" scoped>
  .dropdown {
    @apply relative w-full;
    &__control {
      @apply
        w-full
        bg-white
        shadow-sm
        rounded-sm
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
        @apply flex items-center justify-between w-full font-lato p-4 text-sm text-gray-500;
      }
      &--open {
        @apply border border-gray-500;
      }
    }
    &__option {
      @apply font-lato text-sm text-gray-600 px-4 py-3;
      &:not(:last-child) {
        @apply border-b border-gray-200;
      }
    }
    &__down-arrow {
      @apply flex flex-col justify-center w-5 h-5 fill-current text-gray-600;
    }
  }
</style>
