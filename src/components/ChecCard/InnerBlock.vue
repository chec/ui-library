<template>
  <div class="card-inner-block">
    <div class="card-inner-block__container">
      <component :is="titleTag" v-if="title" class="card-inner-block__title">
        {{ title }}
      </component>
      <!--
        @slot The content of the block
      -->
      <slot />
    </div>
    <div v-if="actionText || $slots.action">
      <slot name="action" />
      <ChecButton
        v-if="!$slots.action"
        class="card-inner-block__action"
        variant="round"
        :color="actionColor"
        @click="emitAction"
      >
        {{ actionText }}
        <!--
          @slot Passthrough for the icon slot on the button component
        -->
        <template v-if="$slots.actionIcon" #icon>
          <slot name="actionIcon" />
        </template>
      </ChecButton>
    </div>
  </div>
</template>

<script>
import ChecButton from '../ChecButton.vue';

export default {
  name: 'InnerBlock',
  components: { ChecButton },
  props: {
    /**
     * The title of the inner block
     */
    title: {
      type: String,
    },
    /**
     * The HTML tag to use for the title of the block
     */
    titleTag: {
      type: String,
      default: () => 'h3',
    },
    /**
     * The text to be shown on the right aligned action button. If omitted, no button will show
     */
    actionText: String,
    /**
     * The button color that should be used on the action button
     */
    actionColor: String,
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
  },
};
</script>

<style lang="scss">
.card-inner-block {
  @apply
    flex flex-row items-center justify-between w-full bg-gray-100 rounded p-4
    text-gray-600 text-sm leading-tight break-all;

  &__title {
    @apply caps-xs mb-2 text-gray-500;
  }

  &__action {
    @apply break-normal;
  }

  &__container {
    @apply flex-grow;
  }
}
</style>
