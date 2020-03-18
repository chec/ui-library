<template>
  <div class="loading">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      shape-rendering="geometricPrecision"
      text-rendering="geometricPrecision"
      viewBox="0 0 32 32"
      class="loading__animation"
    >
      <ellipse
        rx="14"
        ry="14"
        fill="none"
        stroke="#f1f6fc"
        stroke-width="4"
        stroke-dashoffset="400"
        stroke-dasharray="100"
        transform="translate(16,16) rotate(90)"
      />
      <ellipse
        rx="14"
        ry="14"
        fill="none"
        stroke="#34cbad"
        stroke-width="4"
        stroke-dashoffset="100"
        stroke-dasharray="100"
        transform="translate(16,16)"
        class="loading__animation-spinner"
      />
    </svg>
    <div class="loading__message">{{ message }}</div>
  </div>
</template>
<script>
export default {
  name: 'ChecLoading',
  props: {
    message: {
      type: String,
      default: 'Loading...',
    },
  },
};
</script>
<style scoped lang="scss">
.loading {
  @apply absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center flex-col;
  // Custom: Overlay / Light
  background: rgba(255, 255, 255, 0.9);

  &__animation {
    @apply w-8 mb-2;
  }

  &__animation-spinner {
    animation: 2.4s linear infinite both a0_t, 2.4s linear infinite both a0_do;
  }

  &__message {
    @apply uppercase font-bold tracking-wider text-gray-500 text-xs;
  }
}

// Loading animations
@keyframes a0_t {
  0% {
    transform: translate(16px, 16px) rotate(0deg);
  }
  100% {
    transform: translate(16px, 16px) rotate(-360deg);
  }
}
@keyframes a0_do {
  0% {
    stroke-dashoffset: 100;
    animation-timing-function: cubic-bezier(0.42,0,0.58,1);
  }
  25% {
    stroke-dashoffset: 200;
    animation-timing-function: cubic-bezier(0.42,0,0.58,1);
  }
  50% {
    stroke-dashoffset: 300;
    animation-timing-function: cubic-bezier(0.42,0,0.58,1);
  }
  75% {
    stroke-dashoffset: 400;
    animation-timing-function: cubic-bezier(0.42,0,0.58,1);
  }
  100% {
    stroke-dashoffset: 500;
  }
}
</style>
