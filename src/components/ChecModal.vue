<template>
  <div class="modal-overlay" @click.self="emitOverlayClick">
    <ChecCard class="modal-card" :class="`max-w-${width}`" tailwind="bg-gray-100">
      <slot />
    </ChecCard>
  </div>
</template>
<script>
import ChecCard from './ChecCard.vue';

export default {
  name: 'ChecModal',
  components: {
    ChecCard,
  },
  mounted() {
    document.body.style.overflow = 'hidden';
  },
  destroyed() {
    document.body.style.overflow = 'initial';
  },
  props: {
    /**
     * Controls the max width of the modal. Use one of the tailwind sizes, e.g. md, xl, 2xl.
     */
    width: {
      type: String,
      default: '2xl',
    },
  },
  methods: {
    /**
     * Emitted when the modal's background overlay is click.
     * @event overlay-click
     */
    emitOverlayClick() {
      this.$emit('overlay-click');
    },
  },
};
</script>
<style scoped lang="scss">
.modal-overlay {
  @apply fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center overflow-scroll;
  // Special / overlay
  background-color: rgba(65, 85, 108, 0.9);
}

.modal-card {
  @apply w-full;
}
</style>
