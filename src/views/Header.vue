<template>
  <div class="header">
    <div class="headerContent">
      <img @click="home()" class="logo" src="@/assets/NFTYeah_logo.svg" alt="" />
      <span class="title">Dynamic reminder and P2P transactions for NFTs</span>
      <nav>
        <div
          :class="item.active ? 'navItemActive center' : 'navItem center'"
          v-for="(item, i) in menu"
          :key="i"
          @click="changeItem(item)"
        >
          {{ item.name }}
        </div>
      </nav>
      <div v-if="address" class="btn center address">
        <el-dropdown @command="handleCommand">
          <p style="color: #725dff;">{{ hiddenAddress(address) }}</p>
          <el-dropdown-menu slot="dropdown" style="margin-right: -23px;margin-top: 10px;width: 122px">
            <el-dropdown-item disabled>
              <div style="display: flex;align-items: center;color: #606266">{{userBalance}}<img width="15" height="28" class="eth" src="@/assets/eth.svg" /></div>
            </el-dropdown-item>
            <el-dropdown-item >
              <div style="background: #EEEEEE; width: 84px; height: 1px;margin-top:10px;margin-bottom: 10px"></div>
            </el-dropdown-item>
            <el-dropdown-item command="2">
              Activity
            </el-dropdown-item>
            <el-dropdown-item command="3">
              Disconnect
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
      <div v-if="!address" class="btn center connect" @click="connectWallet()">
        Connect
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { hiddenAddress } from "@/plugins/tools";
import OneSignalVue from 'onesignal-vue';
export default {
  name: "Header",
  components: {},
  computed: {
    ...mapState(["address","userBalance"]),
  },
  watch: {
    address() {

      this.$OneSignal.showSlidedownPrompt()
      this.$OneSignal.setExternalUserId(this.address)
      },
      $route() {
        this.routeClick();
      },
  },
  data: () => ({
    menu: [
      {
        name: "Reminder",
        router: "/reminder",
        routerArr:["reminder"],
        active: false,
      },
      /*{
        name: "Event",
        router: "/event",
        active: false,
      },*/
      {
        name: "P2P",
        router: "/p2p",
        routerArr:["p2p","nftDetail"],
        active: false,
      },
      /*{
        name: "Activity",
        router: "/activity",
        active: false,
      },*/
    ],
    connect: "Connect",
    hiddenAddress,
  }),
  mounted() {
    this.menu[0].active = true;
    this.menu.map(e => {
        if (this.$route.path == e.router) {
          this.changeItem(e)
        }
      })
      this.routeClick();
  },
  methods: {
    ...mapActions(["getEthereumAddress"]),
    changeItem(item) {
      this.$router.push(item.router);
      this.menu.map((e) => (e.active = false));
      item.active = true;
    },
    connectWallet() {
      this.getEthereumAddress();
    },
    home(){
      this.$router.push('/');
    },
    routeClick() {
      console.log(this.$route)
      let path = this.$route.path;
      this.menu[0].active = true;
      this.menu.map((e) => (e.active = false));
      this.menu.map((e) => {
          e.routerArr.map(o => {
            if(path.indexOf(o) > -1){
              e.active = true;
            }
            // if(path === "/") {
            //   this.menu[0].active = true;
            // }
          })
        });

    },
    handleCommand(command) {
      if(command == 2){
        this.$router.push('/activity')
      }

      if(command == 3){
        this.$store.commit('SET_ADDRESS', null);
      }

    }
  },
  beforeCreate() {
   
  }
};
</script>

<style lang="sass">
$font: #222222
$header_color: #725DFF
.center
    display: flex
    align-items: center
    justify-content: center
.btn
    width: auto
    min-width: 120px
    height: 40px
    background: linear-gradient(90deg, #A86BFE 0%, #725DFF 100%)
    border-radius: 4px
    cursor: pointer
.header
    width: 100%
    background-color: #FFF
    position: fixed
    top: 0
    z-index: 1001
    box-shadow: 0px 2px 10px 0px rgba(221, 221, 221, 0.2)
    .headerContent
        height: 80px
        max-width: 1220px
        margin: 0 auto
        -moz-user-select: none
        -webkit-user-select: none
        -ms-user-select: none
        -khtml-user-select: none
        user-select: none
        display: flex

        align-items: center
        .title
          padding-left: 21px
          width: 100%
          color: #999999
          font-size: 14px
          font-family: Tahoma
        .logo
            cursor: pointer
            width: 220px
            height: 44px
        nav
            width: 100%
            display: flex
            justify-content: end
            div
                width: 120px
                font-weight: bold
                cursor: pointer
                text-align: center

            .navItem
                color: $font
            .navItem:hover
                color: $header_color
            .navItemActive
                color: $header_color
        .connect
            color: #FFF
            font-size: 16px
        .address
            color: #725DFF
            font-size: 16px
            font-weight: 400
            border: 1px #725DFF solid
            background: transparent
</style>
