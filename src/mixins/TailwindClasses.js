/**
 * Provides a tailwind prop that can be used to override default tailwind classes on a component.
 *
 * Usage:
 *
 * Component:
 * {
 *   mixins: [TailwindClasses('p-8 bg-white')],
 * }
 *
 * Template:
 * <div :class="tailwindClasses" />
 */
export default (defaults, propName = 'tailwind') => ({
  props: {
    [propName]: {
      type: [Array, Object, String],
      default: () => [],
    },
  },
  computed: {
    tailwindClasses() {
      // Convert ambiguous object/array/string syntax into an array
      const resolveClasses = input => {
        if (typeof input === 'object' && !Array.isArray(input)) {
          return Object.entries(input).reduce(([className, bool], acc) => {
            if (bool) {
              acc.push(className);
            }
            return acc;
          }, []);
        }
        if (!Array.isArray(input)) {
          return input.split(' ');
        }
        return input;
      };

      const tailwind = resolveClasses(this[propName]);
      const definedPrefixes = tailwind.map(className => className.split('-')[0]);

      return [
        ...resolveClasses(defaults).filter(className => !definedPrefixes.includes(className.split('-')[0])),
        ...tailwind,
      ];
    },
  },
});
