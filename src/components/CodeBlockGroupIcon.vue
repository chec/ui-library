<template>
  <a
    :href="link"
    target="_blank"
    rel="noopener nofollow"
  >
    <ReactLogo
      v-if="icon === 'react'"
      class="code-example-group__logo"
    />
    <GatsbyLogo
      v-if="icon === 'gatsby'"
      class="code-example-group__logo"
    />
    <JavascriptLogo
      v-if="icon === 'javascript'"
      class="code-example-group__logo"
    />
    <NextLogo
      v-if="icon === 'next'"
      class="code-example-group__logo"
    />
    <VueLogo
      v-if="icon === 'vue'"
      class="code-example-group__logo"
    />
    <AngularLogo
      v-if="icon === 'angular'"
      class="code-example-group__logo"
    />
    <img
      v-if="icon === 'custom'"
      class="code-example-group__logo"
      :src="image"
    >
  </a>
</template>

<script>
import AngularLogo from '../assets/svgs/frameworks/angular.svg';
import GatsbyLogo from '../assets/svgs/frameworks/gatsby.svg';
import JavascriptLogo from '../assets/svgs/frameworks/javascript.svg';
import NextLogo from '../assets/svgs/frameworks/next.svg';
import ReactLogo from '../assets/svgs/frameworks/react.svg';
import VueLogo from '../assets/svgs/frameworks/vue.svg';

export default {
  name: 'CodeBlockGroupIcon',
  components: {
    AngularLogo,
    JavascriptLogo,
    GatsbyLogo,
    NextLogo,
    ReactLogo,
    VueLogo,
  },
  props: {
    /**
     * The icon type
     */
    icon: {
      type: String,
      validate(type) {
        return [
          'angular',
          'gatsby',
          'javascript',
          'next',
          'react',
          'vue',
          'custom',
        ].includes(type);
      },
    },
    /**
     * Link for the icon
     */
    link: String,
    /**
     * Custom Icon Image
     */
    image: String,
  },
};
</script>
