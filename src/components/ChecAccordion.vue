<template>
  <div
    ref="accordion"
    class="accordion"
    :class="{'accordion--active': isOpen}"
  >
    <div class="accordion__heading">
      <div>
        <div class="accordion__title" v-html="title" />
        <div v-if="subtitle" class="accordion__subtitle" v-html="subtitle" />
      </div>
      <ChecSwitch
        v-if="variant === 'switch'"
        v-model="isOpen"
        prefix-label
      >
        {{ resolvedButtonLabel }}
      </ChecSwitch>
      <div
        v-else
        class="accordion__toggle"
        :title="resolvedButtonLabel"
        @click="isOpen = !isOpen"
      >
        <ChecIcon icon="down" />
      </div>
    </div>
    <div class="accordion__body-container">
      <div class="accordion__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import ChecIcon from './ChecIcon.vue';
import ChecSwitch from './ChecSwitch.vue';

export default {
  name: 'ChecAccordion',
  components: {
    ChecIcon,
    ChecSwitch,
  },
  props: {
    /**
    * The accordion's title.
    */
    title: {
      type: String,
      default: '',
    },
    /**
    * The accordion's subtitle.
    */
    subtitle: {
      type: String,
      default: '',
    },
    /**
    * Set the accordion to open on load. Default: False.
    */
    open: Boolean,
    /**
     * The "variant" for the toggle of the accordion
     */
    variant: {
      type: String,
      validate: (variant) => ['switch', 'button'].includes(variant),
      default: () => 'button',
    },
    /**
     * The label to show
     */
    buttonLabel: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isOpen: this.open,
    };
  },
  computed: {
    resolvedButtonLabel() {
      return this.buttonLabel || (this.variant === 'switch'
        ? this.$t('accordion.switchLabel')
        : this.$t('accordion.toggleLabel')
      );
    },
  },
};
</script>

<style lang="scss">
.accordion {
  @apply rounded bg-gray-100;

  &__heading {
    @apply text-gray-500 flex justify-between items-center p-4 pb-0;
  }

  &__title {
    @apply font-bold text-sm;
  }

  &__subtitle {
    @apply text-xs mt-2;
  }

  &__toggle {
    @apply rounded p-2 bg-white h-8 w-8 cursor-pointer;

    svg {
      @apply transition-transform duration-200;
    }
  }

  &__body-container {
    @apply max-h-0 overflow-hidden mb-4;

    transition: max-height 700ms cubic-bezier(0, 1, 0, 1),
      margin-bottom 100ms linear 200ms;
  }

  &__body {
    @apply p-4 pb-0;

    transition: padding-bottom 100ms linear 200ms;
  }

  &--active {
    .accordion__body-container {
      @apply max-h-full-px mb-0;

      transition: max-height 1200ms cubic-bezier(1, 0, 0, 1);
    }

    .accordion__body {
      @apply pb-4;
    }

    .accordion__toggle svg {
      @apply transform -rotate-180;
    }
  }
}
</style>
