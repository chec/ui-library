export default (el, { arg, value, modifiers }) => {
  document.head.insertAdjacentHTML('beforeend', `<style>
  [${arg || 'data-tooltip'}][aria-description]::after {
    display: none;
    z-index: 9999;
  }


  [${arg || 'data-tooltip'}][aria-description]::before {
    display: none;
    z-index: 9999;
  }

  [${arg || 'data-tooltip'}][aria-description]::before {
    position: absolute;
    content: attr(aria-description);
  }

  [data-tooltip][aria-description]:focus::after {
    display: block;
  }
  [data-tooltip][aria-description]:hover::after {
    display: block;
  }
  [data-tooltip][aria-description]:focus::before {
    display: block;
  }

  [data-tooltip][aria-description]:hover::before {
    display: block;
  }
    </style>`);
  el.setAttribute('data-tooltip', '');
  if (modifiers.top) {
    el.setAttribute('data-tooltip-modified-top', '');
  } else {
    el.setAttribute('data-tooltip-modified-bottom', '');
  }
  el.setAttribute('aria-description', value);
};
