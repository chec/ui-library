<template>
    <div
        class="radio-btn"
        :class="{ 'active' : isChecked, 'disabled' : disabled }"
    >
        <input
            type="radio"
            :id="value"
            :name="name"
            :value="value"
            :checked="isChecked"
            :disabled="disabled"
            class="radio-btn__input"
            @input="handleInput"
        />
        <span class="radio-btn__fill"></span>
        <label :for="value" class="radio-btn__container">
            <div class="radio-btn__content">
                <!--  Custom label slot (bind 'label' string, 'isChecked' boolean, 'disabled' boolean -->
                <slot name="label" v-bind="{ label, isChecked, disabled }">
                <div v-if="label" class="radio-btn__label">{{ label }}</div>
                </slot>
            </div>
        </label>

    </div>
</template>

<script>

export default {
  name: 'RadioButton',
  model: {
    prop: 'selected',
    event: 'input',
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: String,
      default: '',
    },
  },
  computed: {
    isChecked() {
      return this.value === this.selected;
    },
  },
  methods: {
    handleInput() {
      this.$emit('input', this.value);
    },
  },
};

</script>

<style lang="scss">

.radio-btn {
    display: flex;
    // font-size: 16px;
    cursor: pointer;
    position: relative;
    padding: 10px;

    // Hides browser's default radio style
    &__input{
        // padding: 10px;
        // z-index: 2;
        @apply bg-white border border-gray-400;
        margin: 0;
        width: 16px;
        height: 16px;
        -webkit-appearance: none;
        border-radius: 50px;
        display: inline-block;
        position: relative;

        &:focus {
            @apply outline-none;
        }

        &:hover{
          cursor: pointer;
          @apply bg-white border border-gray-500;
        }

        &:active{
          @apply bg-gray-300 border border-gray-600;
        }

        &:disabled{
          @apply bg-white border border-gray-400;
        }
    }

    &__input:checked:after {
        @apply bg-gray-500;
        content: '';
        width: 8px;
        height: 8px;
        top: 3px;
        left: 3px;
        border-radius: 50px;
        position: absolute;
        text-shadow: 0px;
        // font-size: 20px;
    }

    &__input:checked{
      @apply bg-white border border-gray-500;
    }


    &__container {
        flex: 1;
        display: flex;
        cursor: pointer;
        background: transparent;
    }

    // &__content {
    //     flex: 1;
    // }

    &__label {
        @apply flex font-lato text-sm text-gray-600;
        padding-left: 24px;
    }

}

</style>
