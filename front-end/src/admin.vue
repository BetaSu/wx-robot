<template>
  <div id="app" class="d">
    <Qrcode v-if="info.status && info.status!=='login'" :info="info"></Qrcode>
    <Panel v-if="info.status==='login'"></Panel>
  </div>  
</template>

<script>
import {getInfo} from '@/fetch'
import Qrcode from '@/containers/qrcode'
import Panel from '@/containers/panel'
export default {
  name: 'Index',
  components: {
    Qrcode, Panel
  },
  computed: {
    info() {
      return this.$store.state.info
    }
  },
  mounted() {
    getInfo().then(({errno, data}) => {
      if (errno === 0) {
        this.$store.commit('UPDATE_INFO', data)
      }
    })
  }
}
</script>

<style>
.d {
  max-width: 700px;
  margin: 0 auto;
}
</style>
