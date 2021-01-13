<template>
  <span class="chec-navigation__ping">
    <span class="chec-navigation__ping-outer" />
    <span class="chec-navigation__ping-inner" />
  </span>
</template>

<script>
export default {
  name: 'Ping',
};
</script>

<style lang="scss">
.chec-navigation__ping {
  @apply flex h-3 w-3 relative -ml-5 -mt-5 pointer-events-none;

  &-inner {
    @apply relative inline-flex rounded-full h-3 w-3 bg-green-400;
  }

  &-outer {
    @apply animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75;
    animation-duration: 3s;
  }
}
</style>
