<template>
  <div class="alert" :class="classObject">
    <div class="alert__content-container">
      <p v-if="tagText" class="alert__tag">
        {{tagText}}
      </p>
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
import SvgCloseIcon from './../assets/svgs/close-icon.svg';
export default {
  name: 'TextField',
  components: {
    SvgCloseIcon
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
      required: true,
      default: 'default',
      validator: function (value) {
        return ['default', 'success', 'error', 'warning', 'info'].includes(value);
      }
    }
  },
  computed: {
    classObject() {
      return this.variant !== 'default' && `alert--${this.variant}`;
    }
  },
  methods: {
    onClose($event) {
      /**
       * Emitted when the 'close' icon is clicked.
       * @event close-alert
       * @type {$event}
       */
      this.$emit('close-alert', $event)
    }
  }
};
</script>
<style lang="scss" scoped>
.alert {
  @apply flex font-lato justify-between items-center bg-gray-200 rounded-md p-4;
  &__content-container {
    @apply flex items-center;
  }
  &__tag {
    @apply mr-4 py-1 px-3 bg-primary-blue rounded-full text-xs text-white;
  }
  &__text {
    @apply font-bold text-primary-blue text-sm;
  }
  &__close-icon {
    @apply h-4 w-4 fill-current text-primary-blue cursor-pointer;
  }
  &--success {
    @apply bg-green-100;
    .alert__tag {
      @apply bg-green-600;
    }
    .alert__text {
      @apply text-green-600;
    }
  }
  &--error {
    @apply bg-red-100;
    .alert__tag {
      @apply bg-red-600;
    }
    .alert__text {
      @apply text-red-600;
    }
  }
  &--warning {
    @apply bg-orange-100;
    .alert__tag {
      @apply bg-orange-600;
    }
    .alert__text {
      @apply text-orange-600;
    }
  }
  &--info {
    @apply bg-purple-100;
    .alert__tag {
      @apply bg-purple-600;
    }
    .alert__text {
      @apply text-purple-600;
    }
  }
}
</style>
