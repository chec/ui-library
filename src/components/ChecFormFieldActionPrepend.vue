<template>
  <div class="form-field-action-prepend">
    <component
      :is="hasClickEvent ? 'a' : 'span'"
      v-tooltip="tooltip"
      @click="onActionClick"
    >
      {{ label }}
      <transition name="fade">
        <ChecIcon v-if="tooltip" icon="question-mark-square" size="xs" />
      </transition>
    </component>
  </div>
</template>

<script>
import ChecIcon from '@/components/ChecIcon.vue';

export default {
  name: 'ChecFormFieldExtend',
  components: { ChecIcon },
  props: {
    /**
     * Text for extend label
     */
    label: {
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
      this.$emit('action-click', e, this.value);
    },
  },
};
</script>

<style lang="scss">
.form-field-action-prepend {
  @apply relative;
  top: -2px;

  a,
  span {
    @apply caps-xxs text-gray-500 mt-1;
  }

  a {
    @apply text-blue-500 cursor-pointer;
  }

  svg {
    @apply relative inline;
    top: -1px; //Line height override for icon.
  }
}

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-500 ease-in-out;
}

.fade-enter,
.fade-leave-to {
  @apply opacity-0;
}
</style>
