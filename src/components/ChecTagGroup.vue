<template>
  <div class="chec-tag-group">
    <slot />

    <ChecButton
      v-if="!hideReset"
      color="primary"
      variant="tag"
      @click="handleReset"
    >
      {{ resetText || $t('tag.reset') }}
    </ChecButton>
  </div>
</template>

<script>
import ChecButton from './ChecButton';

export default {
  name: 'ChecTagGroup',
  components: {
    ChecButton,
  },
  props: {
    /**
     * Whether to hide the "Reset" button on the right hand side of the tag list
     */
    hideReset: Boolean,
    resetText: String,
  },
  methods: {
    handleReset() {
      this.$emit('reset');
    },
  },
};
</script>

<style lang="scss">
.chec-tag-group {
  @apply flex flex-wrap items-center;

  .chec-tag:not(:last-child) {
    @apply mr-2;
  }

  .chec-tag {
    @apply mb-2 inline-block;
  }

  .button {
    @apply mb-2 inline-flex;
  }
}
</style>
