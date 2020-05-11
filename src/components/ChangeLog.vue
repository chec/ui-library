<template>
  <div class="update-group">
    <BaseDivider class="mb-2">{{ updateDate }}</BaseDivider>
    <div class="update-section">
      <div v-for="(update, key) in updates" :key="key" class="update">
        <ChecDataPill :variant="update.variant" class="inline-block mb-1">{{ update.type }}</ChecDataPill>
        <p>
          {{ update.details }}
          <a
            class="update__link"
            v-if="update.moreInfoLink"
            :href="update.moreInfoLink"
            target="_blank"
            rel="noopener nofollow"
          >
            Learn more.
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import ChecDataPill from './ChecDataPill.vue';
import BaseDivider from './BaseDivider.vue';

export default {
  name: 'Updates',
  components: {
    BaseDivider,
    ChecDataPill,
  },
  props: {
    /**
     * list of updates
     */
    updates: {
      type: Array,
      default: () => [],
    },
    /**
     * date of updates
     */
    updateDate: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.update-group {
  @apply mb-8 w-full;
}

.update-section {
  @apply bg-white rounded-md shadow;
}

.update {
  @apply py-4 px-6;

  &__link {
    @apply text-blue-600;
  }

  &:not(:last-child) {
    @apply border-b border-gray-300;
  }
}
</style>
