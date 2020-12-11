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
        @input="emitToggle"
      >
        {{ resolvedButtonLabel }}
      </ChecSwitch>
      <ChecButton
        v-else
        class="accordion__toggle"
        color="secondary"
        variant="small"
        :title="resolvedButtonLabel"
        @click="isOpen = !isOpen"
      >
        <template #icon>
          <ChecIcon icon="down" />
        </template>
      </ChecButton>
    </div>
    <div class="accordion__body-container" :style="bodyStyle">
      <div ref="body" class="accordion__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import ResizeObserver from 'resize-observer-polyfill';
import ChecButton from './ChecButton.vue';
import ChecIcon from './ChecIcon.vue';
import ChecSwitch from './ChecSwitch.vue';

export default {
  name: 'ChecAccordion',
  components: {
    ChecButton,
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
      contentHeight: 0,
      resizeObserver: null,
    };
  },
  computed: {
    bodyStyle() {
      if (!this.isOpen) {
        return {};
      }

      return {
        maxHeight: `${this.contentHeight}px`,
      };
    },
    resolvedButtonLabel() {
      if (this.buttonLabel) {
        return this.buttonLabel;
      }

      const type = this.variant === 'switch' ? 'switchLabel' : 'toggleLabel';
      const state = this.isOpen ? 'open' : 'closed';

      return this.$t(`accordion.${type}.${state}`);
    },
  },
  mounted() {
    this.contentHeight = this.$refs.body.clientHeight;

    const vm = this;
    this.resizeObserver = new ResizeObserver(() => {
      this.contentHeight = vm.$refs.body.clientHeight;
    });

    this.resizeObserver.observe(this.$refs.body);
  },
  beforeDestroy() {
    if (this.resizeObserver instanceof ResizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
  methods: {
    emitToggle() {
      /**
       * Emitted when the accordion is opened or closed. Emits the new state of the accordion - true if it is open
       *
       * @type {Boolean}
       */
      this.$emit('toggled', this.isOpen);
    },
  },
};
</script>

<style lang="scss">
.accordion {
  @apply bg-white rounded-md shadow-sm mb-2;

  // Ensure margins don't collapse when put into containers with padding:
  // https://medium.com/fed-or-dead/margin-collapse-or-why-your-child-element-is-moving-the-parent-b199a0b60497
  padding-bottom: 1px;

  &__heading {
    @apply text-gray-600 flex justify-between items-center p-4 pb-0;
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

    transition: max-height 300ms cubic-bezier(0, 1, 0, 1),
      margin-bottom 300ms cubic-bezier(0, 1, 0, 1);
  }

  &__body {
    @apply p-4;
  }

  &--active {
    .accordion__body-container {
      @apply mb-0;

      transition: max-height 300ms cubic-bezier(1, 0, 0, 1),
        margin-bottom 300ms cubic-bezier(1, 0, 0, 1);
    }

    .accordion__toggle svg {
      @apply transform -rotate-180;
    }
  }
}
</style>
