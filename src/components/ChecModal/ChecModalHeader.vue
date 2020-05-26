<template>
    <div class="chec-modal-header">
      <component :is="tag">
        <!--
        @slot The title of the header
        -->
        <slot />
      </component>
      <BaseButton variant="small" class="chec-modal-header__dismiss-button" @click="emitClose">
        <template v-slot:icon><ChecIcon icon="close" /></template>
      </BaseButton>
    </div>
</template>

<script>
import BaseButton from '../BaseButton.vue';
import ChecIcon from '../ChecIcon.vue';

export default {
  name: 'ChecModalHeader',
  components: { ChecIcon, BaseButton },
  props: {
    /**
     * The tag to use for the tag that wraps the header
     */
    tag: {
      type: String,
      default: 'h2',
    },
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
  @apply flex justify-between text-gray-500 font-lato;

  margin-bottom: 2.375rem;
}
</style>
