<template>
  <transition
    appear
    name="panel"
    :duration="500"
  >
    <div class="slideout-panel">
      <Overlay
        v-if="renderOverlay"
        :overlay="overlay"
        :close-on-overlay-click="closeOnOverlayClick"
        @close="emitClose"
      />
      <Panel
        v-if="panelOpen"
        :title="title"
        :title-tag="titleTag"
        :width="width"
        :size="size"
        :depth="depth"
        @close="emitClose"
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

const panels = [];

export default {
  name: 'ChecSlideoutPanel',
  components: {
    Panel,
    Overlay,
  },
  props: {
    /**
     * The size of the panel width. One of "half", "third", "threeQuarters", "full".
     */
    size: {
      type: String,
      default: 'half',
    },
    /**
     * The title of the panel slideout in the header
     */
    title: {
      type: String,
      required: true,
    },
    /**
     * The HTML tag to use for the title of the panel header
     */
    titleTag: {
      type: String,
      default: () => 'h2',
    },
    /**
     * Controls the max width of the content in the panel. Use one of the tailwind sizes, e.g. md, xl, 2xl.
     */
    width: {
      type: String,
      default: '2xl',
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
     * Whether to close panel on overlay click. Default is true.
     */
    closeOnOverlayClick: Boolean,
  },
  data() {
    return {
      panelOpen: true,
      renderOverlay: true,
      // eslint-disable-next-line vue/no-unused-properties
      depth: 0,
    };
  },
  mounted() {
    if (panels.length) {
      this.renderOverlay = false;
      panels.forEach((panel) => {
        // eslint-disable-next-line no-param-reassign
        panel.depth += 1;
      });
    }
    panels.push(this);
    console.log('Added', panels);
  },
  beforeDestroy() {
    panels.splice(-1, 1);
    console.log(panels);
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
        this.$emit('close');
      }
    },
  },
};
</script>

<style lang="scss">
.slideout-panel {
  @apply block flow-root;
  transition: opacity 0.15s;
}

.panel-enter,
.panel-leave-to {
  .slideout-panel__overlay {
    opacity: 0;
  }

  .slideout-panel__element {
    transform: translateX(100%);
  }
}

.panel-enter-to,
.panel-leave {
  .slideout-panel__overlay {
    opacity: 1;
  }

  .slideout-panel__element {
    transform: translateX(0);
  }
}

.panel-leave-active {
  .slideout-panel__overlay {
    transition-delay: 400ms;
  }
}
</style>
