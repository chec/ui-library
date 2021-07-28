<template>
  <div
    role="dialog"
    aria-modal="true"
    class="slideout-panel__element"
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
      w-screen;

    // The designed maximum width for panels
    max-width: 1040px;
  }

  &__header {
    @apply flex bg-white shadow-sm px-6 border-b-2 border-gray-100;
    min-height: 6rem;
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
    @apply p-6 overflow-auto;
  }

  &__footer {
    @apply bg-white px-6 mt-auto flex shadow-sm border-t-2 border-gray-100;
    min-height: 6rem;
  }

  &__footer-inner {
    @apply flex justify-between items-center w-full;
  }
}
</style>
