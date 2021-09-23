import Vue from 'vue';
import { addDecorator } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import messages from '../../src/lang';

console.log(messages);

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: messages,
  // silentFallbackWarn: true,
  // silentTranslationWarn: true,
});

addDecorator(() => ({
  template: '<story/>',
  i18n,
}));
