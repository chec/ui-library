<template>
  <div class="update-group">
    <ChecDivider class="update-group__divider">
      {{ updateDate }}
    </ChecDivider>
    <div class="update-section">
      <div v-for="(update, key) in updates" :key="key" class="update">
        <ChecDataPill :color="pillColor(update)" class="update__pill">
          {{ update.type }}
        </ChecDataPill>
        <p>
          {{ update.details }}
          <a
            v-if="update.moreInfoLink"
            class="update__link"
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
import ChecDivider from './ChecDivider.vue';

export default {
  name: 'ChangeLog',
  components: {
    ChecDivider,
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
  methods: {
    pillColor(update) {
      return ({
        new: 'green',
        news: 'gray',
        updated: 'orange',
      })[update.variant];
    },
  },
};
</script>

<style lang="scss">
.update-group {
  @apply mb-8 w-full;

  &__divider {
    @apply mb-2;
  }
}

.update-section {
  @apply bg-white rounded-md shadow;
}

.update {
  @apply py-4 px-6;

  &__link {
    @apply text-blue-600;
  }

  &__pill {
    @apply inline-block mb-1;
  }

  &:not(:last-child) {
    @apply border-b border-gray-300;
  }
}
</style>
