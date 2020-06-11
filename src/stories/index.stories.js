import '../assets/tailwind.css';
import Vue from 'vue';
import { BaseTooltip } from '../index';

Vue.directive('tooltip', BaseTooltip.VTooltip);
Vue.directive('close-popover', BaseTooltip.VClosePopover);

// eslint-disable-next-line vue/match-component-file-name
Vue.component('VPopover', BaseTooltip.VPopover);
