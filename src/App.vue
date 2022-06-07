<template>
  <div class="main">
    <div class="slogan" v-if="slogan">
    </div>
    <Layout v-if="reload && !slogan" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getChainId } from "@/plugins/contracts.js";
import Layout from "./views/Layout.vue";
import { getPrice, getAbi, getChina } from "@/plugins/request";

export default {
  name: "App",
  components: {
    Layout,
  },
  computed: {
    ...mapState(["reload", "slogan", "network","address"]),
  },
  watch: {
    address(){
      if(this.address)
        this.getEmailAddress();
    }
  },
  data: () => ({}),
  async created() {

    this.getEthereumAddress();
    this.setVersion();
    const back = await getChainId();

    if (back) {
      this.$store.commit("SET_SLOGAN", false);
    }
    this.windowOnresize();
    let transation = localStorage.getItem("transation");
    let transationCatch = transation ? JSON.parse(transation) : [];
    this.$store.commit("SET_TRANSACTION", transationCatch);

  },
  methods: {
    ...mapActions(["setVersion","getEthereumAddress","loginSignCall","getEmailAddress"]),

    windowOnresize() {
      window.onresize = (e) => {
        let scrollTop = document.documentElement.clientHeight
        this.$store.commit('SET_SCROLL', scrollTop);
      };
      window.addEventListener("scroll", () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop 
        this.$store.commit('SET_SCROLLTOP', scrollTop);
      })
    },
  },
};
</script>
<style lang="sass">
.main
  width: 100%
  height: 100%
.slogan
  height: 100%
  // background: url('./assets/golffbackground.png') no-repeat
  width: 100%
  overflow: hidden
  background-size: cover
  display: flex
  align-items: center
  justify-content: center
  -webkit-animation: scaleBG 8s ease-in-out infinite
@keyframes scaleBG
  0%
    transform: scale(1)
  25%
    transform: scale(1.05)
  50%
    transform: scale(1)
  75%
    transform: scale(1.05)
@keyframes scaleAn
  0%
    transform: scale(0.9)
  25%
    transform: scale(1.2)
  50%
    transform: scale(0.9)
  75%
    transform: scale(1.2)
</style>
