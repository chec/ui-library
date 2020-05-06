<template>
  <div class="progress">
    <div
      class="progress__bar"
      :style="{width: percentage + '%'}"
      role="progressbar"
      :aria-valuenow="percentage"
      aria-valuemin="0"
      aria-valuemax="100"
    >
    </div>
  </div>
</template>
<script>
export default {
  name: 'ChecProgressBar',
  props: {
    /**
     * The percentage value between 0 and 100
     */
    percentage: {
      type: Number,
      default: 1,
      validator: value => {
        if (value >= 0 && value <= 100) {
          return true;
        }
        return false;
      },
    },
  },
};
</script>
<style scoped lang="scss">
  .progress {
    @apply h-1 rounded-lg bg-gray-200 overflow-hidden;
    &__bar{
      @apply h-1 bg-green-500;
    }
  }
</style>
