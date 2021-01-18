<template>
  <div class="chec-modal-header">
    <component :is="tag" class="chec-modal-header__text">
      <!--
        @slot The title of the header
      -->
      <slot />
    </component>
    <ChecButton
      v-if="!undismissible"
      variant="small"
      class="chec-modal-header__dismiss-button"
      @click="emitClose"
    >
      <template #icon>
        <ChecIcon icon="close" />
      </template>
    </ChecButton>
  </div>
</template>

<script>
import ChecButton from '../ChecButton.vue';
import ChecIcon from '../ChecIcon.vue';

export default {
  name: 'ChecModalHeader',
  components: { ChecIcon, ChecButton },
  props: {
    /**
     * The tag to use for the tag that wraps the header
     */
    tag: {
      type: String,
      default: 'h2',
    },
    undismissible: Boolean,
  },
  methods: {
    emitClose() {
      /**
       * Emitted when the close button is clicked
       * @event dismiss
       */
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
.chec-modal-header {
  @apply flex justify-between mb-8;

  &__text {
    @apply text-lg font-bold;
  }
}
</style>
