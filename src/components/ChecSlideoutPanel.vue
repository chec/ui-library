<template>
  <transition
    appear
    name="panel"
    :duration="500"
  >
    <div class="slideout-panel">
      <Overlay
        :overlay="overlay"
        @close="onOverlayDismiss"
      />
      <Panel
        v-if="panelOpen"
        tabindex="0"
        :title="title"
        :title-tag="titleTag"
        :size="size"
        :depth="depth"
        @close="emitClose"
        @keydown.esc="emitClose"
      >
        <slot />
        <template #toolbar>
          <slot name="toolbar" />
        </template>
      </Panel>
    </div>
  </transition>
</template>

<script>
import Panel from './ChecSlideoutPanel/Panel';
import Overlay from './ChecSlideoutPanel/Overlay';

// Declaring panels as an external variable to reference
// the shared component -> `ChecSlideoutPanel`
// This allows us to tack on a `depth` property to determine
// the depth of each component being added
// See `depth` data property and `mounted/beforeDestroy` hook below
const panels = [];

export default {
  name: 'ChecSlideoutPanel',
  components: {
    Panel,
    Overlay,
  },
  props: {
    /**
     * The size of the panel width. Custom tailwind viewport widths
     * 50 is 50 viewport width, 33 is 33.333333 viewport width,
     * 75 is 75 viewport width, screen is 100 viewport width
     */
    size: {
      type: String,
      default: '50',
    },
    /**
     * The title of the panel slideout in the header
     */
    title: String,
    /**
     * The HTML tag to use for the title of the panel header
     */
    titleTag: {
      type: String,
      default: () => 'h2',
    },
    /**
     * The overlay backdrop when the panel is opened. One of "light" and "dark".
     */
    overlay: {
      type: String,
      default: 'light',
      validator(value) {
        return ['light', 'dark'].includes(value);
      },
    },
    /**
     * Whether to close panel on overlay click. If not included, defaults to false.
     */
    closeOnOverlayClick: Boolean,
  },
  data() {
    return {
      panelOpen: true,
      // eslint-disable-next-line vue/no-unused-properties
      depth: 0,
    };
  },
  mounted() {
    // Check that there are panel components
    // Add depth property value by 1 for each panel
    if (panels.length) {
      panels.forEach((panel) => {
        // eslint-disable-next-line no-param-reassign
        panel.depth += 1;
      });
    }
    // Push a new panel component to the panels array
    panels.push(this);

    // Overflow hidden on body when panel is opened
    document.body.style.overflow = 'hidden';
  },
  beforeDestroy() {
    // Delete component from the panels array
    panels.splice(-1, 1);
  },
  destroyed() {
    document.body.style.overflow = 'initial';
  },
  created() {
    const onEscape = (e) => {
      if (this.panelOpen && e.keyCode === 27) {
        this.emitClose('close');
      }
    };
    document.addEventListener('keydown', onEscape);
    this.$once('hook:destroyed', () => {
      document.removeEventListener('keydown', onEscape);
    });
    // After a button click is tracked, shift focus away from
    // clicks open the panel. Generally not advisable to force
    // focus from buttons unless there is a modal or
    // that opens as a result of a button click
    document.addEventListener('click', () => {
      if (document.activeElement.toString() === '[object HTMLButtonElement]') {
        document.activeElement.blur();
      }
    });
  },
  methods: {
    emitAction() {
      /**
       * Emitted when the user presses the action button (if configured)
       *
       * @event action
       */
      this.$emit('action');
    },
    emitClose($event) {
      /**
       * Emitted when the close icon is clicked
       * @event close
       * @type {$event}
       */
      this.$emit('close', $event);
    },
    onOverlayDismiss() {
      if (this.closeOnOverlayClick) {
        this.emitClose('close');
      }
    },
  },
};
</script>

<style lang="scss">
.slideout-panel {
  @apply block flow-root transition duration-150 transition-opacity;
}

.panel-enter,
.panel-leave-to {
  .slideout-panel__overlay {
    @apply opacity-0;
  }

  .slideout-panel__element {
    @apply transform translate-x-full;
  }
}

.panel-enter-to,
.panel-leave {
  .slideout-panel__overlay {
    @apply opacity-100;
  }

  .slideout-panel__element {
    @apply transform translate-x-0;
  }
}

.panel-leave-active {
  .slideout-panel__overlay {
    @apply transition delay-400;
  }
}
</style>
