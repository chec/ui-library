<template>
  <div class="modal-overlay">
    <ChecCard class="modal-card" :class="`max-w-${width}`">
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
  props: {
    /**
     * Controls the max width of the modal. Use one of the tailwind sizes, e.g. md, xl, 2xl.
     */
    width: {
      type: String,
      default: '2xl',
    },
  },
};
</script>
<style scoped lang="scss">
.modal-overlay {
  @apply fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center;
  // Special / overlay
  background-color: rgba(65, 85, 108, 0.9);
}

.modal-card {
  @apply w-full;
}
</style>
