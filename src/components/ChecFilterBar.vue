<template>
  <div class="filter-bar">
    <Search
      ref="search"
      :filters="searchableFilters"
      :search="search"
      :disable-text-search="disableTextSearch"
      :text-search-label="textSearchLabel"
      @add-filter="(filter) => addFilter(filter)"
      @search="setSearch"
      @do-search="doSearch"
    />
    <ChecButton
      v-if="panelFilters.length > 0"
      ref="button"
      class="filter-bar__panel-button"
      variant="input"
      icon="down"
      icon-position="after"
      @click="panelOpen = !panelOpen"
    >
      {{ $t('filters.filters') }}
    </ChecButton>
    <FilterList
      :active-filters="activeFilters"
      :active-search="activeSearch"
      :text-search-label="textSearchLabel"
      @change-filters="changeFilters"
      @clear-search="clearSearch"
    />
    <ChecPopover
      target-ref="button"
      :open="panelOpen"
      placement="bottom-end"
    >
      <FilterPanel
        ref="panel"
        :filters="panelFilters"
        :active-filters="panelActiveFilters"
        @change-filters="updatePanelFilters"
        @close="panelOpen = false"
      >
        <template #filters>
          <!--
            @slot Additional custom filters to display in the filter panel.
          -->
          <slot name="filters" />
        </template>
      </FilterPanel>
    </ChecPopover>
  </div>
</template>

<script>
import ChecButton from '@/components/ChecButton';
import ChecPopover from '@/components/ChecPopover';
import FilterPanel from '@/components/ChecFilterBar/FilterPanel';
import FilterList from '@/components/ChecFilterBar/FilterList';
import Search from '@/components/ChecFilterBar/Search';

export default {
  name: 'ChecFilterBar',
  components: {
    ChecButton,
    ChecPopover,
    FilterPanel,
    FilterList,
    Search,
  },
  model: {
    prop: 'search',
    event: 'set-search',
  },
  props: {
    /**
     * An array of available filters for the user to filter by. Check the storybook docs for more details
     */
    filters: {
      type: Array,
      required: true,
    },
    /**
     * The currently active filters chosen by the user
     */
    activeFilters: {
      type: Array,
      required: true,
    },
    /**
     * The current value of the search area of this component
     */
    search: {
      type: String,
      required: true,
    },
    /**
     * The currently active search, to be displayed as a filter
     */
    activeSearch: {
      type: String,
      default: '',
    },
    /**
     * Whether to allow a filter to be applied more than once. This option is only applicable to some filter types.
     */
    allowMultiple: Boolean,
    /**
     * Whether a simple "text search" option should be provided by the auto complete
     */
    disableTextSearch: Boolean,
    /**
     * A label to use as a prompt for "text search". Uses "Text search" by default
     */
    textSearchLabel: String,
  },
  data() {
    return {
      panelOpen: false,
    };
  },
  computed: {
    panelActiveFilters() {
      return this.activeFilters.filter(({ filter }) => this.panelFilters.find(({ name }) => name === filter));
    },
    panelFilters() {
      return this.filters.filter(({ type }) => [
        'boolean',
        'date-range',
        'header',
        'option',
      ].includes(type));
    },
    // Reduces the set of all filters down to a set that can be used with the search bar, removing those that should
    // appear in the filters dropdown, or those that are already in use
    searchableFilters() {
      // If we don't allow multiple of the same filter then this is just a simple "filter" operation
      if (!this.allowMultiple) {
        return this.filters.filter(({ name, type }) => (
          ['in'].includes(type)
          && !this.activeFilters.find(({ filter }) => filter === name)
        ));
      }

      // Otherwise we need to remove the values from the filters that have already been used
      return this.filters.reduce((filters, { name, values }) => {
        const matchedActiveFilters = this.activeFilters.filter(({ filter }) => filter === name);

        // If there aren't any active filters that match this option, then just let this option be added
        if (matchedActiveFilters.length === 0) {
          return [
            ...filters,
            { name, values },
          ];
        }

        // If there's an active filter for every possible option of the filter, then it's not valid
        if (matchedActiveFilters.length === values.length) {
          return filters;
        }

        // Filter down the list of values based on what's already been matched
        return [
          ...filters,
          {
            name,
            values: values.filter(
              // This value is not valid if it's used in any of the currently active filters
              (candidateValue) => !matchedActiveFilters.some(({ value }) => value === candidateValue),
            ),
          },
        ];
      }, []);
    },
  },
  mounted() {
    // Register a click handler to determine when panels lose focus
    if (window) {
      window.addEventListener('click', this.onWindowClick);
    }
  },
  beforeDestroy() {
    if (window) {
      window.removeEventListener('click', this.onWindowClick);
    }
  },
  methods: {
    addFilter(filter) {
      this.changeFilters([...this.activeFilters, filter]);
    },
    changeFilters(filters) {
      /**
       * Indicates that the user has requested the filters be changed
       */
      this.$emit('change-filters', filters);
    },
    clearSearch() {
      /**
       * Indicates that the user has requested the search (that has been performed) should be cleared
       */
      this.$emit('clear-search');
    },
    doSearch() {
      /**
       * Indicates that the user has requested a search should be performed with the current search term
       */
      this.$emit('search');

      // Blur the search field to hide the popover
      this.$refs.search.$el.querySelector('input').blur();
    },
    onWindowClick(event) {
      // Ignore the click if the panel doesn't exist or isn't open
      if (this.panelFilters.length === 0 || !this.panelOpen) {
        return;
      }

      // Ignore the click if the button is being clicked
      if (this.$refs.button && this.$refs.button.$el.contains(event.target)) {
        return;
      }

      // Ignore the click if the panel is being clicked
      if (this.$refs.panel && this.$refs.panel.$el.contains(event.target)) {
        return;
      }

      // Ignore clicks within another popover
      const classWhitelist = ['chec-popover', 'flatpickr-calendar'];
      if (event.path.some((element) => (
        element.classList instanceof DOMTokenList
        && classWhitelist.some((candidate) => element.classList.contains(candidate))
      ))) {
        return;
      }

      // Close the panel
      this.panelOpen = false;
    },
    setSearch(search) {
      /**
       * Updates the current search term
       */
      this.$emit('set-search', search);
    },
    /**
     * Removes existing filters that can be applied by the filter panel, and adds the new onces
     * @param {Array} filters
     */
    updatePanelFilters(filters) {
      this.changeFilters(
        this.activeFilters
          // Filter out active filters that appear in our new list
          .filter(({ filter }) => !this.panelFilters.find(({ name }) => filter === name))
          // Concatenate our new list of filters
          .concat(filters),
      );
      this.panelOpen = false;
    },
  },
};
</script>

<style lang="scss">
.filter-bar {
  @screen md {
    @apply flex justify-between flex-wrap items-center;
  }

  &__panel-button {
    @apply mt-4 w-full;

    @screen md {
      @apply ml-4 mt-0 w-auto;

      // Space out the button a little more as per designs
      min-width: 10rem;
    }
  }
}
</style>
