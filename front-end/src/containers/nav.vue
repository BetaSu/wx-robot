<template>
	<el-menu :default-active="activeIndex" mode="horizontal" :router="true" @select="handleSelect">
			<el-menu-item index="/d/api">接口调用</el-menu-item>
			<el-menu-item index="/d/interval">定时任务</el-menu-item>
			<el-menu-item index="/d/manage">数据管理</el-menu-item>
	</el-menu>
</template>

<script>
export default {
	data() {
		return {
			activeIndex: '/d/api'
		};
	},
	methods: {
		handleSelect(key) {
			this.activeIndex = key
			this.$router.push(`${key}`)	
		}
	},
	mounted() {
		this.activeIndex = this.$route.name;
	}
}
</script>

<style>
.el-menu {
	margin: 0 20px;
}
</style>
