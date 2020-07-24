<template>
  <nav>
    <ul v-if="crumbs.length" class="breadcrumb">
      <li v-for="(crumb, i) in crumbs" :key="i">
        <router-link :to="crumb.path">
          {{ crumb.meta.breadcrumb }}
          <div v-if="(i + 1) !== crumbs.length" class="breadcrumb__right-arrow">
            <SvgRightArrow />
          </div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import SvgRightArrow from '../assets/svgs/right-arrow.svg';

export default {
  name: 'ChecBreadcrumbs',
  components: {
    SvgRightArrow,
  },
  computed: {
    crumbs() {
      const crumbs = [];
      if (!this.$route) {
        throw new Error('Could not locate this.$route from within <BaseBreadcrumbs>');
      }
      this.$route.matched.forEach((route) => {
        if (route.meta && route.meta.breadcrumb) {
          crumbs.push(route);
        }
      });
      return crumbs;
    },
  },
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  @apply flex font-lato text-xl text-gray-500;

  &__right-arrow {
    @apply h-3 w-2 fill-current text-gray-400 ml-2;
  }

  li {
    > a {
      @apply flex items-center pr-3;
    }

    &:last-child {
      @apply font-bold;
    }
  }
}
</style>
