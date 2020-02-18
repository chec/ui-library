import '../assets/tooltipstyles.css';
export default (el, { arg, value, modifiers }) => {
  const defaultTooltipAttribute = arg || 'data-tooltip';
  document.head.insertAdjacentHTML('beforeend', `<style>
  [${defaultTooltipAttribute}][aria-description]::after,
  [${defaultTooltipAttribute}][aria-description]::before {
    display: none;
    z-index: 9999;
  }

  [${defaultTooltipAttribute}][aria-description]::before {
    position: absolute;
    width: auto;
    min-width: 60%;
    content: attr(aria-description);
  }

  [${defaultTooltipAttribute}][aria-description]:focus::after,
  [${defaultTooltipAttribute}][aria-description]:hover::after,
  [${defaultTooltipAttribute}][aria-description]:focus::before,
  [${defaultTooltipAttribute}][aria-description]:hover::before {
    display: block;
  }</style>`);
  el.setAttribute(defaultTooltipAttribute, '');
  if (modifiers.top) {
    el.setAttribute(`${defaultTooltipAttribute}-modified-top`, '');
  } else if (modifiers.left) {
    el.setAttribute(`${defaultTooltipAttribute}-modified-left`, '');
  } else if (modifiers.right) {
    el.setAttribute(`${defaultTooltipAttribute}-modified-right`, '');
  } else {
    el.setAttribute(`${defaultTooltipAttribute}-modified-bottom`, '');
  }
  el.setAttribute('aria-description', value);
};
