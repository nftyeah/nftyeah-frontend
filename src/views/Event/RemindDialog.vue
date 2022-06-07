<template>
  <el-dialog
    :visible="remindDialogShow"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="closeDepositModel"
    center
    width="560px"
    class="remindDialog"
  >
    <div slot="title" class="title">{{type ==2 ?'Edit':'Create'}} reminder</div>
    <div class="content">
      <div class="row">
        <div class="caption">Collection</div>
        <div class="collection">
          <img width="30" height="30" style="border-radius: 50%" :src="selectData.logo" />
          <span>{{selectData.collection}}</span>
        </div>
      </div>

      <div v-if="!selectData.type" class="row">
        <div class="caption">Mint</div>
        <el-checkbox :disabled="selectData.status == 2" v-model="checked">Remind me alter starting mint</el-checkbox>
      </div>

      <div class="row">
        <div class="caption">Floor price</div>
        <el-input class="method" v-model="eventConfig" placeholder="ETH">
        </el-input>
        <img class="eth" src="@/assets/eth.svg" />
      </div>
      <div class="row">
        <div class="caption">Email address</div>
        <el-input class="method" v-model="email" placeholder="Your email address"></el-input>
      </div>
      <div class="row">
        <div class="caption"></div>
        <!-- <div class="tip">The default reminder method is <span>browser push</span> and <span>email</span>.</div> -->
      </div>
    </div>
    <div class="action">
      <div class="btn center cancel" @click="$store.commit('SET_REMINDDIALOGSHOW', false)">Cancel</div>
      <div class="btn center" v-loading="loading.confirm" @click="confirm()">Confirm</div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { postAddNotify, postUpdateNotify } from "@/plugins/request";
export default {
  name: "remindDialog",
  props: ["selectData", "collectionsList"],
  computed: {
    ...mapState(["remindDialogShow", "address","loginSign","userEmail"]),
  },
  watch: {
    eventType() {
      if(this.eventType == 2) {
        this.eventConfig = "";
      }
    },
    remindDialogShow() {
      console.log(this.selectData)
      if (this.remindDialogShow) {
        if (this.selectData) {
          if (this.selectData.product_id) {
            console.log("edit")
            this.type = 2;
            this.productId = this.selectData.product_id
            this.eventType = this.selectData.event_type
            this.eventConfig = this.selectData.event_config
            this.email = this.selectData.e_mail
          } else {
            console.log("create")
            this.type = 1;
            this.productId = this.selectData.id;
            this.eventType = 1;
            this.eventConfig = "";
            this.email = this.userEmail;
          }
        }
      }
    }
  },
  data: () => ({
    type: 1,
    checked:false,
    reminderEvent: [
      {
        value: 1,
        label: "Floor price",
      },
      {
        value: 2,
        label: "Mint",
      },
    ],
    reminderValue: "0",
    email: "",
    productId: "",
    eventType: "",
    eventConfig: "",
    loading:{
      confirm: false
    }

  }),
  mounted() {

  },
  methods: {
    ...mapActions(["loginSignCall"]),
    async confirm() {
      if(!this.address) {
        this.$notify({
          title: 'prompt',
          message: 'Connect Wallet',
          type: 'error',
          duration: 3000
        });
        return;
      }
      if(!this.loginSign){
        const r = await this.loginSignCall();
        if (!r) {
          return;
        }
      }

      if (this.checked) {
        this.eventType = 3;
      }
      let obj = {
        id: this.productId,
        e_mail: this.email,
        product_id: this.productId,
        event_type: this.eventType,
        event_config: this.eventConfig,
        user_address: this.address,
        sign:this.loginSign
      };
      this.loading.confirm = true;
      let post = this.type == 1 ? postAddNotify(obj) : postUpdateNotify(obj)
      console.log(post)
      const e = await post;
      this.loading.confirm = false;
      console.log(e)
      if (e && e.code && !e.code !== 1) {
        this.$notify({
          title: 'prompt',
          message: e.message,
          type: 'error',
          duration: 3000
        });
        return;
      }

      this.$store.commit('SET_REMINDDIALOGSHOW', false)
      this.$emit("remindRefresh")
    },
    closeDepositModel() {
      this.$store.commit("SET_REMINDDIALOGSHOW", false);
    },
  },
};
</script>

<style lang="sass" scoped>
$Tahoma-Bold: Tahoma-Bold
$Tahoma: Tahoma

.remindDialog
  .title
    color: #222222
    font-weight: bold
    font-family: $Tahoma-Bold
    font-size: 20px
  .line
    border-bottom: 1px solid #EEEEEE
  .content
    .row:last-child
      margin-bottom: 30px
    .row
      display: flex
      align-items: center
      margin-bottom: 24px
      .eth
        width: 18px
        position: absolute
        right: 40px
      .caption
        width: 150px
      .collection
        display: flex
        align-items: center
        span
          margin-left: 10px
      .el-autocomplete
        width: 100%
        flex: 1
      .value
        flex: 1
      .price
        margin-left: 10px
        width: 130px
      .method
        flex: 1
      .tip
        margin-top: -10px
        font-size: 13px
        color: #777777
        span
          color: #A86BFE
  .action
    display: flex
    justify-content: center
    .cancel
      color: #725DFF !important
      border: 1px #725DFF solid
      background: transparent
    .btn
      color: #FFF 
      margin: 0 10px
</style>