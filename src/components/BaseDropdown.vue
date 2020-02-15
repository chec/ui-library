<template>
  <div class="dropdown" ref="dropdown-el">
    <div class="dropdown__control"
      :class="{ 'dropdown__control--open': showDropdown}"
      tabindex="0"
      @click="toggleDropdown"
      @keyup.space="toggleDropdown"
      @keyup.up="toggleDropdown">
      <span>
        {{
          placeholderOrValue
        }}
        <div class="dropdown__down-arrow">
          <SvgDownArrow />
        </div>
      </span>
    </div>
    <BasePopover v-if="showDropdown">
      <BaseOption
        v-for="({value, label}) in options"
        :key="value"
        :value="value"
        @option-selected="(optionValue) => { onOptionSelect(optionValue, label) }"
        :disabled="!value"
      >
        {{label}}
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
     * The placeholder value for the dropdown
     */
    placeholder: {
      type: String,
    },
    /**
     * The current value of selected option for the dropdown
     */
    value: {
      type: String,
    },
    /**
     * The options for the dropdown
     */
    options: {
      type: Array,
    },
  },
  data() {
    return {
      selectedOption: {},
      showDropdown: false,
    };
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
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    onOutsideClick(e) {
      if (!this.$refs['dropdown-el'].contains(e.target) && this.showDropdown) {
        this.toggleDropdown();
      }
    },
    onOptionSelect(value, label) {
      // set selectedOption
      this.selectedOption = { value, label };
      // toggle the dropdown
      this.toggleDropdown();
      /**
      * Emitted when an option is selected.
      * @event input
      * @type {String}
      * @property {String} - key - the value of the option
      */
      this.$emit('input', value);
    },
  },
  computed: {
    placeholderOrValue() {
      return this.value
        ? this.selectedOption.label
        : (this.placeholder || this.optionsByValue[this.value].label);
    },
    optionsByValue() {
      return this.options.reduce((newObj, currentOption) => {
        const optionsByValue = newObj;
        optionsByValue[currentOption.value] = currentOption;
        return optionsByValue;
      }, {});
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
