<template>
  <div class="process" v-if="token">
    <h3 class="process-tle">
      你好 <span class="userName">{{displayName}}</span>
      <el-tooltip class="item" effect="dark" content="注销" placement="top-start">
        <el-switch
          size="mini"
          v-model="isLogin"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </el-tooltip>      
      <br/>
      欢迎使用微信机器人通知服务。<br/>
      添加机器人为好友后，调用API可使机器人向指定的群／个人发送通知消息。
    </h3>
    <el-collapse accordion>
      <!-- <el-collapse-item :title="`第一步：设置微信账号${finishStep >= 1 ? '（完成）' : ''}`" name="1">
          输入你的微信账号,机器人会自动通过该账号发起的好友申请。
          <el-input size="small" v-model="wxAccount" placeholder="请输入微信账号"></el-input>
          <el-button size="small" @click="setAccount">提交</el-button>
      </el-collapse-item> -->
      <el-collapse-item title="第一步：添加机器人为好友" name="2">
        <div>扫描二维码添加机器人为好友。</div>
        此处为机器人微信账户二维码
        <img style="width: 150px;" src="" alt="qr-code">
      </el-collapse-item>
      <el-collapse-item title="第二步：使用通知功能" name="3">
        <p>将机器人拉进需要通知功能的群里，再调用下面的API试试吧。</p>
        <p>命令行调用：curl --data "to={}&msg={}&token={}" robot.qiwoo.org/robot/say</p>
        <Api :default="defaultAPIOptions"/>
      </el-collapse-item>
    </el-collapse>
  </div>
  <div class="process empty" v-else>
    加载中...
  </div>

</template>

<script>
import {getUserData, setWxAccount, logout} from '@/fetch'
import Api from '../items/api'

export default {
  name: 'Process',
  components: {Api},
  data() {
      return {
        wxAccount: '',
        displayName: '',
        finishStep: 0,
        token: null,
        isLogin: true,
        defaultAPIOptions: {}
      };
  },
  watch: {
    isLogin(n, o) {
      if (!n) {
        logout().then(() => {
          global.location.reload();
        })
      }
    }
  },
  methods: {
    setAccount() {
      setWxAccount({wxAccount: this.wxAccount}).then(({errno}) => {
        let type = errno === 0 ? 'success' : 'error';
        this.$message({
          message: `设置微信账户${errno === 0 ? '成功' : '失败'}`,
          type
        });
      }).catch(() => {
        this.$message({
          message: '设置微信账户失败',
          type: 'error'
        });
      })
    }
  },
  mounted() {
     getUserData().then(({data: {displayName, wxAccount, token}} = {data: {}}) => {
      this.displayName = displayName;
      this.wxAccount = wxAccount || '';
      this.token = token || '';
      this.defaultAPIOptions = {token}
    })
  }
}
</script>

<style>
.process {
  max-width: 700px;
  margin: 10px auto;
}
.process-tle {
  margin: 10px 0;
  line-height: 30px;
}
.process-tle .userName {
  color: #888;
}
.process-tle .el-switch {
  top: -2px;
}
.process .el-input {
  width: auto;
}
.process .finish-step {
  background: rgba(0, 255, 0 , .1);
}
</style>
