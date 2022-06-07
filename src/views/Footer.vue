<template>
  <div class="footer">
    <div class="footerContent">
      <div class="footerInformation">
        <div class="subscription">
          <div>
            <p class="title">Stay in the loop</p>
            <p class="tip"
              >Subscribe to stay in the loop with our newest feature releases, and floor price reminders.</p
            >
          </div>
          <div class="form">
            <input type="text" v-model="e_mail" placeholder="Your email address" />
            <div class="btn center subscribe" @click="subscribe">Subscribe</div>
          </div>
        </div>
        <div class="media">
          <div>
            <a href="https://twitter.com/NFTYeah_" target="_blank"><i class="iconfont icon-twitter"></i></a>
            <!--<a href="" target="_blank"><i class="iconfont icon-telegram"></i></a>-->
            <a href="https://discord.gg/2fcp6uwTuZ" target="_blank"><i class="iconfont icon-discord"></i></a>
            <a href="https://medium.com/@NFTYeah" target="_blank"><i class="iconfont icon-medium"></i></a>

            <!--<a href="" target="_blank"
              ><i class="iconfont icon-instagram"></i
            ></a>
            <a href="" target="_blank"><i class="iconfont icon-youtube"></i></a>-->
          </div>
          <div class="line"></div>
          <div class="reserved">©2021 NFTYeah-All rights reserved</div>
        </div>
      </div>
      <!-- <div class="footerBar">
        <div>Dynamic reminder and P2P transactions for NFTs</div>
        <div>©2021 NFTYeah-All rights reserved</div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState,mapActions } from "vuex";
import { postAddEmail } from "@/plugins/request";
import { web3Send } from "@/plugins/contracts"
export default {
  name: "Layout",
  components: {},
  computed: {
    ...mapState(["address","loginSign"]),
  },
  data: () => ({
    web3Send,
    e_mail: ""
  }),
  methods: {
    ...mapActions(["loginSignCall"]),
    async subscribe() {
      const regExp =/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!regExp.test(this.e_mail)) {
        this.$notify({
          title: 'prompt',
          message: 'invalid email address',
          type: 'error',
          duration: 3000
        });
        return;
      }
      if(!this.address){
        return
      }
      if(!this.loginSign){
        const r = await this.loginSignCall();
        if (!r) {
          return;
        }
      }
      let obj = {
        user_address: this.address,
        e_mail: this.e_mail,
        sign:this.loginSign
      };
      postAddEmail(obj).then(e => {
        this.$notify({
          title: 'success',
          type: 'success'
        });
      }).catch(err => {
        this.$notify({
          title: 'error',
          type: 'error'
        });
      })
    }
  },
};
</script>

<style lang="sass">
$font: #222222
$font-tip: #999999
.footer
  width: 100%
  height: 227px
  background: #FFF
  .footerContent

    max-width: 1220px
    margin: 0 auto

  .footerInformation
    width: 100%
    margin-top: 30px
    margin-bottom: 30px
    display: flex
    .subscription
      
      .title
        font-size: 20px
        color: $font
      .tip
        margin-top: 10px
        font-size: 14px
        color: $font-tip
      .form
        margin-top: 17px
        display: flex
        input
          width: 100%
          height: 42px
          border: 1px solid #DDDDDD
          border-radius: 4px
          padding: 0 16px
          font-size: 14px
        input::-webkit-input-placeholder
          color: #999
        input:focus
          outline: none 
          border: 1px solid #725DFF
        .subscribe
          height: 44px
          font-size: 16px
          color: #FFF
          margin-left: 12px
    .media
      flex: 1
      text-align: right
      display: flex
      align-items: flex-end
      flex-direction: column
      .iconfont
        font-size: 30px
        margin-left: 30px
        color: #D8D3DE
      .iconfont:hover
        color: #725DFF
      a
        text-decoration: none
      .line
        margin-top: 30px
        width: 30px
        height: 2px
        background: #DDDDDD
        border-radius: 1px
      .reserved
        color: #999999
        font-size: 14px
        margin-top: 12px
  .footerBar
    font-size: 14px
    height: 60px
    display: flex
    align-items: center
    justify-content: space-between
    margin-top: 34px
    border-top: 1px #EEEEEE solid
    color: #999999
</style>
