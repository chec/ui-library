<template>
  <div
    v-if="activeFilters.length > 0 || activeSearch.length > 0"
    class="filter-bar-filter-list"
  >
    <span class="filter-bar-filter-list__label">
      {{ $t('filters.filters') }}
    </span>
    <ChecTagGroup
      :reset-text="$t('filters.clear')"
      @reset="clearFilters"
    >
      <ChecTag
        v-if="activeSearch.length > 0"
        color="white"
        @dismiss="$emit('clear-search')"
      >
        {{ textSearchLabel || $t('filters.textSearch') }}: {{ activeSearch }}
      </ChecTag>
      <ChecTag
        v-for="({ filter, value, label }, index) in activeFilters"
        :key="`${filter}-${value}`"
        color="white"
        @dismiss="removeFilter(index)"
      >
        {{ filter }}: {{ label || value }}
      </ChecTag>
    </ChecTagGroup>
  </div>
</template>

<script>
import ChecTagGroup from '@/components/ChecTagGroup';
import ChecTag from '@/components/ChecTag';

export default {
  name: 'FilterList',
  components: {
    ChecTag,
    ChecTagGroup,
  },
  props: {
    activeFilters: {
      type: Array,
      required: true,
    },
    activeSearch: {
      type: String,
      default: '',
    },
    textSearchLabel: String,
  },
  methods: {
    setFilters(filters) {
      this.$emit('change-filters', filters);
    },
    clearFilters() {
      this.setFilters([]);
      this.$emit('clear-search');
    },
    removeFilter(index) {
      const filters = [...this.activeFilters];
      filters.splice(index, 1);
      this.$emit('change-filters', filters);
    },
  },
};
</script>

<style lang="scss">
.filter-bar-filter-list {
  @apply flex-none mt-4 flex items-baseline;

  // Force the tags to take up all of a new row
  flex-basis: 100%;

  &__label {
    @apply caps-xxs mr-4 text-gray-400;
  }
}
</style>
