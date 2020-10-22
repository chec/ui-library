<template>
  <div class="chec-table" :class="classNames">
    <div v-if="$slots.prepend" class="chec-table__prepend">
      <div class="chec-table__inner-wrapper">
        <!--
          @slot Search, tags etc.
        -->
        <slot name="prepend" />
      </div>
    </div>
    <table class="table" :class="tableClass">
      <!--
        @slot Table content
      -->
      <slot />
    </table>
  </div>
</template>

<script>
export default {
  name: 'ChecTable',
  props: {
    /**
     * Class to pass to table
     */
    tableClass: {
      type: String,
      default: 'table-auto',
    },
  },
  computed: {
    classNames() {
      const classes = {
        'chec-table--prepended': !!this.$slots.prepend,
      };

      return classes;
    },
  },
};
</script>

<style lang="scss">
.chec-table {
  &__prepend {
    @apply relative px-4 rounded-t-md bg-gray-200;
    z-index: 1;
  }

  &__inner-wrapper {
    @apply bg-gray-200 py-4 border-b border-solid border-gray-300;
  }

  .table {
    @apply relative;
    z-index: 2;
  }

  &--prepended {
    @apply shadow rounded;

    .table {
      @apply shadow-none rounded-t-none;
    }
  }
}
</style>
