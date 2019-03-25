<template>
    <el-card :class="{runned: taskRunned}">
        <div slot="header" class="clearfix">
            <el-select size="mini" v-model="taskDataForDisplay" placeholder="请选择api">
                <el-option
                    v-for="item in apiList"
                    :key="item.name"
                    :label="item.name"
                    :value="item">
                </el-option>
            </el-select>
            <el-button @click="$emit('delete')" type="text" icon="el-icon-close" style="float: right;"></el-button>
        </div>
        <p>执行次数：{{typeof options.runningTime === 'number' ? options.runningTime : 0}}</p>
        <CodeFragment type="show" :options="taskDataForDisplay" :data="options.params"></CodeFragment> 
    </el-card>
</template>

<script>
import api from '@/utils/apiConfig'
import CodeFragment from '@/components/codeFragment'
export default {
    components: {
        CodeFragment
    },
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            apiList: Object.values(api),
            taskDataForDisplay: {}
        }
    },
    watch: {
        taskDataForDisplay(n, o) {
            this.options.name = n.name
            this.options.value = n.value
        }
    },
    computed: {
        taskRunned() {
            return this.options.runningTime >= 1
        }  
    },
    mounted() {
        const curVal = this.options.value
        if (curVal) {
            this.apiList.forEach(l => {
                if (l.value === curVal) {
                    this.taskDataForDisplay = l
                }
            })
        }
    }
}
</script>

<style scoped>
.el-card {
    margin-top: 20px;
}
.runned {
    background: rgba(0, 255, 0 , .1);
}
</style>
