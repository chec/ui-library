<template>
  <div class="chec-paginate">
    <div class="chec-page-selector">
      <button title="Go to the first page" class="chec-page-selector__control" @click="choosePage('first')"
               :disabled="page === 1"
      >
        <ChecIcon icon="double-left" />
      </button>
      <button title="Go to the previous page" class="chec-page-selector__control"
               @click="choosePage('previous')" :disabled="page === 1"
      >
        <ChecIcon icon="left" />
      </button>
      <span class="chec-page-selector__page-reference">{{ page }} of {{ pageCount }}</span>
      <button title="Go to the next page" class="chec-page-selector__control" @click="choosePage('next')"
               :disabled="page === pageCount"
      >
        <ChecIcon icon="right" />
      </button>
      <button title="Go to the last page" class="chec-page-selector__control" @click="choosePage('last')"
               :disabled="page === pageCount"
      >
        <ChecIcon icon="double-right" />
      </button>
    </div>
    <div class="chec-per-page-control" v-show="limitOptions.length > 1">
      <span class="chec-per-page-control__label">Showing</span>
      <button class="chec-per-page-control__option" v-for="option in limitOptions" :key="option"
              :title="`Show ${option} items per page`" @click="choosePageSize(option)"
              :class="{'chec-per-page-control__option--active': option === pageSize}"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script>
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecPaginate',
  components: { ChecIcon },
  props: {
    /**
     * Currently selected page
     */
    page: {
      type: Number,
      default: 1,
    },

    /**
     * Currently selected page size
     */
    pageSize: {
      type: Number,
      default: 15,
    },

    /**
     * The number of records that the pagination should page through
     */
    count: {
      type: Number,
    },

    /**
     * A list of page size options to provide.
     */
    pageSizeOptions: {
      type: Array,
      validate: options => options.every(option => typeof option === 'number'),
      default: () => [15, 30, 50, 100],
    },
  },
  mounted() {
    // Ensure the initial page size is valid. This is here as the validity relies on a different prop
    if (!this.pageSizeOptions.includes(this.pageSize)) {
      this.emitChoosePageSize(this.pageSizeOptions[0]);
    }
  },
  computed: {
    limitOptions() {
      // Find the options that are less than the total count, and also the first option that's more
      const firstLargerIndex = this.pageSizeOptions.findIndex(option => option >= this.count);
      if (firstLargerIndex < 0) {
        return this.pageSizeOptions;
      }
      return this.pageSizeOptions.slice(0, firstLargerIndex + 1);
    },
    pageCount() {
      return Math.ceil(this.count / this.pageSize);
    },
  },
  methods: {
    choosePage(action) {
      if (action === 'first') {
        this.emitChoosePage(1);
        return;
      }
      if (action === 'last') {
        this.emitChoosePage(this.pageCount);
        return;
      }
      const delta = action === 'next' ? 1 : -1;
      const newPage = this.page + delta;

      if (newPage < 0 || newPage > this.pageCount) {
        return;
      }

      this.emitChoosePage(newPage);
    },
    choosePageSize(newSize) {
      const { count, page, pageSize: oldSize } = this;
      const newPageCount = Math.ceil(count / newSize);

      // Try to keep showing the user relevant records
      const priorLowestIndex = oldSize * (page - 1) + 1;
      const pageWithOldIndex = Math.ceil(priorLowestIndex / newSize) || 1;
      if (pageWithOldIndex !== page) {
        this.emitChoosePageSize(newSize, pageWithOldIndex);
        return;
      }

      if (page > newPageCount) {
        this.emitChoosePageSize(newSize, newPageCount);
        return;
      }

      this.emitChoosePageSize(newSize);
    },
    emitChoosePage(page) {
      /**
      * Emitted when a page is selected.
      * @event choose-page
      * @type {String}
      * @property {String} - page - the page number that is requested
      */
      this.$emit('choose-page', page);
    },
    emitChoosePageSize(size, newPage = null) {
      /**
       * Emitted when a page is selected.
       * @event choose-page-size
       * @type {String}
       * @property {String} - limit - the size of the page that is requested
       */
      this.$emit('choose-page-size', { size, page: newPage || this.page });
    },
  },
};
</script>
<style lang="scss">
%active-control {
  &:enabled {
    @apply bg-gray-400 outline-none;
    &:hover {
      @apply bg-gray-600;
    }
  }
  &:disabled {
    @apply bg-gray-500;
  }
}

%control-shared {
  @apply bg-gray-500 rounded p-1 mr-1 ml-0;
  &:hover {
    &:enabled {
      @apply bg-gray-600;
      .chec-tab__text {
        @apply text-white;
      }
    }
  }
  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
  &:active, &:focus {
    @extend %active-control;
  }
}

%control-group {
  @apply rounded-md bg-gray-500 p-2 text-sm uppercase text-white tracking-widest font-bold;
}

.chec-paginate {
  @apply flex w-full justify-between flex-row-reverse;
}

.chec-per-page-control {
  @extend %control-group;
  @apply leading-tight text-xxs py-2 px-3;
  &__label {
    @apply text-xxs mr-3;
  }

  &__option {
    @extend %control-shared;
    @apply text-xs font-bold;

    &--active {
      @extend %active-control;
    }
  }
}

.chec-page-selector {
  @extend %control-group;

  &__control {
    @extend %control-shared;
    svg {
      @apply w-3 h-3;
    }
    &--active {
      @extend %active-control;
    }
  }

  &__page-reference {
    @apply leading-relaxed text-xxs mx-3 align-text-top;
  }
}
</style>
