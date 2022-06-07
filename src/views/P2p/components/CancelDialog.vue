<template>
  <el-dialog
          :visible="cancelShow"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          center
          width="560px"
          :before-close="closeDepositModel"
          class="listingDialog">
    <div slot="title" class="title">
      Complete your listing
    </div>
    <div class="step nullMargin">
      <div class="flex dirRow">
        <span class="tipsText">Are you sure you want to cancel your listing</span>
        <div class="btn center" v-loading="loading.confirm" @click="confirm()">Confirm</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { cancelOrder } from "./common"
  import { mapState } from "vuex";

  export default {
    name: "CancelDialog",
    computed: {
      ...mapState(["cancelShow","yeahProxyRegistry","yeahExchange","address","refresh"]),
    },
    props:{
      item: {},
    },
    data(){
      return {
        loading: {
          confirm: false
        }
      }
    },
    methods:{
      async confirm() {
        this.loading.confirm = true;
        console.log(this.item);
        const r = await cancelOrder(this.yeahExchange,this.address,this.item);
        console.log(r);
        if(r){

          this.item.status = 0;
          this.item.listingTime = null;
          this.item.listingTimeParam = null;
          this.item.expirationTime = null;
          this.item.expirationTimeParam = null;
          this.$notify({
            title: 'prompt',
            message: 'Cancel Success',
            type: 'success',
            duration: 3000
          });
          this.closeDepositModel();
        }
        this.loading.confirm = false;

      },
      test(){
        this.$notify({
          title: 'prompt',
          message: 'Cancel',
          duration: 3000
        });
      },
      closeDepositModel(){
        this.$store.commit('SET_CANCELSHOW', false)
      }
    }
  }
</script>

<style lang="sass" scoped>
  $Tahoma-Bold: Tahoma-Bold
  $Tahoma: Tahoma

.listingDialog
  .title
    color: #222222
    font-weight: bold
    font-family: $Tahoma-Bold
    font-size: 20px
  .line
    border-bottom: 1px solid #EEEEEE
  .step
    margin-top: 30px
    font-family: $Tahoma
    .tipsTitle
      color: #222222
      font-weight: 400
      font-size: 16px
    .tipsText
      max-width: 344px
      word-break: break-word
      padding-top: 17px
      padding-bottom: 25px
      font-size: 14px
      font-family: $Tahoma
      color: #777777
      line-height: 21px
    .btn
      font-family: $Tahoma
      color: #ffffff
      font-weight: 400
      font-size: 16px
      margin-top: 17px
      height: 40px
      width: 120px
    .dirRow
      align-items: flex-start
      flex-direction: row
      justify-content: space-between
    .flex
      display: flex
  .nullMargin
    margin-top: 0
</style>