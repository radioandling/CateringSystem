<template>
  <div class="highcharts-container"></div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);

export default {
  props: ['options'],
  name: 'highcharts',
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = new Highcharts.Chart(this.$el, this.options)
    }
  }
}
</script>

<style lang="less" scoped>
  .highcharts-container {

    width: 100%;
    height: 300px;
    border-radius: .5rem;
    margin-top: 1rem;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  }
</style>