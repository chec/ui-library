<script>
export default {
  name: 'BaseButton',
  props: {
    /**
     * The type of button - eg. internal link (route). One of "link", "button", or "route".
     */
    type: {
      type: String,
      validate(type) {
        return ['link', 'button', 'submit', 'route'].includes(type);
      },
      default: 'button',
    },
    /**
     * A route or link to go to. Required if the type is not "button"
     */
    to: {
      type: String,
    },
    /**
     * The name of the colour variant to be used
     */
    colour: {
      type: String,
      validate(colour) {
        return ['primary', 'secondary'].includes(colour);
      },
      default: 'secondary',
    },
    /**
     * The style variant of the button. Includes size, border radius, etc.
     */
    variant: {
      type: String,
      validate(variant) {
        return ['large', 'small', 'round'].includes(variant);
      },
      default: 'small',
    },
    /**
     * Disables the button
     */
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classNames() {
      return [
        'button',
        `button--colour-${this.colour}`,
        `button--variant-${this.variant}`,
        { disabled: this.disabled },
      ];
    },
  },
  methods: {
    handleClick() {
      /**
       * Triggered on a click event on the button
       * @type {Event}
       */
      this.$emit('click');
    },
  },
  render(createElement) {
    const tag = this.type === 'link' ? 'a' : 'button';
    return createElement(tag, {
      class: this.classNames,
      domProps: {
        disabled: this.disabled,
      },
    }, this.$slots.default);
  },
};
</script>

<style lang="scss" scoped>
.button {
  @apply inline-block font-bold shadow-sm border cursor-pointer;
  &:focus {
    @apply outline-none;
  }
  &--variant {
    &-small {
      @apply py-3 px-4 rounded text-sm;
    }
    &-large {
      @apply py-4 px-8 rounded text-lg;
    }
    &-round {
      @apply py-2 px-4 rounded-full text-xs;
    }
  }
  &--colour {
    &-primary {
      @apply bg-primary-gradient border-0 text-white;
      &:hover {
        @apply bg-primary-blue;
        // Override the gradient background
        background-image: none;
      }
      &:active {
        @apply bg-dark-blue;
      }
    }
    &-secondary {
      @apply bg-white text-primary-blue border-gray-300;
      &:hover {
        @apply bg-gray-100 border-primary-blue;
      }
      &:active {
        @apply bg-gray-300;
      }
    }
  }
}
</style>
