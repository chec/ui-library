<template>
  <div class="alert" :class="classObject">
    <div class="alert__content-container">
      <p class="alert__tag">tag</p>
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
  props: ['alertText', 'tagText', 'variant'],
  computed: {
    classObject: function () {
      return {
        'alert--success': this.variant === 'success',
        'alert--error': this.variant === 'error',
        'alert--warning': this.variant === 'warning',
        'alert--info': this.variant === 'info'
      }
    }
  },
  methods: {
    onClose() {
      this.$emit('close-alert')
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
    @apply mr-4 py-1 px-3 bg-primary-blue rounded-full text-xs text-white capitalize;
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
