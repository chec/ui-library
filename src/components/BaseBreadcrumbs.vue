<template>
  <nav>
    <ul v-if="crumbs.length" class="breadcrumb">
      <li v-for="(crumb, i) in crumbs" :key="i">
        {{crumb.meta.breadcrumb}}
        <div class="breadcrumb__right-arrow">
          <SvgRightArrow />
        </div>
      </li>
    </ul>
  </nav>
</template>
<script>
import SvgRightArrow from './../assets/svgs/right-arrow.svg';
export default {
  name: 'BaseBreadcrumbs',
  components: {
    SvgRightArrow
  },
  computed: {
    crumbs() {
      let crumbs = [];
      if (!this.$route) {
        throw new Error("Could not locate this.$route from within <BaseBreadcrumbs>")
      }
      this.$route.matched.forEach((route) => {
        if (route.meta && route.meta.breadcrumb) {
          crumbs = [...crumbs, route]
        }
      })
      return crumbs
    }
  }
};
</script>
<style lang="scss" scoped>
.breadcrumb {
  @apply flex font-lato text-xl text-gray-500;
  &__right-arrow {
    @apply h-3 w-2 fill-current text-gray-400 ml-2;
  }
  li {
    @apply flex items-center pr-3;
  }
}
</style>
