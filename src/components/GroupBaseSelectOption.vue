<template>
  <div class="outline-none" tabindex="0">
    <label class="option flex" :for="value.value">
      <input
        class="mr-4 self-center"
        :class="{'option--disabled': value.disabled }"
        type="checkbox"
        :id="value.value"
        :checked="value.checked"
        @input="() => toggleOptions()"
        :value="value.value"
        :name="value.value">
      <slot></slot>
    </label>
    <div class="pl-4">
      <BaseOption
        v-for="(option, i) in valueModel.group"
        :key="option.value"
        :selectOption="true"
        v-model="valueModel.group[i]"
        :class="[innerOptionClass]"
        :disabled="option.disabled"
        @input="onBaseOptionInput"
      >
        {{option.label}}
      </BaseOption>
    </div>
  </div>
</template>
<script>
import BaseOption from './BaseOption.vue';

export default {
  name: 'GroupBaseSelectOption',
  components: {
    BaseOption,
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    innerOptionClass: {
      type: String,
    },
  },
  created() {
    // on creation sync parent option's checked value with nested checked values
    this.$nextTick().then(() => {
      this.toggleOptions(this.value.checked);
    });
  },
  methods: {
    onBaseOptionInput() {
      if (this.hasCheckedOption && !this.value.checked) {
        // if has checked option, then check parent
        this.valueModel = { ...this.value, checked: true };
      } else if (!this.hasCheckedOption) {
        // if all options are unchecked, then uncheck parent
        this.valueModel = { ...this.value, checked: false };
      }
    },
    emitInput(value) {
      if (!value.disabled) {
        this.$emit('input', value);
      }
    },
    toggleOptions(initialGroupChecked = false) {
      const checkedValue = initialGroupChecked || !this.value.checked;
      this.emitInput({
        ...this.value,
        checked: checkedValue,
        group: this.value.group.map((option) => {
          if (!option.disabled) {
            return { ...option, checked: checkedValue };
          }
          return option;
        }),
      });
    },
  },
  computed: {
    valueModel: {
      get() { return this.value; },
      set(value) {
        this.emitInput(value);
      },
    },
    hasCheckedOption() {
      return this.value.group.find((option) => option.checked);
    },
  },
};
</script>

<style lang="scss" scoped>
  .option {
    @apply w-full font-lato text-sm text-gray-500 px-4 py-3 outline-none cursor-pointer bg-white
    border-b border-gray-200;
    &:hover {
      @apply bg-gray-100;
    }
    &:focus,
    &:active {
      @apply bg-gray-100;
    }
    &--disabled {
      @apply opacity-50;
      &:hover,
      &:active,
      &:focus {
        @apply bg-white;
      }
    }
  }
</style>
