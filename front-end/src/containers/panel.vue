<template>
  <el-container
    direction="vertical"
  >
    <Top></Top>
    <Nav></Nav> 
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import {getInfo} from '@/fetch'
import Top from './top'
import Nav from './nav'

export default {
  name: 'Panel',
  components: {
    Top, Nav
  },
  computed: {
  },
  data() {
      return {
        activeName: '1',
        sayOptions: {
          name: '发送消息 API',
          type: 'post',
          url: `${location.protocol}//${location.host}/robot/say`,
          to: {
            name: '目标名称',
            required: true
          },
          msg: {
            name: '消息内容',
            required: true
          },
          token: {
            name: '校验码',
            required: true
          }
        }
      };
  },
  mounted() {
  }
}
</script>

<style scoped>
.el-main {
  padding-top: 0;
}
</style>
