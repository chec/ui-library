<template>
  <div
    role="dialog"
    aria-modal="true"
    class="slideout-panel__element"
    :class="[classNames, `sm:w-${size}`]"
    :style="{ right: `${depth * 2}rem` }"
  >
    <div class="slideout-panel__header">
      <div class="slideout-panel__header-inner">
        <component :is="titleTag" v-if="title" class="slideout-panel__title">
          {{ title }}
        </component>
        <ChecButton
          tabindex="0"
          class="slideout-panel__close"
          color="secondary"
          variant="small"
          @click="emitClose"
          @keydown.esc="emitClose"
        >
          <template #icon>
            <ChecIcon icon="close" />
          </template>
        </ChecButton>
      </div>
    </div>
    <div class="slideout-panel__content">
      <!--
        @slot Panel content
      -->
      <slot />
    </div>
    <div v-if="$slots.toolbar" class="slideout-panel__footer">
      <div class="slideout-panel__footer-inner">
        <!--
          @slot Toolbar actions, buttons, etc
        -->
        <slot name="toolbar" />
      </div>
    </div>
  </div>
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
     * The size of the panel width. Use one of the tailwind sizes, eg.
     * 1/2 is 50% of viewport, 1/3 is 33.33333% of viewport,
     * 3/4 is 75% of viewport, screen is 100% of viewport
     */
    size: {
      type: String,
      default: '1/2',
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
    depth: Number,
  },
  computed: {
    classNames() {
      const { depth } = this;
      return {
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
      top-0
      shadow-holo-light
      bg-gray-100
      h-full
      flex
      flex-col
      fixed
      right-0
      overflow-y-auto
      duration-500
      z-100
      w-screen;

    @screen sm {
      min-width: 600px; // Set min width when viewport larger than 640px
    }
  }

  &__header {
    @apply flex bg-white shadow-sm px-6 h-24;
  }

  &__header-inner {
    @apply justify-between items-center w-full flex;
  }

  &__title {
    @apply font-bold text-gray-600;
  }

  &__close {
    &:only-child {
      @apply ml-auto;
    }
  }

  &__content {
    @apply p-6;
  }

  &__footer {
    @apply bg-white px-6 mt-auto h-24 flex;
  }

  &__footer-inner {
    @apply flex justify-between items-center w-full;
  }
}
</style>