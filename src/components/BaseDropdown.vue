<template>
  <div class="dropdown" ref="dropdown-el">
    <input type="hidden" :name="name" v-model="value" />
    <div class="dropdown__control"
      :class="{ 'dropdown__control--open': showDropdown}"
      tabindex="0"
      @click="toggleDropdown"
      @keyup.space="toggleDropdown"
      @keyup.up="toggleDropdown">
      <span>
        {{
          this.selectedOption && this.selectedOption.label
        }}
        <div class="dropdown__down-arrow">
          <SvgDownArrow />
        </div>
      </span>
    </div>
    <BasePopover v-if="showDropdown">
      <BaseOption
        v-for="(option) in options"
        :key="option.value"
        :disabled="option.disabled"
        :class="[baseOptionClass]"
        :value="option.value"
        @option-selected="onBaseOptionSelect"
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
     * The current value of selected option for the dropdown
     */
    value: {
      type: [String, Object],
      default: () => ({}),
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
    onBaseOptionSelect(value) {
      this.toggleDropdown();
      this.emitInput(value);
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
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    onOutsideClick(e) {
      if (!this.$refs['dropdown-el'].contains(e.target) && this.showDropdown) {
        this.toggleDropdown();
      }
    },
  },
  computed: {
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
