<template>
  <div
    class="form-field"
    :class="classNames"
  >
    <div class="relative">
      <slot />
      <div v-if="icon" class="form-field__icon">
        <ChecIcon :icon="icon" size="base" />
      </div>
    </div>
    <ChecFormFieldActionAppend
      :label="appendLabel"
      :tooltip="tooltip"
      :clickable="hasClickEvent"
      @append-click="onActionClick"
    />
  </div>
</template>

<script>
import ChecFormFieldActionAppend from '@/components/ChecFormFieldActionAppend.vue';
import ChecIcon from '@/components/ChecIcon.vue';

export default {
  name: 'ChecFormField',
  components: {
    ChecFormFieldActionAppend,
    ChecIcon,
  },
  props: {
    /**
     * The name of the icon to show on the left before the label. (Use a slot for an icon on the right side)
     */
    icon: {
      type: String,
      default: null,
    },
    /**
     * Text for extend label
     */
    appendLabel: {
      type: String,
      default: '',
    },
    /**
     * Tooltip Text
     */
    tooltip: {
      type: String,
      default: '',
    },
  },
  computed: {
    classNames() {
      return {
        'form-field--has-icon': Boolean(this.icon),
      };
    },
    hasClickEvent() {
      /**
       * Returns true if an action-click listener is present.
       */
      return this.$listeners
        && typeof (this.$listeners['action-click']) !== 'undefined';
    },
  },
  methods: {
    onActionClick(e) {
      /**
       * Emitted when action button is clicked
       * @event click
       * @type {e}
       */
      this.$emit('action-click', e);
    },
  },
};
</script>

<style lang="scss">
.form-field {
  @apply relative;

  &__icon {
    @apply absolute flex top-0 ml-4 h-full items-center text-gray-400;
    // Offset for the inputs border:
    left: 1px;
  }
}

.form-field--has-icon {
  .text-field__label {
    left: 1.5rem;
  }

  .dropdown__label {
    @apply ml-12;
  }

  .text-field__input {
    @apply pl-10;
  }

  .dropdown {
    padding-left: 2.75rem;
  }
}
</style>
