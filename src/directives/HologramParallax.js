class ParallaxWatcher {
  constructor() {
    this.ratio = [0, 0];
    this.nodes = [];

    this.viewport = [
      Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
    ];

    this.bindEvents();
  }

  addNode(node) {
    if (this.nodes.length === 0) {
      this.bindEvents();
    }

    if (this.findNodeIndex(node) < 0) {
      this.nodes.push(node);
      /* eslint-disable-next-line no-param-reassign */
      node.style.backgroundSize = '160% 160%';
    }
  }

  findNodeIndex(node) {
    return this.nodes.findIndex((candidateNode) => candidateNode.isSameNode(node));
  }

  removeNode(node) {
    const index = this.findNodeIndex(node);

    if (index >= 0) {
      this.nodes.splice(index, 1);
    }

    if (this.nodes.length === 0) {
      this.unbindEvents();
    }
  }

  bindEvents() {
    window.addEventListener('deviceorientation', this.handleAccelerometer.bind(this));
    window.addEventListener('mousemove', this.handleMouse.bind(this));
  }

  unbindEvents() {
    window.removeEventListener('deviceorientation', this.handleAccelerometer);
    window.removeEventListener('mousemove', this.handleMouse);
  }

  handleAccelerometer(event) {
    const { alpha, beta, gamma } = event;

    const realAlpha = alpha > 180 ? alpha - 360 : alpha;

    this.ratio = [
      (((realAlpha + 180) / 360) + ((beta + 180) / 360)) / 2,
      Math.abs((gamma + 90) / 180),
    ];

    this.update();
  }

  handleMouse(event) {
    this.ratio = [
      event.clientX / this.viewport[0],
      event.clientY / this.viewport[1],
    ];
    this.update();
  }

  update() {
    this.nodes.forEach((node) => {
      /* eslint-disable-next-line no-param-reassign */
      node.style.backgroundPositionX = `${(100 * this.ratio[0])}%`;
      /* eslint-disable-next-line no-param-reassign */
      node.style.backgroundPositionY = `${(100 * this.ratio[1])}%`;
    });
  }
}

const watcher = new ParallaxWatcher();

export default {
  bind(node) {
    watcher.addNode(node);
  },
  unbind(node) {
    watcher.removeNode(node);
  },
};
