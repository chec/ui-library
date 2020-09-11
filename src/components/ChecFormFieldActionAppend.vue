<template>
  <div class="form-field-action-append">
    <component
      :is="clickable ? 'a' : 'span'"
      v-tooltip="tooltip"
      :class="[ clickable ? 'form-field-action-append__action' : 'form-field-action-append__helper' ]"
      @click="$emit('append-click')"
    >
      {{ label }}
      <transition name="fade">
        <ChecIcon
          v-if="tooltip"
          icon="question-mark-square"
          size="xs"
          class="form-field-action-append__icon"
        />
      </transition>
    </component>
  </div>
</template>

<script>
import ChecIcon from '@/components/ChecIcon.vue';

export default {
  name: 'ChecFormFieldAppend',
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
    /**
     * Has a click event.
     */
    clickable: Boolean,
  },
};
</script>

<style lang="scss">
.form-field-action-append {
  @apply relative text-right;
  top: -2px;

  &__action,
  &__helper {
    @apply caps-xxs text-gray-500 mt-1;
  }

  &__action {
    @apply text-blue-500 cursor-pointer;
  }

  &__icon {
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
