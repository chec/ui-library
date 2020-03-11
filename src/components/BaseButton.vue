<script>
export default {
  name: 'BaseButton',
  props: {
    /**
     * The type of HTML element tag to use as the button- eg. internal link (route). One of "link",
     * "button", or "route".
     */
    tagType: {
      type: String,
      validate(type) {
        return ['link', 'button', 'route'].includes(type);
      },
      default: 'button',
    },
    /**
     * The HTML `type` of button to use, when `tagType` is "button". If the `tagType` is not "button" then
     * `null` will be the `buttonType`.
     */
    buttonType: {
      type: String,
      validate(type) {
        return ['button', 'reset', 'submit'].includes(type);
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
     * The name of the color variant to be used. One of 'brand', 'primary', 'secondary', 'blue', 'green', or 'red'
     */
    color: {
      type: String,
      validate(color) {
        return [
          'brand',
          'primary',
          'secondary',
          'blue',
          'green',
          'red',
        ].includes(color);
      },
      default: 'secondary',
    },
    /**
     * The style variant of the button. Includes size, border radius, etc.
     */
    variant: {
      type: String,
      validate(variant) {
        return ['large', 'regular', 'small', 'round'].includes(variant);
      },
      default: 'regular',
    },
    /**
     * Indicates the position where an icon should show (if any)
     */
    iconPosition: {
      type: String,
      validate(position) {
        return ['before', 'after'].includes(position);
      },
      default: 'before',
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
        `button--color-${this.color}`,
        `button--variant-${this.variant}`,
        {
          disabled: this.disabled,
          'button--has-icon': this.hasIcon,
          [`button--has-icon-${this.iconPosition}`]: this.hasIcon,
        },
      ];
    },
    hasIcon() {
      return this.$slots.icon && Boolean(this.$slots.icon.length);
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
    const tag = this.tagType === 'link' ? 'a' : 'button';
    // Get the children. For an "icon" variant, if an icon slot is specified, use that instead of the default slot
    // Note that this would not be ideal usage. Just providing the icon to the default slot is preferred.
    const children = [createElement('span', { class: ['button__content'] }, this.$slots.default)];

    if (this.hasIcon) {
      const icon = createElement('i', { class: ['button__icon'] }, this.$slots.icon);
      if (this.iconPosition === 'before') {
        children.unshift(icon);
      } else {
        children.push(icon);
      }
    }

    return createElement(tag, {
      class: this.classNames,
      domProps: {
        disabled: this.disabled,
        type: this.tagType === 'button' ? this.buttonType : null,
      },
      on: {
        click: this.handleClick,
      },
    }, children);
  },
};
</script>

<style lang="scss">
.button {
  @apply font-bold shadow-sm border border-0 cursor-pointer flex justify-center;
  &:focus {
    @apply outline-none;
  }
  &__icon {
    @apply self-center;
  }

  &--has-icon-before {
    .button__content:not(:empty) {
      @apply ml-1;
    }
    &.button--variant-large .button__content:not(:empty) {
      @apply ml-2;
    }
  }

  &--has-icon-after {
    .button__content:not(:empty) {
      @apply mr-1;
    }
    &.button--variant-large .button__content:not(:empty) {
      @apply mr-2;
    }
  }

  &--variant {
    &-regular {
      @apply py-3 px-4 rounded text-sm leading-tight;
      & .button__icon {
        @apply w-sm;
      }
    }
    &-large {
      @apply py-4 px-8 rounded text-lg leading-tight;
      & .button__icon {
        @apply w-lg;
      }
    }
    &-small {
      @apply py-2 px-4 rounded text-sm leading-tight;
      & .button__icon {
        @apply w-sm;
      }
    }
    &-round {
      @apply py-2 px-4 rounded-full text-xs;
      & .button__content {
        @apply uppercase tracking-widest;
      }
      & .button__icon {
        @apply w-xs;
      }
    }
  }
  &--color {
    &-brand {
      @apply bg-primary-gradient text-white;
      &:hover {
        @apply bg-primary-blue;
        // Override the gradient background
        background-image: none;
      }
      &:active {
        @apply bg-dark-blue;
      }
    }
    &-primary {
      @apply bg-gray-600 text-white;
      &:hover {
        @apply bg-gray-500;
      }
      &:active {
        @apply bg-gray-400;
      }
    }
    &-secondary {
      @apply bg-white text-gray-500;
      &:hover {
        @apply bg-gray-100 border-primary-blue;
      }
      &:active {
        @apply bg-gray-300;
      }
    }
    &-blue {
      @apply bg-blue-500 text-white;
      &:hover {
        @apply bg-blue-400;
      }
      &:active {
        @apply bg-blue-600;
      }
    }
    &-green {
      @apply bg-green-500 text-white;
      &:hover {
        @apply bg-green-400;
      }
      &:active {
        @apply bg-green-600;
      }
    }
    &-red {
      @apply bg-red-500 text-white;
      &:hover {
        @apply bg-red-400;
      }
      &:active {
        @apply bg-red-600;
      }
    }
  }
}
</style>
