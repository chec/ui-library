<template>
  <component
    :is="form ? 'form' : 'div'"
    :class="`modal__overlay modal__overlay--${overlay}`"
  >
    <ChecCard class="modal__card" tailwind="bg-gray-100" :class="`max-w-${width}`">
      <ChecModalHeader v-if="header" :undismissible="undismissible" @close="emitClose">
        {{ header }}
      </ChecModalHeader>
      <!--
        @slot Modal content
      -->
      <slot />
      <div v-if="$slots.toolbar" class="modal__toolbar">
        <!--
          @slot Toolbar actions, buttons, etc
        -->
        <slot name="toolbar" />
      </div>
    </ChecCard>
  </component>
</template>

<script>
import ChecCard from './ChecCard.vue';
import ChecModalHeader from './ChecModal/ChecModalHeader.vue';

export default {
  name: 'ChecModal',
  components: {
    ChecCard,
    ChecModalHeader,
  },
  props: {
    /**
     * Sets a <form> element as the root
     */
    form: Boolean,
    /**
     * Controls the max width of the modal. Use one of the tailwind sizes, e.g. md, xl, 2xl.
     */
    width: {
      type: String,
      default: '2xl',
    },
    /**
     * Optionally include a modal header by providing a title for the modal. This adds a close button too
     */
    header: String,
    /**
     * Prevent the close button from rendering when using the "header" prop
     */
    undismissible: Boolean,
    overlay: {
      type: String,
      default: 'light',
      validator(value) {
        return ['light', 'dark'].includes(value);
      },
    },
  },
  mounted() {
    document.body.style.overflow = 'hidden';
  },
  destroyed() {
    document.body.style.overflow = 'initial';
  },
  methods: {
    /**
     * Emitted when the modal's background overlay is click.
     * @event dismiss
     */
    emitClose() {
      if (!this.undismissible) {
        this.$emit('dismiss');
      }
    },
  },
};
</script>

<style lang="scss">
.modal {
  &__overlay {
    @apply fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center overflow-scroll;
    // Special / overlay
    background-color: rgba(255, 255, 255, 0.95);

    &--dark {
      // Special / overlay
      background-color: rgba(65, 85, 108, 0.9);
    }
  }

  &__card {
    @apply w-full shadow-holo-light p-1 text-gray-600;

    p {
      @apply text-sm leading-5 mb-2;

      &:last-child {
        @apply mb-0;
      }
    }

    .loading {
      @apply rounded-lg;
    }
  }

  &__toolbar {
    @apply flex justify-between mt-8 clear-both;
  }
}
</style>
