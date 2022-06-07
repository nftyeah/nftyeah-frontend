<template>
  <el-dialog
          :visible="reservedShow"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          center
          :before-close="closeDepositModel"
          width="560px"
          class="listingDialog">
    <div slot="title" class="title">
      This listing is reserved for
    </div>
    <div class="step nullMargin">
      <div class="flex dirRow">
        <span class="tipsText">{{item.taker}}</span>
        <div class="btn center" @click="closeDepositModel">OK</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    name: "ReservedDialog",
    props:{
      item: {},
    },
    computed: {
      ...mapState(["reservedShow"])
    },
    methods:{
      closeDepositModel() {
        this.$store.commit('SET_RESERVEDSHOW', false);
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
      font-size: 14px
      font-family: $Tahoma
      color: #777777
      line-height: 21px
    .btn
      font-family: $Tahoma
      color: #ffffff
      font-weight: 400
      font-size: 16px
      height: 40px
      width: 120px
    .dirRow
      align-items: center
      flex-direction: row
      justify-content: space-between
    .flex
      display: flex
  .nullMargin
    margin-top: 0
</style>