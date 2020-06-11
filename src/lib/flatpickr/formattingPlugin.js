import Vue from 'vue';
import NavBar from '../../components/ChecDatepicker/NavBar.vue';

/**
 * A flatpickr plugin that alters the month/year selection bar
 */
function ChecFlatpickrPlugin() {
  return (fp) => {
    function clearMonthBar() {
      const node = fp.monthNav;
      if (!node) {
        return;
      }
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    }

    function mountNavBar() {
      if (!fp.monthNav) {
        return;
      }
      // eslint-disable-next-line vue/require-name-property
      const bar = new Vue({
        ...NavBar,
        propsData: {
          picker: fp,
        },
      });

      fp.monthNav.appendChild(bar.$mount().$el);
    }

    return {
      onReady: [
        clearMonthBar,
        mountNavBar,
      ],
    };
  };
}

export default ChecFlatpickrPlugin;
