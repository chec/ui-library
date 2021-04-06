<script>
import { Line } from 'vue-chartjs';

export default {
  name: 'LineWrapper',
  extends: Line,
  props: {
    points: Array,
    labels: Array,
    minimums: Array,
  },
  watch: {
    points() {
      this.rerender();
    },
  },
  mounted() {
    const $vm = this;
    this.addPlugin({
      afterDatasetDraw(chart) {
        $vm.$emit('drawn', {
          finalYPosition: $vm.points.map((_, index) => {
            const meta = chart.getDatasetMeta(index + 1).data;
            // eslint-disable-next-line no-underscore-dangle
            return meta[meta.length - 1]._model.y;
          }),
        });
      },
    });
    this.rerender();
  },
  methods: {
    makeHoloGradient(opacity) {
      return (context) => {
        const { chartArea } = context.chart;

        if (!chartArea) {
          // This case happens on initial chart load
          return null;
        }

        const gradientOptions = this.calculateGradientDirection(150, {
          height: chartArea.bottom - chartArea.top,
          width: chartArea.right - chartArea.left,
        });

        const gradient = context.chart.ctx.createLinearGradient(
          ...gradientOptions,
        );
        gradient.addColorStop(0.0042, `rgba(172, 201, 218, ${opacity})`);
        gradient.addColorStop(0.2031, `rgba(231, 174, 210, ${opacity})`);
        gradient.addColorStop(0.3177, `rgba(255, 158, 202, ${opacity})`);
        gradient.addColorStop(0.4792, `rgba(110, 255, 251, ${opacity})`);
        gradient.addColorStop(0.5365, `rgba(188, 255, 223, ${opacity})`);
        gradient.addColorStop(0.6927, `rgba(255, 159, 180, ${opacity})`);
        gradient.addColorStop(0.9986, `rgba(172, 184, 218, ${opacity})`);

        return gradient;
      };
    },
    makeOverlayGradient() {
      return (context) => {
        const { chartArea } = context.chart;

        if (!chartArea) {
          // This case happens on initial chart load
          return null;
        }

        const gradientOptions = this.calculateGradientDirection(175, {
          height: chartArea.bottom - chartArea.top,
          width: chartArea.right - chartArea.left,
        });
        const gradient = context.chart.ctx.createLinearGradient(
          ...gradientOptions,
        );
        gradient.addColorStop(0.1376, 'rgba(214, 228, 247, 0.332)');
        gradient.addColorStop(0.8532, 'rgba(214, 228, 247, 0.183)');

        return gradient;
      };
    },
    calculateGradientDirection(degrees, bounds) {
      // We have to convert degrees to radians (as the trigonometric functions in JS use radians) before we calculate
      // the vector we need for createLinearGradient
      const radian = (degrees * Math.PI) / 180;
      const { width, height } = bounds;
      const halfLineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian)) / 2;

      const x0 = (width / 2) + Math.sin(radian) * halfLineLength;
      const y0 = (height / 2) - Math.cos(radian) * halfLineLength;
      const x1 = width - x0;
      const y1 = height - y0;

      // Multiply the points of vector so that it starts and ends outside the container
      return [x0, x1, y0, y1].map((n) => n * 1.2);
    },
    rerender() {
      const { labels, points } = this;

      const [firstSet, secondSet, ...otherSets] = points;

      if (otherSets.length) {
        throw new Error('ChecLineChart currently supports only two or fewer sets of points');
      }

      const pointStyles = {
        pointBorderWidth: 2,
        pointRadius: 3,
        pointBorderColor: 'white',
        pointBackgroundColor: '#41545C',
      };

      const datasets = [
        {
          backgroundColor: this.makeHoloGradient(0.1),
          borderColor: this.makeHoloGradient(1),
          data: firstSet,
          ...pointStyles,
          pointHoverBackgroundColor: this.makeHoloGradient(1),
          yAxisID: 'a',
        },
        {
          backgroundColor: this.makeOverlayGradient(),
          borderColor: 'rgba(0, 0, 0, 0)',
          data: firstSet,
          pointRadius: 0,
        },
      ];

      let upperBound = 0;
      let lowerBound = 0;

      // TODO support more than just 2 lines
      const setLowerBound = this.minimums[1];

      if (secondSet) {
        datasets.push({
          data: secondSet,
          borderWidth: 0,
          borderColor: 'rgba(255, 255, 255, 0.01)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          yAxisID: 'b',
          ...pointStyles,
        });

        lowerBound = Infinity;
        // Calculate largest "tick" for the second dataset
        secondSet.forEach((n) => {
          if (n > upperBound) {
            upperBound = n;
          }
          if (setLowerBound === undefined && n < lowerBound) {
            lowerBound = n;
          }
        });
      }

      const $vm = this;

      this.renderChart(
        {
          labels,
          datasets,
        },
        {
          animation: {
            duration: 0,
          },
          maintainAspectRatio: false,
          layout: {
            // Add padding to prevent the points from clipping at the top and right. 5px is the maximum radius of a
            // point. We don't worry about the left as it's moved off-screen anyway
            padding: { top: 5, right: 5 },
          },
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                display: false,
              },
            ],
            yAxes: [
              {
                display: false,
                id: 'a',
                ticks: {
                  min: this.minimums[0],
                },
              },
              {
                display: false,
                id: 'b',
                ticks: {
                  // Calculate a lower bound that's 5% less than the range between min and max
                  min: setLowerBound === undefined
                    ? lowerBound - Math.ceil((upperBound - lowerBound) * 0.05)
                    : setLowerBound,
                  max: upperBound,
                },
              },
            ],
          },
          tooltips: {
            enabled: false,
            custom(tooltipModel) {
              // Leave now if there isn't a tooltip to show
              if (tooltipModel.opacity === 0) {
                $vm.$emit('tooltip', null);
                return;
              }

              // Calculate a position to show the tooltip
              // eslint-disable-next-line no-underscore-dangle
              const position = this._chart.canvas.getBoundingClientRect();

              const x = `${position.left + window.pageXOffset + tooltipModel.caretX}px`;
              const y = `${position.top + window.pageYOffset + tooltipModel.caretY}px`;
              $vm.$emit('tooltip', {
                x,
                y,
                padding: '.25rem',
              }, tooltipModel);
            },
          },
        },
      );
    },
  },
};
</script>

<style lang="scss">

</style>
