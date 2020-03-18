<template>
  <TabsGroup>
    <paginate @input="emitInput" v-bind="$props">
      <template v-for="pageNumber in pageCount" v-slot:[pageNumber]="{ page }">
        <BaseTab :active="page.selected" :disabled="page.disabled" :key="pageNumber">
          {{ page.content }}
        </BaseTab>
      </template>
      <template #prevContent>
        <BaseButton color="primary" class="next-prev-button">
          <template v-slot:icon>
            <ChecIcon icon="left"/>
          </template>
        </BaseButton>
      </template>
      <template #nextContent>
        <BaseButton color="primary" class="next-prev-button">
          <ChecIcon icon="right"/>
        </BaseButton>
      </template>
    </paginate>
  </TabsGroup>
</template>
<script>
import Paginate from '../lib/Paginate.vue';
import BaseTab from './BaseTab.vue';
import ChecIcon from './ChecIcon.vue';
import BaseButton from './BaseButton.vue';
import TabsGroup from './TabsGroup.vue';

export default {
  name: 'ChecPaginate',
  components: {
    Paginate,
    BaseTab,
    BaseButton,
    ChecIcon,
    TabsGroup,
  },
  props: {
    value: {
      type: Number,
    },
    pageCount: {
      type: Number,
      required: true,
    },
    forcePage: {
      type: Number,
    },
    clickHandler: {
      type: Function,
      default: () => { },
    },
    pageRange: {
      type: Number,
      default: 3,
    },
    marginPages: {
      type: Number,
      default: 1,
    },
    prevText: {
      type: String,
      default: 'Prev',
    },
    nextText: {
      type: String,
      default: 'Next',
    },
    breakViewText: {
      type: String,
      default: '…',
    },
    containerClass: {
      type: String,
      default: 'flex items-center justify-start flex-wrap',
    },
    pageClass: {
      type: String,
      default: 'px-1',
    },
    pageLinkClass: {
      type: String,
    },
    prevClass: {
      type: String,
      default: 'pr-1',
    },
    prevLinkClass: {
      type: String,
    },
    nextClass: {
      type: String,
      default: 'pl-1',
    },
    nextLinkClass: {
      type: String,
    },
    breakViewClass: {
      type: String,
      default: 'cursor-default text-white',
    },
    breakViewLinkClass: {
      type: String,
      default: 'outline-none',
    },
    activeClass: {
      type: String,
      default: 'active',
    },
    disabledClass: {
      type: String,
      default: 'disabled',
    },
    noLiSurround: {
      type: Boolean,
      default: false,
    },
    firstLastButton: {
      type: Boolean,
      default: false,
    },
    firstButtonText: {
      type: String,
      default: 'First',
    },
    lastButtonText: {
      type: String,
      default: 'Last',
    },
    hidePrevNext: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /**
     * Container for the input event
     *
     * @param {string} value
     */
    emitInput(value) {
      /**
      * Emitted when a page is selected.
      * @event input
      * @type {String}
      * @property {String} - key - the value of the page number
      */
      this.$emit('input', value);
    },
  },
};
</script>
<style scoped lang="scss">
.next-prev-button {
  @apply flex flex-col items-center justify-center w-8 h-8 shadow-none;
  svg {
    @apply w-xs h-xs mx-auto;
  }
}
</style>
