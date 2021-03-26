import '../assets/tooltips.scss';
import { VPopover, VClosePopover, VTooltip } from 'v-tooltip';

// Remove unused "theme" classes from the tooltips
VTooltip.options.defaultClass = '';
VTooltip.options.popover.defaultClass = '';

export default {
  VPopover,
  VClosePopover,
  VTooltip,
};
