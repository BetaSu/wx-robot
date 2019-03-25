<template>
    <div class="manage">
      <section class="manage-overview">
      </section>
      <el-radio-group v-model="manageWhat" size="medium" class="manage-type">
        <el-radio-button label="user">用户</el-radio-button>
        <el-radio-button label="message">消息</el-radio-button>
        <el-radio-button label="graph">统计</el-radio-button>
      </el-radio-group>
      <User v-if="manageWhat === 'user'"></User>
      <Message v-if="manageWhat === 'message'"></Message>
      <Graph v-if="manageWhat === 'graph'"></Graph>
    </div>
</template>

<script>
import {searchMessage} from '@/fetch'
import User from './user'
import Message from './message'
import Graph from './graph'

export default {
  name: 'Manage',
  components: {
    User, Message, Graph
  },
  data() {
      return {
        isCollapse: true,
        manageWhat: 'user',
        searchOptions: {
          condition: null,
          date: null
        },
        isSearching: false,
        searchConditions: {
          '邮箱': 'mailname',
          'token': 'token',
          '用户名': 'displayname'
        }
      };
  },
  methods: {
    search() {
      const {condition, date:[from, to]} = this.searchOptions;
      this.isSearching = true;
      searchMessage({
        condition,
        from,
        to
      }).then(res => {
        console.warn('r', res);
        this.isSearching = false;
      }).catch(() => this.isSearching = false)
    }
  }
}
</script>

<style>
.manage-overview {
  margin: 20px 0;
  color: #909399;
  overflow: hidden;
}
.manage-overview p {
  float: left;
  margin-right: 20px;
}
.manage-type {
  margin: 0 0 20px 0;
}
</style>
