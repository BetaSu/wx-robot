<template>
  <div class="wrapper">
    <section class="dialog">
      <VueQrcode v-if="info.status === 'showQrcode'" class="qrcode" tag="img" :value = "info.qrcode"></VueQrcode> 
      <img class="avatar" v-if="info.status === 'showAvatar'" :src="info.avatar" alt="avatar">
      <h3 class="title">{{title}}</h3>
      <p class="warning"><i class="el-icon-warning"></i>17年以后注册的微信账号可能无法登录</p>
      <el-button v-if="showRestartBtn" class="restart" plain @click="restart">重新获取二维码</el-button>
    </section>
    <Bkg></Bkg>
  </div>
</template>
<script>

import VueQrcode from '@xkeshi/vue-qrcode'
import Bkg from './bkg'
import {getInfo, restartBot} from '@/fetch'

export default {
  name: 'Panel',
  props: {
    info: {
      type: Object,
      required: false,
    }
  },
  components: {
    VueQrcode, Bkg
  },
  data() {
    return {
      interval: null,
      showRestartBtn: true
    }
  },
  computed: {
    title () {
      if (!this.info) return
      if (this.info.status === 'showQrcode') return '扫描二维码登录微信'
      if (this.info.status === 'showAvatar') return '手机确认登录'
    }
  },
  methods: {
    restart() {
      setTimeout(() => {
        this.showRestartBtn = true
      }, 1000 * 60);
      this.showRestartBtn = false
      return restartBot()
    },
    refresh() {
      getInfo().then(res => {
        if (res.errno === 0) {
        this.$store.commit('UPDATE_INFO', res.data)
        }
      })
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.refresh(true)
    }, 2000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style scoped>
.wrapper {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.dialog {
  position: relative;
  left: 50%;
  top: 50%;
  width: 50%;
  max-width: 330px;
  max-height: 400px;
  height: 60%;
  padding: 20px;
  padding-top: 40px;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  text-align: center;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 10px #999;
  -moz-box-shadow: #999 0 2px 10px;
  -webkit-box-shadow: #999 0 2px 10px;
}
.title {
  margin: 25px 0 20px;
}
.warning {
  color: #e6a23c;
  margin-top: 10px;
}
.warning i {
  padding-right: 5px;
}
.cp-qr-container h3 {
  text-align: center;
  color: #606266;
}
.qrcode, .avatar {
  width: 80%;
  height: auto;
  float: none;
}
.refresh {
  margin-top: 10%;
}
.restart {
  margin-top: 15px;
}
</style>
