<template>
  <div class="chec-paginate">
    <TabsGroup class="chec-per-page-control">
      <span class="chec-per-page-control__label">Showing</span>
      <BaseTab class="chec-per-page-control__option" v-for="option in limitOptions" :key="option"
               @click="emitChoosePageSize(option)" :active="option === pageSize"
      >
        {{ option }}
      </BaseTab>
    </TabsGroup>
    <TabsGroup class="chec-page-selector">
      <BaseTab title="Go to the first page" class="chec-page-selector__control" @click="choosePage('first')">
        <ChecIcon icon="double-left" />
      </BaseTab>
      <BaseTab title="Go to the previous page" class="chec-page-selector__control" @click="choosePage('previous')">
        <ChecIcon icon="left" />
      </BaseTab>
      <span class="chec-page-selector__page-reference">{{ page }} of {{ pageCount }}</span>
      <BaseTab title="Go to the next page" class="chec-page-selector__control" @click="choosePage('next')">
        <ChecIcon icon="right" />
      </BaseTab>
      <BaseTab title="Go to the last page" class="chec-page-selector__control" @click="choosePage('last')">
        <ChecIcon icon="double-right" />
      </BaseTab>
    </TabsGroup>
  </div>
</template>

<script>
import TabsGroup from './TabsGroup.vue';
import BaseTab from './BaseTab.vue';
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecPaginate',
  components: { ChecIcon, BaseTab, TabsGroup },
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
      return this.pageSizeOptions.filter(option => option < this.count);
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
    emitChoosePage(page) {
      /**
      * Emitted when a page is selected.
      * @event choose-page
      * @type {String}
      * @property {String} - page - the page number that is requested
      */
      this.$emit('choose-page', page);
    },
    emitChoosePageSize(limit) {
      /**
       * Emitted when a page is selected.
       * @event choose-page-size
       * @type {String}
       * @property {String} - limit - the size of the page that is requested
       */
      this.$emit('choose-page-size', limit);
    },
  },
  watch: {
    /**
     * Watch for page size changes where the page number is made invalid
     */
    pageSize() {
      if (this.page > this.pageCount) {
        this.emitChoosePage(this.pageCount);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.chec-paginate {
  @apply flex w-full justify-between;
}

.chec-per-page-control {
  @apply leading-tight uppercase text-white text-xxs tracking-widest font-bold py-2 px-3;

  &__label {
    @apply text-xxs mr-3;
  }

  &__option {
    @apply text-xs font-bold p-1 mr-1 ml-0;
  }
}

.chec-page-selector {
  @apply uppercase text-white tracking-widest font-bold;

  &__control {
    @apply p-1 mr-1 ml-0;
    svg {
      @apply w-3 h-3;
    }
  }

  &__page-reference {
    @apply leading-relaxed text-xxs mx-3 align-text-top;
  }
}
</style>
