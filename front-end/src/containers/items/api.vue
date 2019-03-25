<template>
    <el-collapse v-model="activeName" accordion>
      <CodeFragment :options="options"></CodeFragment>  
    </el-collapse>
</template>

<script>
import {getInfo} from '@/fetch'
import api from '@/utils/apiConfig'
import CodeFragment from '@/components/codeFragment'

export default {
  name: 'Panel',
  props: {
    default: {
      type: Object,
      default () {return {}},
      required: false
    }
  },
  computed: {
    options() {
      const sayOptions = api.say;
      Object.keys(this.default).forEach(key => {
        const val = this.default[key];
        const {params} = sayOptions;
        params[key] && (params[key].value = val);
      })
      return sayOptions;
    }
  },
  components: {
    CodeFragment
  },
  data() {
      return {
        activeName: '1',
      };
  }
}
</script>

<style scoped>
.el-collapse {
  border: none;
}
</style>
