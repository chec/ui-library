import '../assets/tailwind.css';
import Vue from 'vue';
import { ChecTooltip } from '../index';

Vue.directive('tooltip', ChecTooltip.VTooltip);
Vue.directive('close-popover', ChecTooltip.VClosePopover);

// eslint-disable-next-line vue/match-component-file-name
Vue.component('VPopover', ChecTooltip.VPopover);
