<template>
  <div
    class="option"
    :class="classNames"
    @click="emitOptionsSelectedEvent"
    @keyup.enter="emitOptionsSelectedEvent"
    tabindex="0"
  >
    <input
      v-if="showCheckbox"
      type="checkbox"
      class="mr-3"
      :id="option.value"
      :checked="checked"
      :disabled="option.disabled"
      :indeterminate.prop="indeterminate"
    />
    <slot>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'BaseOption',
  props: {
    /**
     * Set's the option as a selectable option
     */
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicate the checkbox (if shown) should be checked
     */
    checked: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicate the checkbox (if shown) should have an indeterminate state
     */
    indeterminate: {
      type: Boolean,
      default: false,
    },
    /**
     * The option object
     */
    option: {
      type: Object,
      default: () => ({
        value: null,
        disabled: false,
      }),
    },
  },
  computed: {
    level() {
      const { level } = this.option;

      if (!level || typeof level !== 'number') {
        return 0;
      }
      if (level > 3) {
        return 3;
      }
      return level;
    },
    classNames() {
      return [
        { 'option--disabled': this.option.disabled },
        `option--level-${this.level}`,
      ];
    },
  },
  methods: {
    emitOptionsSelectedEvent() {
      if (!this.option.disabled) {
        this.$emit('option-selected', this.option);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .option {
    @apply w-full flex items-center text-sm px-4 py-3 outline-none cursor-pointer bg-white;
    &:hover {
      @apply bg-gray-100;
    }
    &:focus,
    &:active {
      @apply bg-gray-100;
    }
    &:not(:last-child) {
      @apply border-b border-gray-200;
    }
    &--disabled {
      @apply opacity-50 cursor-not-allowed;
      &:hover,
      &:active,
      &:focus {
        @apply bg-white;
      }
    }
    &--level- {
      &1 {
        @apply pl-8;
      }
      &2 {
        @apply pl-12;
      }
      &3 {
        @apply pl-16;
      }
    }
  }
</style>
