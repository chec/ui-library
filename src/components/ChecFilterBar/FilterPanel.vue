<template>
  <div class="filter-bar-dropdown-panel">
    <template v-for="{ name, type } in filters">
      <div
        v-if="type === 'boolean'"
        :key="name"
        class="filter-bar-dropdown-panel__filter filter-bar-dropdown-panel__switch-filter"
      >
        <label :for="`filter-${name}`">{{ name }}</label>
        <ChecSwitch
          :id="`filter-${name}`"
          :toggled="!!choice(name)"
          @input="(value) => choose(name, value)"
        />
      </div>
    </template>
    <div class="filter-bar-dropdown-panel__actions">
      <ChecButton variant="round" color="green" @click="submitChoice">
        {{ $t('filters.apply') }}
      </ChecButton>
    </div>
  </div>
</template>

<script>
import ChecSwitch from '@/components/ChecSwitch';
import ChecButton from '@/components/ChecButton';

export default {
  name: 'FilterPanel',
  components: {
    ChecButton,
    ChecSwitch,
  },
  props: {
    filters: Array,
    activeFilters: Array,
  },
  data() {
    return {
      newChoices: [],
    };
  },
  computed: {
    choices() {
      // Use a combination of new choices, active filters, and available filters to create a map for all possible
      // choices. This reducer uses the new choices as an initial value
      return this.filters.reduce((choices, { name, defaultValue = null }) => {
        // Try to see if there's a choice for this filter already, either part of this component or the parent
        const active = this.newChoices.find(({ filter }) => filter === name)
          || this.activeFilters.find(({ filter }) => filter === name);
        if (active) {
          return {
            ...choices,
            [name]: active.value,
          };
        }

        return {
          ...choices,
          [name]: defaultValue,
        };
      }, {});
    },
  },
  methods: {
    choice(filter) {
      return this.choices[filter] || null;
    },
    choose(filter, value) {
      // Remove the existing choice
      const existingIndex = this.newChoices.findIndex(({ filter: name }) => name === filter);
      if (existingIndex >= 0) {
        this.newChoices.splice(existingIndex, 1);
      }

      // Add the new one
      this.newChoices.push({ filter, value });
    },
    submitChoice() {
      // Parse the map of filter names to choices into the object style filter that the parent component expects. We
      // also need to filter out "blank" options, where the value matches the default
      this.$emit('change-filters', Object.entries(this.choices).reduce((choices, [filterName, value]) => {
        const filter = this.filters.find(({ name }) => filterName === name);

        // This shouldn't happen but it doesn't hurt to be safe
        if (!filter) {
          return choices;
        }

        // Ignore choices where the choice is the same as the default
        if (filter.defaultValue !== undefined && value === filter.defaultValue) {
          return choices;
        }

        // For booleans, we only apply filters if the value is true
        if (filter.type === 'boolean' && !value) {
          return choices;
        }

        // Also for booleans, we relabel a truthy value to a custom string or "yes"
        if (filter.type === 'boolean') {
          return [...choices, {
            filter: filterName,
            value: filter.displayValue || this.$t('general.yes'),
          }];
        }

        return [...choices, {
          filter: filterName,
          value,
        }];
      }, []));

      this.newChoices = [];
    },
  },
};
</script>

<style lang="scss">
.filter-bar-dropdown-panel {
  @apply bg-white border border-gray-200 shadow-sm rounded mt-2 w-full px-4 pb-4;

  // A reasonable min width loosely based on Figma designs
  min-width: 20rem;

  &__filter {
    @apply py-4 caps-xxs;

    & + & {
      @apply border-t border-gray-300;
    }
  }

  &__switch-filter {
    @apply flex justify-between items-center;
  }

  &__actions {
    @apply pt-2 flex justify-end;
  }
}
</style>
