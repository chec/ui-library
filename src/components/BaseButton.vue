<script>
export default {
  name: 'BaseButton',
  props: {
    /**
     * The type of HTML element tag to use as the button. One of "link", or "button".
     */
    tagType: {
      type: String,
      validate(type) {
        return ['link', 'button'].includes(type);
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
     * A link to go to. Required if the type is not "button"
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
     * The style variant of the button. Includes size, border radius, etc. One of 'large', 'regular', 'small', 'round'
     */
    variant: {
      type: String,
      validate(variant) {
        return ['large', 'regular', 'small', 'round'].includes(variant);
      },
      default: 'regular',
    },
    /**
     * Indicates the position where an icon should show (if any). Defaults to 'before' but it is optional.
     * Accepts 'before' or 'after'.
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
          'button--disabled': this.disabled,
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
    handleClick(event) {
      /**
       * Triggered on a click event on the button
       * @type {Event}
       */
      this.$emit('click', event);
    },
  },
  render(createElement) {
    const tag = this.tagType === 'link' ? 'a' : 'button';
    // Get the children. For an "icon" variant, if an icon slot is specified, use that instead of the default slot
    // Note that this would not be ideal usage. Just providing the icon to the default slot is preferred.
    const children = [createElement('span', { class: ['button__content'] }, this.$slots.default)];

    if (this.hasIcon && this.$slots.icon) {
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
@use "sass:map";

.button {
  @apply font-bold shadow-sm border border-0 flex justify-center;
  &:focus {
    @apply outline-none;
  }
  &__icon {
    @apply w-base self-center;
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
      @apply py-4 px-4 rounded text-sm leading-tight;
    }
    &-large {
      @apply py-4 px-8 rounded text-lg leading-tight;
    }
    &-small {
      @apply p-2 rounded text-sm leading-tight shadow-none;
    }
    &-round {
      @apply py-2 px-4 rounded-full;
      & .button__content {
        @apply caps-xxs;
      }
    }
  }

  &--color {
    $buttonColors: (
      'brand': (
        'default': 'bg-primary-gradient',
        'hover': 'bg-primary-blue',
        'active': 'bg-dark-blue',
        'text': 'text-white',
      ),
      'primary': (
        'default': 'bg-primary-gradient',
        'hover': 'bg-primary-blue',
        'active': 'bg-dark-blue',
        'text': 'text-white',
      ),
      'secondary': (
        'default': 'bg-white',
        'hover': 'bg-gray-100',
        'active': 'bg-gray-300',
        'text': 'text-gray-500',
      ),
    );

    $colors: 'green', 'orange', 'purple', 'red', 'blue';

    @each $color in $colors {
      $buttonColors: map.merge($buttonColors, (
        '#{$color}': (
          'default': 'bg-#{$color}-500',
          'hover': 'bg-#{$color}-400',
          'active': 'bg-#{$color}-600',
          'text': 'text-white',
        )
      ));
    }

    @each $name, $config in $buttonColors {
      &-#{$name} {
        @apply #{map.get($config, 'default')} #{map.get($config, 'text')};

        &:not(.button--disabled):hover,
        &:not(:disabled):hover {
          // Override any gradient background
          background-image: none;
          @apply #{map.get($config, 'hover')};
        }
        &:not(.button--disabled):active,
        &:not(:disabled):active {
          @apply #{map.get($config, 'active')};
        }
      }
    }
  }

  &--disabled {
    @apply opacity-40 cursor-not-allowed;
  }
}
</style>
