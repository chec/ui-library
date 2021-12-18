<template>
  <div class="pie-chart">
    <h3 class="pie-chart__title">
      {{ title }}
    </h3>
    <div class="pie-chart__chart-container">
      <PieWrapper
        class="pie-chart__chart"
        :colors="colors"
        :labels="labels"
        :points="points"
        @generate-legend="(legend) => chartLegend = legend"
      />
      <div class="pie-chart__legend" v-html="chartLegend" />
    </div>
  </div>
</template>

<script>
import PieWrapper from '@/components/ChecChart/PieWrapper.vue';

export default {
  name: 'PieChart',
  components: {
    PieWrapper,
  },
  props: {
    title: String,
    dataPoints: Array,
  },
  data() {
    return {
      colors: {
        green: 'rgb(52, 202, 173)', // green-300
        purple: 'rgb(123, 101, 205)', // purple-400
      },
      chartLegend: null,
    };
  },
  computed: {
    labels() {
      return this.dataPoints.map((dataPoint) => dataPoint.label);
    },
    points() {
      return this.dataPoints.map((dataPoint) => dataPoint.value);
    },
  },
};
</script>

<style lang="scss">
.pie-chart {
  &__title {
    @apply mb-8 uppercase;
  }

  &__chart-container {
    @apply flex;
  }

  &__chart {
    @apply mr-8 relative w-48 h-48;
  }

  &__legend {
    @apply mt-4;
  }

  &__legend-label {
    @apply flex items-start mb-4;
  }

  &__legend-label-text-container {
    @apply flex flex-col;
  }

  &__legend-label-value {
    @apply text-2xl;
  }

  &__legend-dot {
    @apply inline-block w-4 h-4 rounded-full mr-4 mt-1;

    &--green {
      @apply bg-green-300;
    }

    &--purple {
      @apply bg-purple-400;
    }
  }
}
</style>
