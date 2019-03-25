<template>
    <section class="graph">
      <el-radio-group class="graph-trend-type" v-model="trendRange" @change="searchTrend" size="mini">
        <el-radio-button label="week">周</el-radio-button>
        <el-radio-button label="month">月</el-radio-button>
      </el-radio-group>
      <ve-line :data="trendData" :settings="trendSettings"></ve-line>
    </section>
</template>

<script>
import {getMessageOverview} from '@/fetch'

export default {
  name: 'ManageUser',
  data() {
    this.trendSettings = {
      labelMap: {
        'date': '日期',
        'count': '消息量'
      },
      legendName: {
        'count': '消息量'
      }
    }
    return {
      trendRange: 'week',
      trendData: {
        columns: ['date', 'count'],
        rows: null
      }
    };
  },
  methods: {
    searchTrend(type) {
      this.getTrend(type);
    },
    getTrend(range = 'week') {
      let fromStamp;
      const to = new Date();
      const toStamp = to.getTime();
      const oneDayStamp = 1000 * 60 * 60 * 24;
      switch (range) {
        case 'week':
          fromStamp = toStamp - 7 * oneDayStamp;
          break;
        case 'month':
          fromStamp = toStamp - 30 * oneDayStamp;
      }
      getMessageOverview({
        from: new Date(fromStamp),
        to
      }).then(({data} = {data: []}) => {
        this.trendData.rows = data;
      })
    }
  },
  mounted() {
    this.getTrend(this.trendRange);
  }
}
</script>

<style>
.graph {
  padding-top: 28px;
}
.graph .graph-trend-type {
  margin-top: -28px;
  float: right;
}
</style>
