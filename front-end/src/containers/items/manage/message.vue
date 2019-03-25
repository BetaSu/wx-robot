<template>
    <section class="search">
      <div class="search-table">
        <el-select size="small" v-model="searchOptions.condition" style="width:110px;" slot="prepend" placeholder="查询条件">
            <el-option
              v-for="(val, key) in searchConditions" 
              :key="key"
              :label="key"
              :value="val">
            </el-option>
          </el-select>
          <el-input
            size="small"
            placeholder="请输入内容"
            style="width:auto"
            v-model="searchOptions.value">
          </el-input>
       
        <el-date-picker
          size="small"
          style="width:230px;" 
          slot="append"
          v-model="searchOptions.date"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button
          size="small"
          icon="el-icon-search" 
          circle
          @click="search" 
          :disabled="!searchOptions.value || !searchOptions.condition"
          :loading="isSearching"></el-button>
      </div>
      <section class="search-result" v-if="data">
        <el-table
          size="small"
          :data="data"
          stripe
          style="width: 100%">
          <el-table-column
            prop="display"
            label="来自"
            width="190">
          </el-table-column>
          <el-table-column
            prop="date"
            sortable
            width="170"
            :formatter="dateFormat"
            label="发送时间">
          </el-table-column>
          <el-table-column
            prop="to"
            label="目标">
          </el-table-column>
          <el-table-column
            prop="content"
            width="200"
            label="内容">
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :total="count"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="changePage"
          >
        </el-pagination>
      </section>
    </section>
</template>

<script>
import {searchMessage} from '@/fetch'

export default {
  name: 'ManageUser',
  data() {
      return {
        count: null,
        currentPage: null,
        pageSize: null,
        data: null,
        searchOptions: {
          condition: null,
          value: null,
          date: []
        },
        isSearching: false,
        searchConditions: {
          '邮箱': 'userMail',
          'token': 'token',
          '用户名': 'displayName'
        }
      };
  },
  methods: {
    dateFormat(_, __, cellValue) {
      return new Date(cellValue).toLocaleString();
    },
    changePage(page) {
      this.search(null, page);
    },
    search(_, page = 1) {
      const {condition, value, date:[from, to]} = this.searchOptions;
      this.isSearching = true;
      const options = {from, to, page};
      options[condition] = value;
      searchMessage(options).then(({data: {count, currentPage, pageSize, data}} = {data: {}})  => {
        this.count = count;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        data.forEach((msg, i) => {
          const {displayName, userMail} = msg;
          let display = displayName;
          if (!displayName) {
            display = userMail.split('@')[0];
          }
          msg.display = display + `（${userMail}）`;
        })
        this.data = data;
        this.isSearching = false;
      }).catch(() => this.isSearching = false)
    }
  },
  mounted() {
    this.search(null, 1);
  }
}
</script>

<style>

</style>
