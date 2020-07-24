<script>
import { uiIcons } from '@/lib/icons';
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecButton',
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
    disabled: Boolean,
    /**
     * An icon (from the available ui icons) to display
     */
    icon: {
      type: String,
      default: null,
      validate: icon => Object.keys(uiIcons).includes(icon),
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
      return this.icon || (this.$slots.icon && Boolean(this.$slots.icon.length));
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

    if (this.hasIcon) {
      const icon = this.$slots.icon
        ? createElement('i', { class: ['button__icon'] }, this.$slots.icon)
        : createElement(ChecIcon, { class: ['button__icon'], props: { icon: this.icon } });

      if (this.iconPosition === 'before') {
        children.unshift(icon);
      } else {
        children.push(icon);
      }
    }

    const domProps = { disabled: this.disabled };

    if (this.tagType === 'button') {
      domProps.type = this.buttonType;
    }

    return createElement(tag, {
      class: this.classNames,
      domProps,
      on: {
        click: this.handleClick,
      },
    }, children);
  },
};
</script>

<style lang="scss">
@use 'sass:map';

.button {
  @apply font-bold shadow-sm border border-0 flex justify-center items-center text-center;

  &:focus {
    @apply outline-none;
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

      .button__icon {
        @apply w-sm;
      }
    }

    &-large {
      @apply py-4 px-8 rounded text-lg leading-tight;

      .button__icon {
        @apply w-lg; }
    }

    &-small {
      @apply p-2 rounded text-sm leading-tight shadow-none;

      .button__icon {
        @apply w-sm;
      }
    }

    &-round {
      @apply py-2 px-4 rounded-full;

      .button__content {
        @apply caps-xxs;
      }

      .button__icon {
        @apply w-xxs;
      }
    }
  }

  &--color {
    $button-colors: (
      'brand': (
        'default': 'bg-primary-gradient',
        'hover': 'bg-primary-blue',
        'active': 'bg-dark-blue',
        'text': 'text-white',
      ),
      'primary': (
        'default': 'bg-gray-600',
        'hover': 'bg-gray-500',
        'active': 'bg-gray-400',
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
      $button-colors: map.merge($button-colors, (
        '#{$color}': (
          'default': 'bg-#{$color}-500',
          'hover': 'bg-#{$color}-400',
          'active': 'bg-#{$color}-600',
          'text': 'text-white',
        )
      ));
    }

    @each $name, $config in $button-colors {
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
