<script>
import { Pie } from 'vue-chartjs';

export default {
  name: 'PieWrapper',
  extends: Pie,
  props: {
    colors: {
      type: Object,
      default: () => {},
    },
    points: Array,
    labels: Array,
  },
  watch: {
    points() {
      this.rerender();
    },
  },
  mounted() {
    this.rerender();
  },
  methods: {
    rerender() {
      const { colors, labels, points } = this;

      this.renderChart(
        {
          datasets: [{
            data: points,
            backgroundColor: Object.values(colors),
            borderWidth: 0,
          }],
          labels,
        },
        {
          cutoutPercentage: 80,
          /**
           * Custom method for generating the legend, allows more customisation over the base Chart.js options
           */
          legendCallback(chart) {
            const { data } = chart;

            const legendLabels = data.labels.map((label, i) => {
              // We assume that we only use a single dataset
              const dataset = data.datasets[0];
              const datasetPoint = dataset.data[i];

              // todo use globally configured locale instead of en-US
              const formattedDatasetPoint = new Intl.NumberFormat('en-US').format(datasetPoint);

              const percent = Math.round((datasetPoint / (dataset.data.reduce((prev, curr) => prev + curr))) * 100);
              const labelWithPercent = `${label} ${percent}%`;

              const labelColor = Object.keys(colors)[i];

              return `<li class="pie-chart__legend-label">
                <span class="pie-chart__legend-dot pie-chart__legend-dot--${labelColor}"></span>
                <div class="pie-chart__legend-label-text-container">
                    <span class="pie-chart__legend-label-text">${labelWithPercent}</span>
                    <span class="pie-chart__legend-label-value">${formattedDatasetPoint}</span>
                </div>
              </li>`;
            });

            return `<ul class="pie-chart__legend-labels">${legendLabels.join('')}</ul>`;
          },
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          },
          events: [], // Disable hover
        },
      );
      this.$emit('generate-legend', this.generateLegend());
    },
  },
};
</script>
