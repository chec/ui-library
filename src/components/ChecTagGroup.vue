<template>
  <div class="tag-group">
    <slot />

    <ChecButton
      v-if="!hideReset"
      color="primary"
      variant="round"
      @click="handleReset"
    >
      {{ $t('tag.reset') }}
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
  },
  methods: {
    handleReset() {
      this.$emit('reset');
    },
  },
};
</script>

<style lang="scss">
.tag-group {
  @apply flex flex-wrap items-center;

  .tag:not(:last-child) {
    @apply mr-2;
  }

  .tag {
    @apply mb-2 inline-block;
  }

  .button {
    @apply mb-2 inline-flex;
  }
}
</style>
