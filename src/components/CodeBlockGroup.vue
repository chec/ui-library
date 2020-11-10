<template>
  <div class="code-example-group">
    <div class="code-example-group__tabs">
      <ChecTab
        v-for="(tab, index) in tabs"
        :key="index"
        :dark="true"
        :active="activeBlock === index"
        @click="activeBlock = index"
      >
        {{ tab }}
      </ChecTab>
    </div>
    <ActiveTab :vnode="activeVnode" />
  </div>
</template>

<script>
import ChecTab from './ChecTab';

export default {
  name: 'CodeBlockGroup',
  components: {
    ChecTab,
    // Allows us to render a single vnode from the slot programatically.
    ActiveTab: {
      functional: true,
      render: (h, ctx) => ctx.props.vnode,
    },
  },
  data() {
    return {
      activeBlock: 0,
    };
  },
  computed: {
    tabs() {
      // Creates a list of titles based on the slot vnodes
      const groups = this.$slots.default.filter((slot) => typeof slot.data !== 'undefined')
        .map(slot => slot.data.attrs.title);
      return groups;
    },
    /**
     * Return the vnode based on the selected tab.
     */
    activeVnode() {
      return this.$slots.default.filter((slot) => typeof slot.data !== 'undefined')[this.activeBlock];
    },
  },
  watch: {
    activeBlock() {
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss">
.code-example-group {
  @apply relative;

  &__tabs {
    @apply absolute m-6 rounded overflow-hidden inline-block shadow-sm;
  }

  .code-example {
    @apply pt-20;
  }
}
</style>
