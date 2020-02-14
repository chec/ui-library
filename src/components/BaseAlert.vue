<template>
  <div class="alert" :class="classObject">
    <div class="alert__content-container">
      <BaseTag v-if="tagText" :variant="variant">
        {{tagText}}
      </BaseTag>
      <slot>
        <p v-if="alertText" class="alert__text">
          {{alertText}}
        </p>
      </slot>
    </div>
    <div class="alert__close-icon">
      <SvgCloseIcon @click="onClose" />
    </div>
  </div>
</template>
<script>
import SvgCloseIcon from '../assets/svgs/close-icon.svg';
import BaseTag from './BaseTag.vue';

export default {
  name: 'BaseAlert',
  components: {
    BaseTag,
    SvgCloseIcon,
  },
  props: {
    /**
     * The text to alert.
     */
    alertText: {
      type: String,
      required: true,
    },
    /**
     * The text for the tag.
     */
    tagText: {
      type: String,
    },
    /**
     * The style variant for the alert. One of "default", "success", "error", "warning", "info". Default is "default"
     */
    variant: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'success', 'error', 'warning', 'info'].includes(value);
      },
    },
  },
  computed: {
    classObject() {
      return this.variant !== 'default' && `alert--${this.variant}`;
    },
  },
  methods: {
    onClose($event) {
      /**
       * Emitted when the 'close' icon is clicked.
       * @event close-alert
       * @type {$event}
       */
      this.$emit('close-alert', $event);
    },
  },
};
</script>
<style lang="scss" scoped>
.alert {
  @apply flex font-lato justify-between items-center bg-gray-200 rounded-md p-4;
  &__content-container {
    @apply flex items-center;
  }
  &__text {
    @apply font-bold text-primary-blue text-sm;
  }
  &__close-icon {
    @apply h-4 w-4 fill-current text-primary-blue cursor-pointer;
  }
  &--success {
    @apply bg-green-100;
    .alert__text {
      @apply text-green-600;
    }
  }
  &--error {
    @apply bg-red-100;
    .alert__text {
      @apply text-red-600;
    }
  }
  &--warning {
    @apply bg-orange-100;
    .alert__text {
      @apply text-orange-600;
    }
  }
  &--info {
    @apply bg-purple-100;
    .alert__text {
      @apply text-purple-600;
    }
  }
}
</style>
