<template>
  <div class="connectWallet center">
    <div class="connectBtn" @click="connect">
      <img class="icon-metamask" src="@/assets/metamask.svg" alt="">
      <div class="metamask">
        <p>METAMASK</p>
        <p>Connect your wallet.</p>
      </div>
      <i class="iconfont icon-jump-arrow"></i>
    </div>
    <div class="not">I don’t have a wallet.</div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ConnectWallet",
  components: {},
  computed: {},
  data: () => ({}),
  methods: {
      ...mapActions(["getEthereumAddress"]),
      connect () {
          this.getEthereumAddress()
      }
  },
};
</script>

<style lang="sass">
.connectWallet
    width: 100%
    height: 100%
    background: linear-gradient(45deg, #ede2fd 0%, #f8f5ff 30%, #faf9ff 100%)
    flex-direction: column
    .connectBtn
        width: 480px
        height: 120px
        background: linear-gradient(90deg, #A86BFE 0%, #725DFF 100%)
        box-shadow: 0px 2px 10px 0px rgba(221, 221, 221, 0.2)
        border-radius: 10px
        display: flex
        justify-content: center
        align-items: center
        cursor: pointer
        .icon-metamask
            font-size: 60px
            margin-right: 30px
        .metamask
            margin-right: 100px
            color: #FFF
            font-family: Tahoma

            p:nth-child(1)
                font-size: 25px
                letter-spacing: 5px
            p:nth-child(2)
                font-size: 14px
        .icon-jump-arrow
            font-size: 50px
            color: #FFF
    .not
        margin-top: 18px
        color: #999
</style>
