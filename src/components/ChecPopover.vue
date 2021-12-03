<template>
  <component
    :is="mountingComponent"
    v-if="open"
    v-bind="mountingProps"
  >
    <div ref="popperRef" :class="classNames">
      <!--
        @slot Content to display in the popover
      -->
      <slot />
    </div>
  </component>
</template>

<script>
import { MountingPortal, Portal } from 'portal-vue';
import { createPopper } from '@popperjs/core';
import get from 'lodash.get';

export default {
  name: 'ChecPopover',
  components: {
    MountingPortal,
    Portal,
  },
  inheritAttrs: false,
  props: {
    /**
     * The ref within the current component to where the popover should be placed
     */
    targetRef: {
      type: [String, Object],
      required: true,
    },
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
    mount: {
      type: [Boolean, Object],
      default: false,
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
    mountingComponent() {
      if (!this.mount) {
        return 'div';
      }

      return this.mount.component || 'MountingPortal';
    },
    mountingProps() {
      const { component, ...props } = typeof this.mount === 'object' ? this.mount : {};

      if (this.mountingComponent === 'Portal') {
        return props;
      }

      if (this.mountingComponent === 'MountingPortal') {
        return {
          mountTo: 'body',
          append: true,
          ...props,
        };
      }

      return props;
    },
    targetEl() {
      const { targetRef } = this;
      let targetNode = targetRef;

      if (typeof targetRef === 'string') {
        targetNode = get(this.$parent.$refs, targetRef);
      }

      if (!targetNode) {
        // We couldn't find the target node from the given ref
        // TODO should this error?
        return null;
      }

      return Object.hasOwnProperty.call(targetNode, '$el') ? targetNode.$el : targetNode;
    },
  },
  watch: {
    open(open) {
      if (open) {
        this.$nextTick(this.createPopper);
        return;
      }

      this.$nextTick(this.destroyPopper);
    },
  },
  mounted() {
    if (this.open) {
      this.createPopper();
    }
  },
  methods: {
    createPopper() {
      if (!this.$refs.popperRef) {
        this.$nextTick(this.createPopper);
        return;
      }

      const { targetEl, placement, popperOptions } = this;

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
