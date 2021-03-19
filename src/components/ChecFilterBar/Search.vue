<template>
  <ChecFormField
    class="filter-bar-search"
    icon="search"
  >
    <TextField
      ref="input"
      v-model="searchModel"
      :placeholder="$t('general.search')"
      @focus="focused = true"
      @blur="focused = false"
      @keyup.down.prevent="moveHighlight(highlightedOption + 1)"
      @keyup.up.prevent="moveHighlight(highlightedOption - 1)"
      @keydown.enter="chooseAutocomplete"
    />
    <ChecPopover
      v-if="$refs.input"
      :target-ref="$refs.input"
      :open="search.length > 0 && autocompleteOptions.length > 0 && focused"
      placement="bottom-start"
    >
      <div
        class="filter-bar-autocomplete"
        :style="{ width: autocompleteWidth }"
        @mousedown="chooseAutocomplete"
      >
        <div
          v-for="({ filter, value }, index) in autocompleteOptions"
          :key="index"
          class="filter-bar-autocomplete__option"
          :class="{ 'filter-bar-autocomplete__option--highlighted': highlightedOption === index }"
          @mouseover="moveHighlight(index)"
        >
          <strong class="filter-bar-autocomplete__option-filter">{{ filter }}:</strong> {{ value }}
        </div>
      </div>
    </ChecPopover>
  </ChecFormField>
</template>

<script>
import TextField from '@/components/TextField';
import ChecFormField from '@/components/ChecFormField';
import ChecPopover from '@/components/ChecPopover';

export default {
  name: 'Search',
  components: {
    ChecFormField,
    ChecPopover,
    TextField,
  },
  props: {
    filters: {
      type: Array,
      required: true,
    },
    search: {
      type: String,
      required: true,
    },
    disableTextSearch: Boolean,
    textSearchLabel: String,
  },
  data() {
    return {
      highlightedOption: 0,
      focused: false,
    };
  },
  computed: {
    autocompleteWidth() {
      if (!this.$refs.input) {
        return 0;
      }

      return `${this.$refs.input.$el.offsetWidth}px`;
    },
    autocompleteOptions() {
      return (this.disableTextSearch ? [] : [
        {
          filter: this.textSearchLabel || this.$t('filters.textSearch'),
          value: this.search,
        },
      ])
        // Add on any filters that match the search term
        .concat(this.filters.reduce((options, { name, values }) => {
          const regex = new RegExp(this.search, 'i');
          const matchedValues = values.filter((candidate) => candidate.match(regex));

          if (matchedValues.length === 0) {
            return options;
          }

          return [
            ...options,
            ...matchedValues.map((value) => ({
              filter: name,
              value,
            })),
          ];
        }, []));
    },
    searchModel: {
      get() {
        return this.search;
      },
      set(value) {
        return this.$emit('search', value);
      },
    },
  },
  watch: {
    // Move the highlighted option into view if it's currently on the index of an item that's out of bounds
    autocompleteOptions(newValue) {
      if (newValue.length < this.highlightedOption + 1) {
        this.highlightedOption = newValue.length - 1;
      }
    },
  },
  methods: {
    moveHighlight(index) {
      if (index < 0 || index > this.autocompleteOptions.length - 1) {
        return;
      }
      this.highlightedOption = index;
    },
    chooseAutocomplete(event) {
      // The first option is always a generic text search. We'll just emit an event to indicate the search should start
      if (!this.disableTextSearch && this.highlightedOption === 0) {
        this.$emit('do-search');
        // Remove focus on the search bar
        this.$refs.input.$el.blur();
        return;
      }

      // Keep focus on the input
      this.$refs.input.$el.focus();

      // Otherwise, cancel the event (if it's a keyboard event)
      if (event instanceof KeyboardEvent) {
        event.preventDefault();
      }

      // Choose the filter option and clear out the text field
      const option = this.autocompleteOptions[this.highlightedOption];

      // I think this can happen if you're racing against Vue's render cycles.
      if (!option) {
        return;
      }

      this.$emit('add-filter', option);
      this.searchModel = '';
      this.highlightedOption = 0;
    },
  },
};
</script>

<style lang="scss">
.filter-bar-search {
  @apply flex-1;
}

// This isn't extracted into it's own component as the keyboard events on the input affect this component
.filter-bar-autocomplete {
  @apply bg-white border border-gray-200 shadow-sm rounded mt-2 max-w-full;

  &__option {
    @apply w-full p-4 flex items-center text-sm text-gray-600 cursor-pointer;

    &--highlighted {
      @apply bg-gray-200;
    }
  }

  &__option-filter {
    @apply caps-xxs mr-2;
  }
}
</style>
