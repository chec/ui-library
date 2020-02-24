import '../assets/tailwind.css';
import Vue from 'vue';
import { BaseTooltip } from '../index';

Vue.directive('tooltip', BaseTooltip.VTooltip);
Vue.directive('close-popover', BaseTooltip.VClosePopover);
Vue.component('v-popover', BaseTooltip.VPopover);
