<template>
    <el-collapse-item v-if="type === 'call'" :title="options.name" name="code1">
        <div v-if="options.url">请求url: {{options.url}}</div>
        <div v-if="options.type">请求类型: {{options.type}}</div>
        <div v-for="(val, key) in options.params" :key="key">{{key}}: {{val.name}}<input v-model="options.params[key].value" class="try-input" type="text"></div>
        <el-button :loading="reqLoading" size="mini" @click="callUrl" class="try-btn">发送请求</el-button>
        <div class="response">{{response}}</div>
    </el-collapse-item>
    <div v-else>
        <div v-for="(val, key) in options.params" :key="key">{{key}}: {{val.name}}<input v-model="data[key]" class="try-input" type="text"></div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    props: {
        options: {
            type: Object,
            required: true
        },
        data: {
            type: Object,
            default() {
                return {}
            }
        },
        type: {
            type: String,
            // show 展示用 / call 调用用
            default: 'call'
        }
    },
    computed: {
        validateAPIIndex() {
            return this.$store.state.validateAPIIndex
        }
    },
    watch: {
        validateAPIIndex() {
            if (!this.options || !this.options.params) return
            this.validate()
        }
    },
    data() {
        return {
            extraOptionsVal: {},
            response: null,
            reqLoading: false
        }
    },
    methods: {
        validate() {
            let needFillIn
            Object.keys(this.options.params).forEach(oName => {
                const curOp = this.options.params[oName]
                const curVal = curOp.value || this.data[oName]
                if (curOp.required && !curVal) {
                    return needFillIn = oName
                }
            })
            if (needFillIn) {
                this.$message({
                    message: `${this.options.name} ${needFillIn}是必填字段`,
                    type: 'warning'
                });
                this.$store.commit('updateValidateApiResult', false)
                return false
            }
            this.$store.commit('updateValidateApiResult', true)
            return true
        },
        callUrl() {
            if (!this.validate()) return
            this.response = null;
            const reqData = {}
            const reqType = this.options.type
            Object.keys(this.options.params).forEach(oName => {
                const curOp = this.options.params[oName]
                const curVal = curOp.value
                reqData[oName] = curVal
            })  
            if (reqType === 'get') {
                reqData = {
                    params: reqData
                }
            }
            this.reqLoading = true
            return axios[reqType](this.options.url, reqData).then(res => {
                this.reqLoading = false
                try {
                    this.response = JSON.stringify(res)
                } catch(e) {
                    this.response = '返回数据出错，请在控制台查看'
                }
            }).catch(e => {
                this.reqLoading = false
                try {
                    this.response = JSON.stringify(e)
                } catch(e) {
                    this.response = '返回数据出错，请在控制台查看'
                }
            })
        }
    }
}
</script>

<style scoped>
.try-input {
  margin-right: 2px;
  float: right;
}
.try-btn {
    margin-right: 2px;
    float: right;
}
.response::before {
    display: block;
    content: '';
    clear: both;
}
</style>
