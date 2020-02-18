export default (el, { value, modifiers }) => {
  document.head.insertAdjacentHTML('beforeend', `<style>
  [data-tooltip][aria-description]::before {
    position: absolute;
    content: attr(aria-description);
    ${modifiers.top ? 'bottom: 100%;' : 'top: 100%;'}
    display: none;
  }
  [data-tooltip][aria-description]:hover::before,
  [data-tooltip][aria-description]:focus::before {
    display: block;
    z-index: 99999;
  }
    </style>`);
  el.setAttribute('data-tooltip', '');
  el.setAttribute('aria-description', value);
};
