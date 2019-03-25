<template>
  <el-header>
      <img class="avatar" v-if="detail.avatar" :src="`data:image/png;base64,${detail.avatar}`" alt="avatar">
      <p class="name">{{detail.NickName}}</p>
      <el-tooltip content="注销登录" placement="top">
        <el-switch
          class="statusSwitch"
          style="margin:8px 0 10px 10px;"
          v-model="loginStatus"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="doLogout"
          >
        </el-switch>
      </el-tooltip>
      <p class="sig">{{detail.Signature}}</p>
  </el-header>
</template>

<script>
import {getDetail, robotLogout} from '@/fetch'

export default {
  name: 'Left',
  computed: {
    detail() {
      return this.$store.state.detail
    }
  },
  data() {
      return {
        loginStatus: true
      };
  },
  methods: {
    doLogout() {
      robotLogout().then(() => {
        location.reload()
      })
    }
  },
  mounted() {
    getDetail().then(res => {
      res.data && this.$store.commit('UPDATE_DETAIL', res.data)
    })
  }
}
</script>

<style>
.el-header {
  padding-top: 10px;
}
.avatar {
  float: left;
  width: 50px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 25px;
}
.name {
  margin: 10px 0 7px 0;
  color: #909399;
  float: left;
}
.sig {
  font-size: 10px;
  margin-bottom: 5px;
}
</style>
