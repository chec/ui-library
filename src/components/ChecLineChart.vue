<template>
  <div class="chec-chart">
    <!-- Custom x-axis to allow for detailed (CSS) styling. Chart.js doesn't provide many styling options -->
    <div class="chec-chart__ticks" :style="leftOffset">
      <div v-for="tick in xLabels" :key="tick">
        <span class="chec-chart__tick">{{ tick }}</span>
      </div>
    </div>
    <!-- Mostly transparent divs that appear on the right of the graph to appear as a "forecast" -->
    <div
      v-for="(yHeight, index) in yHeights"
      :key="index"
      class="chec-chart__forecast"
      :style="forecastStyle(yHeight)"
    />
    <!-- vue-chartjs wrapper with rendering options specific for our use case -->
    <LineWrapper
      :points="points"
      :labels="xLabels"
      :minimums="minimums"
      :height="height"
      css-classes="chec-chart__canvas"
      :styles="leftOffset"
      @tooltip="handleTooltip"
      @drawn="handleDraw"
    />
    <!-- This overlay is placed on top of points when they're hovered over and displays the tooltip -->
    <div
      v-if="tooltipOverlayPosition"
      v-tooltip="tooltipConfig"
      class="chec-chart__tooltip-overlay"
      :style="tooltipOverlayPosition"
    />
    <!-- Optionally fade out the edges of the graph when the width needs to be limited -->
    <template v-if="fadeEdges">
      <div class="chec-chart__fade chec-chart__fade--left" :style="{ width: forecastWidth }" />
      <div class="chec-chart__fade chec-chart__fade--right" :style="{ width: forecastWidth }" />
    </template>
  </div>
</template>

<script>
import LineWrapper from '@/components/ChecChart/LineWrapper';

export default {
  name: 'ChecLineChart',
  components: {
    LineWrapper,
  },
  props: {
    /**
     * The data to show on the graph. Each dataset is an object with a `label` and a `points` attribute. Provide the
     * name of the dataset as the label, and an array of values as "points". The values must be numbers. Optionally you
     * can provide a `format` attribute that can be used to format an individual point when it's displayed in a tooltip.
     */
    datasets: {
      type: Array,
      required: true,
    },
    fadeEdges: Boolean,
    /**
     * The height of the chart.
     */
    height: {
      type: Number,
      default: null,
    },
    /**
     * Provide an array of strings as labels for x axis. The number of labels must match the maximum number of points
     * in a provided dataset.
     */
    xLabels: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tooltipOverlayPosition: null,
      tooltipContent: null,
      yHeights: [],
    };
  },
  computed: {
    // The forecast that appears on the right of the graph has it's width determined by the number of data points we
    // render - it's half of the space between two points. This is also used to offset the graph at the start
    forecastWidth() {
      return `${50 / this.xLabels.length}%`;
    },
    leftOffset() {
      return {
        marginLeft: `-${this.forecastWidth}`,
      };
    },
    points() {
      return this.datasets.map(({ points }) => points);
    },
    minimums() {
      return this.datasets.map(({ min }) => min);
    },
    tooltipConfig() {
      return {
        content: this.tooltipContent,
        show: true,
        trigger: 'manual',
      };
    },
  },
  methods: {
    forecastStyle(height) {
      return {
        // The height is given as coordinate from the top, so we need to inverse it. Also, we need to factor in the
        // margin applied to the x axis (at the top of the component)
        height: `calc(100% - ${height}px - 4rem)`,
        width: `calc(${this.forecastWidth} + 5px)`,
      };
    },
    handleDraw({ finalYPosition }) {
      this.yHeights = finalYPosition;
    },
    handleTooltip(position, tooltipModel) {
      if (!position) {
        this.tooltipOverlayPosition = null;
      }

      if (!tooltipModel) {
        return;
      }

      // Don't worry about tooltips in serverless environments
      if (!window) {
        return;
      }

      const { scrollY, scrollX } = window;
      const { x, y, padding } = position;
      const bounds = this.$el.getBoundingClientRect();
      this.tooltipOverlayPosition = {
        left: `calc(${x} - ${padding} - ${bounds.x + scrollX}px)`,
        top: `calc(${y} - ${padding} - ${bounds.y + scrollY}px)`,
      };

      // Figure out what index is being hovered over
      const { index } = tooltipModel.dataPoints[0];
      const title = tooltipModel.title[0];

      this.tooltipContent = `<div class="chec-chart__tooltip"><div class="chec-chart__tooltip-title">${title}</div>${
        this.datasets
          // Skip dataset "0" as it's duplicated for a double gradient effect
          .map(({ label, points, format }) => {
            const value = typeof format === 'function' ? format(points[index]) : points[index];
            return `${label}: <strong>${value}</strong>`;
          })
          .join('<br>')
      }</div>`;
    },
  },
};
</script>

<style lang="scss">
.chec-chart {
  @apply overflow-hidden bg-gray-500 relative;

  &__tooltip-overlay {
    @apply w-2 h-2 absolute invisible pointer-events-none;
  }

  &__ticks {
    @apply flex justify-between caps-xxs text-gray-200 mb-16 w-full;

    // This offsets the size of the point in the graph. Without it the label is 5px offset to the right
    padding: 0 5px;

    > * {
      @apply relative;
    }
  }

  &__canvas {
    @apply w-full;
  }

  &__tick {
    @apply absolute;
    // Offset back 50% so it's centered, plus the radius of the point
    transform: translateX(-50%);
  }

  &__tooltip {
    @apply leading-tight;
  }

  &__tooltip-title {
    @apply mb-2 caps-xxs font-bold;
  }

  &__fade {
    @apply absolute h-full pointer-events-none top-0;

    // Custom gradients from gray-500 to transparent
    // TODO replace with tailwind gradient tooling when supported in SCSS
    &--left {
      background: linear-gradient(90deg, rgba(65, 84, 108, 1) 0%, rgba(65, 84, 108, 0) 100%);
      left: 0;
    }

    &--right {
      background: linear-gradient(270deg, rgba(65, 84, 108, 1) 0%, rgba(65, 84, 108, 0) 100%);
      right: 0;
    }
  }

  &__forecast {
    @apply absolute right-0 bottom-0 bg-white opacity-10 pointer-events-none;
  }
}
</style>
