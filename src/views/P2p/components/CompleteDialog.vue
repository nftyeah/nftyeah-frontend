<template>
  <el-dialog
          :visible="false"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          center
          width="560px"
          class="listingDialog">
    <div slot="title" class="title">
      Complete your listing
    </div>
    <div class="step nullMargin">
      <span class="tipsTitle">Sign message</span>
      <div class="flex dirRow">
        <span class="tipsText">Sign a message using your wallet to continue.</span>
        <div class="btn center">Sign</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    name: "CompleteDialog",
    ...mapState(["completeShow"]),
    computed: {

    },
    watch: {

    },
    methods:{
      closeDepositModel() {

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