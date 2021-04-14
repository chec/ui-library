<template>
  <div class="filter-bar-dropdown-panel">
    <template v-for="{ name, type, values } in filters">
      <h4
        v-if="type === 'header'"
        :key="name"
        class="filter-bar-dropdown-panel__header"
      >
        {{ name }}
      </h4>
      <div
        v-else-if="type === 'boolean'"
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
      <div
        v-else-if="type === 'option'"
        :key="name"
        class="filter-bar-dropdown-panel__filter"
      >
        <!-- Note that we make it required so that an empty option is not available -->
        <ChecDropdown
          :options="prepareOptions(values)"
          :value="choice(name) || ''"
          :label="name"
          required
          @input="(value) => choose(name, value)"
        />
      </div>
      <div
        v-else-if="type === 'date-range'"
        :key="name"
        class="filter-bar-dropdown-panel__filter filter-bar-date-range"
      >
        <label class="filter-bar-date-range__label">
          {{ name }}
        </label>
        <div class="filter-bar-date-range__dates">
          <div>
            <ChecDatepicker
              :label="$t('filters.startDate')"
              :value="choice(name).start || null"
              @input="(date) => setDate('start', name, date)"
            />
          </div>
          <div class="filter-bar-date-range__divider">
            &mdash;
          </div>
          <div>
            <ChecDatepicker
              :label="$t('filters.endDate')"
              :value="choice(name).end || null"
              @input="(date) => setDate('end', name, date)"
            />
          </div>
        </div>
      </div>
    </template>
    <slot name="filters" />
    <div class="filter-bar-dropdown-panel__actions">
      <ChecButton color="primary" text-only @click="() => $emit('close')">
        {{ $t('general.cancel') }}
      </ChecButton>
      <ChecButton color="primary" @click="submitChoice">
        {{ $t('filters.apply') }}
      </ChecButton>
    </div>
  </div>
</template>

<script>
import ChecSwitch from '@/components/ChecSwitch';
import ChecButton from '@/components/ChecButton';
import ChecDropdown from '@/components/ChecDropdown';
import ChecDatepicker from '@/components/ChecDatepicker';

export default {
  name: 'FilterPanel',
  components: {
    ChecDatepicker,
    ChecDropdown,
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
      const choice = this.choices[filter];

      if (choice) {
        return choice;
      }

      const { type } = this.filters.find((candidate) => candidate.name === filter);

      /* eslint-disable vue/script-indent */
      switch (type) {
        case 'date-range':
          return {
            start: null,
            end: null,
          };
        case 'option':
          return '';
        default:
          return null;
      }
      /* eslint-enable vue/script-indent */
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
    generateDateLabel(start, end) {
      if (start && end) {
        return this.$t('filters.betweenDate', { start, end });
      }

      if (start) {
        return this.$t('filters.afterDate', { date: start });
      }

      return this.$t('filters.beforeDate', { date: end });
    },
    prepareOptions(options) {
      return options.map((value) => {
        if (typeof value === 'string') {
          return {
            value,
            label: value,
          };
        }

        return value;
      });
    },
    setDate(key, filterName, date) {
      const existingValue = this.choice(filterName);
      this.choose(filterName, {
        ...existingValue,
        [key]: date,
      });
    },
    submitChoice() {
      // Parse the map of filter names to choices into the object style filter that the parent component expects. We
      // also need to filter out "blank" options, where the value matches the default
      this.$emit('change-filters', Object.entries(this.choices).reduce((choices, [filterName, value]) => {
        const filter = this.filters.find(({ name }) => filterName === name);
        const result = {
          filter: filterName,
        };

        if (filter.id) {
          result.id = filter.id;
        }

        // This shouldn't happen but it doesn't hurt to be safe
        if (!filter) {
          return choices;
        }

        // Ignore choices where the choice is the same as the default
        if (filter.defaultValue !== undefined && value === filter.defaultValue) {
          return choices;
        }

        // For booleans, we only apply filters if the value is true
        if (!value || (typeof value === 'string' && value.length === 0)) {
          return choices;
        }

        // Also for booleans, we relabel a truthy value to a custom string or "yes"
        if (filter.type === 'boolean') {
          return [...choices, {
            filter: filterName,
            value: filter.displayValue || this.$t('general.yes'),
          }];
        }

        // Generate a label for date range filters
        if (filter.type === 'date-range') {
          const { start, end } = value;

          return [...choices, {
            ...result,
            value,
            label: this.generateDateLabel(start, end),
          }];
        }

        // Support display labels
        if (filter.values) {
          const values = this.prepareOptions(filter.values);

          return [...choices, {
            ...result,
            ...(values.find((candidate) => candidate.value === value)),
          }];
        }

        return [...choices, {
          ...result,
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
  @apply bg-white border border-gray-200 shadow-sm rounded mt-2 w-full px-4 bg-gray-100 py-2;

  // A reasonable min width loosely based on Figma designs
  min-width: 20rem;

  &__header {
    &:not(:first-child) {
      @apply pt-6;
    }

    @apply caps-xxs;
  }

  &__filter {
    @apply py-2;
  }

  &__switch-filter {
    @apply flex justify-between items-center caps-xxs;
  }

  &__actions {
    @apply pt-6 pb-2 flex justify-between;
  }
}

.filter-bar-date-range {
  @apply pt-1;

  &__dates {
    @apply flex items-center mt-2;
  }

  &__label {
    @apply caps-xxs;
  }

  &__divider {
    @apply mx-2;
  }
}
</style>
