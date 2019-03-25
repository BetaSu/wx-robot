<template>
    <section class="search">
      <section class="search-result">
        <el-table
          size="small"
          :data="data"
          stripe
          style="width: 100%">
          <el-table-column
            prop="displayName"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="userMail"
            label="邮箱"
            width="180">
          </el-table-column>
          <el-table-column
            prop="token"
            label="token">
          </el-table-column>
          <el-table-column
            prop="messageCount"
            sortable
            width="80"
            label="消息数">
          </el-table-column>
        </el-table>
      </section>
        <el-pagination
          layout="prev, pager, next"
          :total="count"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="changePage"
          >
        </el-pagination>
    </section>
</template>

<script>
import {searchUser} from '@/fetch'

export default {
  name: 'ManageUser',
  data() {
      return {
        isSearching: false,
        count: null,
        currentPage: null,
        pageSize: null,
        data: null
      };
  },
  methods: {
    /**
     * page
     * pageSize
     */
    search(data) {
      this.isSearching = true;
      searchUser(data).then(({data: {count, currentPage, pageSize, data}} = {data: {}}) => {
        this.isSearching = false;
        this.count = count;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.data = data;
      }).catch(() => this.isSearching = false)
    },
    changePage(page) {
      this.search({page});
    }
  },
  mounted() {
    this.search();
  }
}
</script>

<style>

</style>
