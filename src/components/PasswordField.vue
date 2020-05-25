<template>
  <TextField
    v-bind="{...$attrs, ...$props}"
    :type="fieldType"
    :actionLabel="showHideText"
    @actionClick="toggleShowPassword"
  />
</template>
<script>
import TextField from './TextField.vue';

export default {
  name: 'PasswordField',
  components: {
    TextField,
  },
  data() {
    return {
      showPassword: this.initialShowPassword,
    };
  },
  props: {
    /**
     * Default boolean value used for show/hide password state, false by default
     */
    initialShowPassword: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**
     * @returns {string}
     */
    showHideText() {
      return `${this.showPassword ? 'hide' : 'show'} password`;
    },
    /**
     * @returns {string}
     */
    fieldType() {
      return this.showPassword ? 'text' : 'password';
    },
  },
  methods: {
    /**
     * Toggles password type with type text to show password
     */
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>
