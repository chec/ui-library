<template>
  <div class="segmented-btns-group">
    <ChecSegmentedButton
      v-for="{ label, value: optionValue } in resolvedOptions"
      :key="optionValue"
      :ref="`button${optionValue}`"
      :value="optionValue"
      :active="isActive(optionValue)"
      :disabled="disabled"
      @click="handleClick"
      @move-next="handleNext"
      @move-prev="handlePrev"
    >
      {{ label }}
    </ChecSegmentedButton>
  </div>
</template>

<script>
import ChecSegmentedButton from './ChecSegmentedButton.vue';

export default {
  name: 'ChecSegmentedButtonsGroup',
  components: {
    ChecSegmentedButton,
  },
  props: {
    /**
     * An array of options - just labels or objects with keys for `value` and `label`
     */
    options: {
      type: Array,
      required: true,
    },
    /**
     * v-model binding for the currently selected option. With options passed as objects, this will be the `value` key.
     */
    value: {
      type: [String, Number],
      required: true,
    },
    disabled: Boolean,
  },
  computed: {
    resolvedOptions() {
      return this.options.map((option) => (typeof option === 'string' ? { label: option, value: option } : option));
    },
  },
  methods: {
    isActive(value) {
      return this.value === value;
    },
    handleClick(value) {
      this.setValue(value);
    },
    handleNext(value) {
      const index = this.findOptionIndex(value);

      if (index === this.options.length - 1) {
        this.setValue(this.resolvedOptions[0].value);
        return;
      }
      this.setValue(this.resolvedOptions[index + 1].value);
    },
    handlePrev(value) {
      const index = this.findOptionIndex(value);

      if (index === this.options.length - 1) {
        this.setValue(this.resolvedOptions[0].value);
        return;
      }
      this.setValue(this.resolvedOptions[index + 1].value);
    },
    findOptionIndex(value) {
      return this.resolvedOptions.findIndex(candidate => candidate.value === value);
    },
    setValue(value) {
      this.$refs[`button${value}`][0].$el.focus();
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss">
.segmented-btns-group {
  @apply flex cursor-pointer overflow-hidden;

  .segmented-btn {
    @apply rounded-none;
  }

  &:first-child {
    @apply rounded-l-sm;
  }

  &:last-child {
    @apply rounded-r-sm;
  }
}
</style>
