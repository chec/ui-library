<template>
  <transition
    name="slide"
    mode="out-in"
  >
    <div
      class="slideout-panel__element"
      :class="classNames"
    >
      <div class="slideout-panel__header">
        <component :is="titleTag" v-if="title" class="slideout-panel__title">
          {{ title }}
        </component>
        <ChecButton
          class="slide-panel__close"
          color="secondary"
          variant="small"
          @click="emitClose"
        >
          <template #icon>
            <ChecIcon icon="close" />
          </template>
        </ChecButton>
      </div>
      <div class="slideout-panel__content" :class="`max-w-${width}`">
        <!--
          @slot Panel content
        -->
        <slot />
      </div>
      <div v-if="$slots.toolbar" class="slideout-panel__footer">
        <!--
          @slot Toolbar actions, buttons, etc
        -->
        <slot name="toolbar" />
      </div>
    </div>
  </transition>
</template>

<script>
import ChecButton from '../ChecButton.vue';
import ChecIcon from '../ChecIcon';

export default {
  name: 'Panel',
  components: {
    ChecButton,
    ChecIcon,
  },
  props: {
    /**
     * The size of the panel width. One of "half", "third", "threeQuarters", "full".
     */
    size: {
      type: String,
      default: 'half',
    },
    /**
     * The title of the panel slideout in the header
     */
    title: {
      type: String,
      required: true,
    },
    /**
     * The HTML tag to use for the title of the panel header
     */
    titleTag: {
      type: String,
      default: () => 'h2',
    },
    /**
     * Controls the max width of the content in the panel. Use one of the tailwind sizes, e.g. md, xl, 2xl.
     */
    width: {
      type: String,
      default: '2xl',
    },
    depth: Number,
  },
  computed: {
    classNames() {
      const { size } = this;
      const { depth } = this;
      return {
        [`slideout-panel__element--size-${size}`]: size !== '',
        [`slideout-panel__element--depth-${depth}`]: depth !== '',
      };
    },
  },
  methods: {
    emitClose($event) {
      /**
       * Emitted when the close icon is clicked
       * @event close
       * @type {$event}
       */
      this.$emit('close', $event);
    },
  },
};
</script>

<style lang="scss">
.slideout-panel {
  &__wrapper {
    @apply static;
  }

  &__element {
    @apply
      top-0 shadow-holo-light bg-gray-100 h-full flex flex-col fixed right-0 overflow-y-auto transition-transform;
    transition-duration: 0.6s;
    width: 100vw;
    z-index: 1000;

    @screen sm {
      &--size-half {
        width: 50vw // Panel width is half of viewport
      }

      &--size-third {
        width: 33.33%; // Fallback for non-supported browsers
        width: calc(100% / 3); // Panel width is 1/3 of viewport
      }

      &--size-threeQuarters {
        width: 75vw;
      }

      &--size-full {
        width: 100vw;
      }
    }

    &--depth-1 {
      right: 2.5rem;
    }

    &--depth-2 {
      right: 5rem;
    }

    &--depth-3 {
      right: 7.5rem;
    }

    &--depth-3 {
      right: 10rem;
    }
  }

  &__header {
    @apply flex justify-between bg-white shadow-sm px-6 py-5;
  }

  &__title {
    @apply font-bold text-gray-600;
  }

  &__content {
    @apply p-6;
  }

  &__footer {
    @apply flex justify-between bg-white px-6 py-5 mt-auto;
  }
}
</style>
