<template>
  <div ref="container">
    <ChecButton
      slot="reference"
      ref="button"
      variant="small"
      :icon="hasContent ? undefined : 'more'"
      :text-only="invert"
      v-bind="$attrs"
      @click.stop="toggleMenu"
    >
      <slot name="button-content" />
    </ChecButton>
    <ChecPopover
      target-ref="button"
      :open="isOpen"
      :name="menuName"
      :placement="menuPlacement"
      :popper-options="combinedPopperOptions"
    >
      <div ref="menu" class="options-menu" :class="menuClass">
        <!--
          @slot Provide ChecOption instances here
        -->
        <slot />
      </div>
    </ChecPopover>
  </div>
</template>

<script>
import ChecButton from './ChecButton.vue';
import ChecPopover from './ChecPopover.vue';

export default {
  name: 'ChecOptionsMenu',
  components: {
    ChecButton,
    ChecPopover,
  },
  inheritAttrs: false,
  props: {
    /**
     * Use a "text only" button instead to show white text on a transparent background
     */
    invert: Boolean,
    /**
     * Whether the menu should initially be open or not
     */
    open: Boolean,
    /**
     * Optional class (or classes) to give to the menu popover
     */
    menuClass: [String, Array, Object],
    /**
     * Describes the preferred placement of the options menu.
     */
    menuPlacement: {
      type: String,
      default: 'bottom-end',
      validate(placement) {
        return [
          'auto',
          'auto-start',
          'auto-end',
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'right',
          'right-start',
          'right-end',
          'left',
          'left-start',
          'left-end'].includes(placement);
      },
    },
    /**
     * Used with ChecPopover to prevent multiple options menu from rendering in the dom. This prop can be set to change
     * the identifier that's used to prevent more than one options menu from rendering
     */
    menuName: {
      type: String,
      default: 'chec-options-menu',
    },
    /**
     * Options to pass through to `popper.js`
     */
    popperOptions: {
      type: Object,
      default: () => ({}),
    },
    /**
     * Whether choosing an option in the menu should toggle the menu
     */
    preventToggle: Boolean,
  },
  data() {
    const offsetOption = { name: 'offset', options: { offset: [0, 8] } };
    const combinedPopperOptions = { ...this.popperOptions };

    if (combinedPopperOptions.modifiers) {
      combinedPopperOptions.modifiers = [offsetOption, ...combinedPopperOptions.modifiers];
    } else {
      combinedPopperOptions.modifiers = [offsetOption];
    }

    return {
      isOpen: this.open,
      // We set an offset for the popper to provide the designed spacing for the menu. This is 0.5rem (8px), but we
      // can't use "rem" with this option - it only supports pixels. We can't use margins on the menu itself, because
      // the margin depends on the position of the menu - right position requires left margin and bottom position
      // requires top margin etc.
      combinedPopperOptions,
    };
  },
  computed: {
    hasContent() {
      return Boolean(this.$slots['button-content']);
    },
  },
  created() {
    // add event listener to listen to outside click events
    window.addEventListener('click', this.onOutsideClick);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.onOutsideClick);
  },
  methods: {
    /**
     * Toggles the menu between open and closed
     */
    toggleMenu() {
      this.isOpen = !this.isOpen;
      this.$emit('click');
    },
    /**
     * A handler bound on the window while the component is mounted that closes the menu when clicked away
     *
     * @param {Event} event
     */
    onOutsideClick(event) {
      // Only do anything if the popover is open
      if (!this.isOpen) {
        return;
      }

      // Check that the button isn't being clicked
      if (this.$refs.container.contains(event.target)) {
        return;
      }

      // Check if an option in the menu is being clicked
      if (this.preventToggle && this.$refs.menu.contains(event.target)) {
        return;
      }

      this.isOpen = false;
    },
  },
};
</script>

<style lang="scss">
.options-menu {
  @apply bg-white border border-gray-300 rounded z-50 shadow-md;
  min-width: 10rem;
}
</style>
