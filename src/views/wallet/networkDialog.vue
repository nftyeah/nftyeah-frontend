<template>
  <el-dialog
    :visible="networkDialogShow"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="closeNetworkModel"
    center
    width="560px"
    class="networkDialog"
  >
    <div slot="title" class="title">Please witch to Ethereum network</div>
    <div class="content">
      <p>In order to trade items, please switch to <span>Ethereum network</span> within your MetaMask wallet.</p>
    </div>
    <div class="action">
      <div class="btn center" @click="$store.commit('SET_NETWORKDIALOGSHOW', false)">Cancel</div>
      <div class="btn center" @click="checkEthereum()">OK</div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "remindDialog",
  props: [],
  computed: {
    ...mapState(["networkDialogShow","network"]),
  },
  watch:{
    network(){
      if (this.network == '1') {
        this.closeNetworkModel();
      }
    },
  },
  data: () => ({
    
  }),
  methods: {
    confirm () {

      this.$notify({
        title: 'prompt',
        message: 'Please switch to ETH Mainnet',
        type: 'warning',
        duration: 3000
      });
    },
    async checkEthereum() {
      await ethereum.request({
      "id": 1,
      "jsonrpc": "2.0",
      "method": "wallet_switchEthereumChain",
      "params": [
        {
          "chainId": "0x1",
        }
      ]
    })
    .catch()
    },
    closeNetworkModel() {
      this.$store.commit("SET_NETWORKDIALOGSHOW", false);
    },
  },
};
</script>

<style lang="sass" scoped>
$Tahoma-Bold: Tahoma-Bold
$Tahoma: Tahoma

.networkDialog
  .title
    color: #222222
    font-weight: bold
    font-family: $Tahoma-Bold
    font-size: 20px
  .line
    border-bottom: 1px solid #EEEEEE
  .content
    margin-bottom: 20px
    span
      color: #725DFF
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