<template>
  <fieldset class="chec-radio-group">
    <component
      :is="labelTag"
      v-if="groupLabel"
      class="chec-radio-group__label"
      :class="labelFont"
    >
      {{ groupLabel }}
      <span
        v-if="required"
        class="chec-radio-group__required-text"
      >
        {{ $t('general.requiredInline') }}
      </span>
    </component>
    <div :class="classObject">
      <ChecRadio
        v-for="option in resolvedOptions"
        :key="option.id"
        :name="name"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
        :radio="option.required"
        :selected="value"
        :required="required"
        @input="() => $emit('input', option.value)"
      />
    </div>
  </fieldset>
</template>

<script>
import _uniqueId from 'lodash.uniqueid';
import ChecRadio from './ChecRadio.vue';

export default {
  name: 'ChecRadioGroup',
  components: {
    ChecRadio,
  },
  props: {
    /**
     * The radio options in the radio group
     */
    options: {
      type: Array,
      default: () => [],
    },
    /**
     * Sets the label for the input option
     */
    groupLabel: {
      type: String,
      default: '',
    },
    labelTag: {
      type: String,
      default: () => 'legend',
    },
    /**
     * Determine whether the radio group requires a selected value
     */
    required: Boolean,
    /**
     * Determines whether the radio button group is in 'block' or 'flex' display mode
     */
    layout: {
      type: String,
      default: () => 'block',
    },
    /**
     * The name of the radio group that gets pass down to each radio button input
     */
    name: {
      type: String,
      default: () => _uniqueId('chec-radio-group'),
    },
    /**
     * The value of the radio button group
     */
    value: {
      type: String,
      required: true,
    },
    /**
     * The font size of the label. Choose from one of tailwind font sizes: caps-xs, text-xs, text-sm
     */
    labelFont: {
      type: String,
      default: () => 'caps-xs',
    },
  },
  computed: {
    resolvedOptions() {
      return this.options.map((option) => (typeof option === 'string'
        ? {
          label: option,
          value: option,
          name: option.name,
          checked: option.checked,
          disabled: option.disabled,
        }
        : option));
    },
    classObject() {
      return ['chec-radio-group__list', {
        'chec-radio-group__list--block': this.layout === 'block',
        'chec-radio-group__list--flex': this.layout === 'flex',
      }];
    },
  },
};
</script>

<style lang="scss">
.chec-radio-group {
  &__list {
    @apply inline-block;

    &--block {
      @apply inline-block;

      .chec-radio {
        &:not(:last-child) {
          @apply pb-2;
        }
      }
    }

    &--flex {
      @apply flex;

      .chec-radio {
        &:not(:last-child) {
          @apply pr-5;
        }
      }
    }
  }

  &__label {
    @apply pb-2;
  }

  &__required-text {
    @apply text-gray-400;
  }
}

</style>
