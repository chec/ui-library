<template>
  <div
    ref="accordion"
    class="accordion"
    :class="{'active': isOpen}"
    >
    <div class="accordion__heading">
      <div>
        <div class="accordion__title" v-html="title"></div>
        <div class="accordion__subtitle" v-html="subtitle"></div>
      </div>
      <div class="accordion__toggle" @click="isOpen = !isOpen">
        <ChecIcon :icon="isOpen ? 'down' : 'right'" />
      </div>
    </div>
    <div class="accordion__body">
      <slot />
    </div>
  </div>
</template>
<script>
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecAccordion',
  components: {
    ChecIcon,
  },
  data() {
    return {
      isOpen: this.open,
    };
  },
  props: {
    /**
    * The accordion's title.
    */
    title: {
      type: String,
      default: '',
    },
    /**
    * The accordion's subtitle.
    */
    subtitle: {
      type: String,
      default: '',
    },
    /**
    * Set the accordion to open on load. Default: False.
    */
    open: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss">
  .accordion{
    @apply rounded mb-2 bg-gray-100 p-4;
    &__heading{
      @apply text-gray-500 flex justify-between items-center;
    }
    &__title{
      @apply font-bold text-sm;
    }
    &__subtitle{
      @apply text-xs;
    }
    &__toggle{
      @apply rounded p-2 bg-white h-8 w-8 cursor-pointer;
    }
    &__body{
      @apply pt-0 max-h-0 overflow-hidden;
        transition: max-height 500ms cubic-bezier(0, 1, 0, 1), padding 200ms linear;
    }
    &.active{
      .accordion__body{
        @apply pt-4 max-h-full-px ;
        transition: max-height 1500ms cubic-bezier(1, 0, 0, 1), padding 200ms linear;
      }
    }
  }
</style>
