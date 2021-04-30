<script>
import { uiIcons } from '@/lib/icons';
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecButton',
  props: {
    /**
     * The type of HTML tag or Vue component to use for the button. One of "link", "button", or "route".
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
          'purple',
          'orange',
          'white',
          'gray',
        ].includes(color);
      },
      default: 'secondary',
    },
    /**
     * The style variant of the button. Includes size, border radius, etc. One of 'regular', 'small', 'round', 'tag'
     */
    variant: {
      type: String,
      validate(variant) {
        return ['regular', 'small', 'round', 'text', 'tag', 'input'].includes(variant);
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
     * Changes the button to a transparent button with coloured text that matches the chosen colour.
     */
    textOnly: Boolean,
    /**
     * Changes the button to an outline only button.
     */
    outline: Boolean,
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
      const {
        color,
        variant,
        textOnly,
        outline,
        disabled,
        hasIcon,
        iconPosition,
      } = this;

      return [
        'button',
        `button--variant-${variant}`,
        {
          [`button--color-${color}`]: variant !== 'input',
          'button--text-only': textOnly,
          'button--outline': outline,
          'button--disabled': disabled,
          'button--has-icon': hasIcon,
          [`button--has-icon-${iconPosition}`]: hasIcon,
        },
      ];
    },
    hasIcon() {
      return this.icon || (this.$slots.icon && Boolean(this.$slots.icon.length));
    },
    tag() {
      if (this.tagType === 'link') {
        if (this.disabled) {
          return 'span';
        }
        return 'a';
      }
      if (this.tagType === 'route') {
        if (this.disabled) {
          return 'span';
        }
        return 'router-link';
      }
      return 'button';
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

    const props = {};
    if (this.tagType === 'route') {
      props.to = this.$attrs.to;
    }

    return createElement(this.tag, {
      class: this.classNames,
      domProps: {
        disabled: this.disabled,
        type: this.tagType === 'button' ? this.buttonType : null,
      },
      on: {
        click: this.handleClick,
      },
      props,
    }, children);
  },
};
</script>

<style lang="scss">
@use 'sass:map';

.button {
  @apply font-bold shadow-sm border border-0 flex justify-center items-center text-center cursor-pointer;

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
      @apply py-2 px-4 rounded-full leading-tight;

      .button__content {
        @apply caps-xxs;
      }

      .button__icon {
        @apply w-xxs;
      }
    }

    &-tag {
      @apply py-2 px-4 rounded leading-tight;

      .button__content {
        @apply caps-xxs;
      }

      .button__icon {
        @apply w-xxs;
      }
    }

    &-input {
      @apply
        font-normal border border-gray-200 shadow-sm p-4 rounded text-sm leading-tight text-gray-500 items-center
        outline-none justify-between bg-white;

      .button__icon {
        @apply w-xs ml-4;
      }

      &:focus,
      &:active {
        @apply transition duration-150 border-gray-500 shadow-light-focus;
      }

      &:hover {
        @apply transition duration-150 border-gray-400;
      }
    }
  }

  &--color {
    $button-colors: (
      'brand': (
        'default': 'primary-gradient',
        'hover': 'primary-blue',
        'active': 'dark-blue',
        'text': 'text-white',
      ),
      'primary': (
        'default': 'gray-600',
        'hover': 'gray-500',
        'active': 'gray-400',
        'text': 'text-white',
      ),
      'secondary': (
        'default': 'white',
        'hover': 'gray-200',
        'active': 'gray-300',
        'text': 'text-gray-500',
      ),
    );

    $colors: 'green', 'orange', 'purple', 'red', 'blue';
    @each $color in $colors {
      $button-colors: map.merge($button-colors, (
        '#{$color}': (
          'default': '#{$color}-500',
          'hover': '#{$color}-400',
          'active': '#{$color}-600',
          'text': 'text-white',
        )
      ));
    }

    // Allow "gray" and "white"
    $button-colors: map.merge($button-colors, (
      'gray': map.get($button-colors, 'primary'),
      'white': map.get($button-colors, 'secondary'),
    ));

    @each $name, $config in $button-colors {
      &-#{$name} {
        @apply bg-#{map.get($config, 'default')} #{map.get($config, 'text')};

        &:not(.button--disabled):hover,
        &:not(:disabled):hover:enabled {
          // Override any gradient background
          background-image: none;
          @apply bg-#{map.get($config, 'hover')} #{map.get($config, 'text')};
        }

        &:not(.button--disabled):active,
        &:not(:disabled):active:enabled {
          @apply bg-#{map.get($config, 'active')};
        }

        &.button--text-only {
          // Handle the one gradient that can't be text
          $default-color: #{map.get($config, 'default')};
          @if ($default-color == 'primary-gradient') {
            $default-color: 'dark-blue';
          }

          // Override any gradient background
          background-image: none;
          @apply bg-transparent text-#{$default-color};

          &:not(.button--disabled):hover,
          &:not(:disabled):hover:enabled {
            @apply bg-transparent text-#{map.get($config, 'hover')};
          }

          &:not(.button--disabled):active,
          &:not(:disabled):active:enabled {
            @apply bg-transparent text-#{map.get($config, 'active')};
          }
        }

        &.button--outline {
          // Handle the one gradient that can't be text or a border
          $default-color: #{map.get($config, 'default')};
          @if ($default-color == 'primary-gradient') {
            $default-color: 'dark-blue';
          }

          background-image: none;
          @apply bg-transparent text-#{$default-color} border border-#{$default-color};
        }
      }
    }
  }

  &--text-only {
    @apply border-0 shadow-none;

    &:focus {
      @apply outline-none;
    }
  }

  &--disabled {
    @apply opacity-40 cursor-not-allowed;
  }
}
</style>
