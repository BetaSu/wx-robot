<template>
    <el-collapse-item :title="options.name" :name="index">
        <el-select size="mini" v-model="options.frequency" placeholder="频率">
            <el-option
                v-for="item in fre"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <template v-if="options.frequency === 'once'">
            <el-date-picker
                size="mini"
                v-model="options.date"
                type="datetime"
                placeholder="任务执行时间">
            </el-date-picker>
        </template> 
        <template v-if="options.frequency === 'everytime'">
            <el-select size="mini" v-model="options.week" placeholder="周几">
                <el-option
                    v-for="item in week"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-time-picker
                size="mini"
                v-model="options.date"
                placeholder="具体时间">
            </el-time-picker>
        </template>
        <ul>
            <TaskItem v-for="item in options.taskList" @delete="deleteTask(item._id)" :options="item" :key="item._id"></TaskItem>    
        </ul>
        <el-button class="add-btn" @click="addTask" size="mini" plain>添加任务</el-button>
        <el-button-group class="add-btn save-btn">
            <el-button  :loading="saving" @click="saveTask" size="mini" type="success" plain>保存</el-button>
            <el-button v-if="options._id" @click="deleteItem(options._id)" size="mini" type="danger" plain>删除</el-button>
        </el-button-group>
    </el-collapse-item>
</template>

<script>
import TaskItem from './task'
import {createTask, delTask, setTask} from '@/fetch'
export default {
    components: {
        TaskItem
    },
    props: {
        options: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            fre: [
                {
                    value: 'once',
                    label: '一次'
                },
                {
                    value: 'everytime',
                    label: '每次'
                }
            ],
            week: [
                {
                    value: 1,
                    label: '周一'
                },
                {
                    value: 2,
                    label: '周二'
                },
                {
                    value: 3,
                    label: '周三'
                },
                {
                    value: 4,
                    label: '周四'
                },
                {
                    value: 5,
                    label: '周五'
                },
                {
                    value: 6,
                    label: '周六'
                },
                {
                    value: 0,
                    label: '周天'
                }
            ],
            saving: false
        }
    },
    methods: {
        addTask() {
            this.options.taskList.push({
                type: 'api',
                name: null,
                params: {},
                _id: `task-${Math.floor(Math.random() * 10000)}`
            })
        },
        deleteItem(id) {
            this.$confirm(`是否删除任务 ${this.options.name}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delTask(id).then(() => {
                    this.$store.commit('delInterval', id)
                    this.$message('删除成功');
                }).catch(() => {
                    this.$message({
                        message: '删除定时任务失败',
                        type: 'warning'
                    });
                })
            }).catch(() => {});
        },
        deleteTask(id) {
            let index
            this.options.taskList.some((task, i) => {
                if (task._id === id) {
                    index = i
                    return true
                }
            })  
            if (typeof index === 'number') {
                this.options.taskList.splice(index, 1)
            }
        },
        saveTask() {
            const data = this.options
            if (!data.frequency) return this.$message.warning('请填写频率')
            if (data.frequency === 'everytime' && !data.week) return this.$message.warning('请选择星期')
            if (!data.date) return this.$message.warning('请填写时间')
            if (!data.taskList.length) return this.$message.warning('请添加至少一个任务')
            if (data.taskList.some(task => {
                if (!task.params) return this.$message.warning('请选择要执行的任务')
            })) {
                return
            }
            this.$store.commit('doValidateApi')
            setTimeout(() => {
               if (!this.$store.state.validateAPIResult) return
                console.log(this.options);
                this.$prompt('为定时任务设置名称', '设置', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: data.name,
                    inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                    inputErrorMessage: '名称格式不正确'
                }).then(({ value }) => {
                    this.saving = true
                    this.options.name = value;
                    return this.options._id ? setTask(this.options) : createTask(this.options)
                }).then(data => {
                    this.saving = false
                    if (!data.errno) {
                        if (data._id) {
                            this.options._id = data._id
                        }
                        this.$message('保存成功');
                    } else {
                        this.$message.error(data.errmsg);
                    }
                }).catch(e => {
                    console.warn('err!!!', e);
                    this.saving = false
                }) 
            });
        }
    }
}
</script>

<style scoped>
.taskname {
  display: block;
  font-size: 15px;
  margin: 0 0 20px;
  border: none;
  outline: none;
}
.add-btn {
  display: block;
  margin-top: 20px;
}
.save-btn {
  margin-left: 0;
}
</style>
