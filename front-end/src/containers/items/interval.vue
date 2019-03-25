<template>
    <div>
        <el-collapse v-model="activeName" accordion>
            <IntervalFragment v-for="(item, index) in intervalList" :options="item" :index="index" :key="item.id || index"></IntervalFragment>
        </el-collapse>
        <el-button class="add-btn" v-if="!hasUnsavedInterval" @click="addInterval" size="mini" plain>添加</el-button>
    </div>
</template>

<script>
import IntervalFragment from '@/components/intervalFragment'
import {getTask} from '@/fetch'

export default {
  name: 'Interval',
  components: {
    IntervalFragment
  },
  computed: {
      intervalList() {
          return this.$store.state.intervalList
      }
  },
  data() {
      return {
        activeName: '1',
        hasUnsavedInterval: false
      };
  },
  watch: {
    intervalList(n, o) {
        this.hasUnsavedInterval = n.some(interval => {
            return !interval._id
        })
    }
  },
  methods: {
      addInterval() {
          this.$store.commit('addInterval', {
              name: '未保存的任务',
              frequency: null,
              date: null,
              taskList: []
          })
      }
  },
  mounted() {
      getTask().then(({data} = {data: []}) => {
          this.$store.commit('updateIntervalList', data)
      })
  }
}
</script>

<style scoped>
.el-collapse {
  border: none;
}
.add-btn {
    margin-top: 20px;
}
</style>
