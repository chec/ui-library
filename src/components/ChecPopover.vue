<template>
  <MountingPortal :mount-to="mountTarget" :name="name" append>
    <div ref="popperRef" :class="classNames">
      <!--
        @slot Content to display in the popover
      -->
      <slot />
    </div>
  </MountingPortal>
</template>

<script>
import Vue from 'vue';
import { MountingPortal } from 'portal-vue';
import { createPopper } from '@popperjs/core';

export default {
  name: 'ChecPopover',
  components: {
    MountingPortal,
  },
  inheritAttrs: false,
  props: {
    /**
     * The ref within the current component to where the popover should be placed
     */
    targetRef: {
      type: String,
      required: true,
    },
    /**
     * Optionally mount the popover by appending it to the given selector. Defaults to appending it to the body
     */
    mountTarget: {
      type: String,
      default: 'body',
    },
    /**
     * If a name is given, existing popovers with the same name will be removed and replaced with this popover. This
     * is passed through to `vue-portal`'s `MountingPortal` component. You can read more in the docs for `vue-portal`
     */
    name: String,
    /**
     * Whether the popover is "open" (and shown)
     */
    open: {
      type: Boolean,
      required: true,
    },
    /**
     * The placement of this popover, relative to its target. The options available match the placement options with
     * popper.js
     */
    placement: {
      type: String,
      default: 'bottom',
    },
    /**
     * Options to pass through to `popper.js`
     */
    popperOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      popper: null,
    };
  },
  computed: {
    classNames() {
      return [
        'chec-popover',
        { 'chec-popover--open': this.open },
      ];
    },
  },
  watch: {
    open(open) {
      if (open) {
        this.$nextTick(() => this.createPopper());
        return;
      }

      this.$nextTick(() => this.destroyPopper());
    },
  },
  methods: {
    createPopper() {
      const { targetRef, placement, popperOptions } = this;
      const targetNode = this.$parent.$refs[targetRef];
      const targetEl = targetNode instanceof Vue ? targetNode.$el : targetNode;

      this.popper = createPopper(targetEl, this.$refs.popperRef, {
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['top-start', 'bottom-start'],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              rootBoundary: 'document',
              tether: false,
            },
          },
        ],
        ...popperOptions,
        placement,
      });
    },
    destroyPopper() {
      if (!this.popper) {
        return;
      }

      this.popper.destroy();
      this.popper = null;
    },
  },
};
</script>

<style lang="scss">
.chec-popover {
  @apply z-50 hidden;

  &--open {
    @apply block;
  }
}
</style>
