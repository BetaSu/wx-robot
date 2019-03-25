<template>
  <el-aside>
      <img class="avatar" v-if="detail.avatar" :src="`data:image/png;base64,${detail.avatar}`" alt="avatar">
      <p class="name">{{detail.name}}</p>
  </el-aside>
</template>

<script>
import {getDetail} from '@/fetch'

export default {
  name: 'Left',
  components: {
    
  },
  computed: {
    detail() {
      return this.$store.state.detail
    }
  },
  data() {
      return {
        
      };
  },
  mounted() {
    getDetail().then(res => {
      res.data && this.$store.commit('UPDATE_DETAIL', res.data)
    })
  }
}
</script>

<style>
.avatar {
  display: block;
  width: 50%;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.name {
  text-align: center;
  margin-top: 10px;
  color: #909399;
}
</style>
