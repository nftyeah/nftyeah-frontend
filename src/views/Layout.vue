<template>
  <div class="flex_container">
    <Header></Header>
    <div class="flex_container_main">
      <router-view />
    </div>
    <Footer></Footer>
    <NetworkDialog />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import NetworkDialog from "./wallet/networkDialog.vue"
export default {
  name: "Layout",
  components: {
    Header,
    Footer,
    NetworkDialog
  },
  computed: {
    ...mapState(["settings", "menu", "slogan"]),
  },
  data: () => ({}),
  methods: {},
};
</script>

<style lang="sass">
.flex_container
  width: 100%
  height: 100%
  display: flex
  flex-direction: column
  .flex_container_main
    width: 100%
    display: flex
    position: relative
    flex: 1
    margin: 0 auto
    flex-direction: column
    background: linear-gradient(45deg, #ede2fd 0%, #f8f5ff 30%, #faf9ff 100%)
    padding-top: 80px
    .flex_left
      max-width: 386px
      margin-left: 20px
      width: 100%
    .flex_right
      max-width: 880px
      width: 100%
</style>
