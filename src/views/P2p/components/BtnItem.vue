<template>
    <div class="container">

      <div v-show="item.status === 1 && mToUpperCase(item.owner) === mToUpperCase(address)"
           ref="copy" data-clipboard-action="copy" :data-clipboard-text="url"
           id="copyLink"
           @click="copyUrl()" class="btn copy center">Copy Link</div>

      <div v-if="item.status === 0 && mToUpperCase(item.owner) === mToUpperCase(address)" @click="listing()" class="btn listing center">Complete listing</div>

      <div v-if="item.status === 1 && mToUpperCase(item.owner) === mToUpperCase(address)" @click="cancelOrder()" class="btn cancel center">Cancel listing</div>


      <div v-if="item.status === 1 && mToUpperCase(item.owner) !== mToUpperCase(address)" v-loading="loading.buyNft" @click="buyNft()" class="btn buy center">Buy now</div>

      <CompleteDialog :item="item" />
      <ListingDialog :item="item" />
      <CancelDialog  :item="item" />
      <CancelDialog  :item="item" />
      <ReservedDialog  :item="item" />
      <!--<el-button @click="successNft()">test</el-button>

      -->
    </div>
</template>

<script>
  import {mToUpperCase} from "@/plugins/tools.js";
  import { mapState } from "vuex";
  import CompleteDialog from "./CompleteDialog";
  import ListingDialog from "./ListingDialog";
  import CancelDialog from "./CancelDialog";
  import ReservedDialog from "./ReservedDialog";
  import { buyOrder } from "./common"

  export default {
    name: "BtnItem",
    components: {CancelDialog, ListingDialog, CompleteDialog, ReservedDialog},
    props:{
      item: {},
    },
    computed: {
      ...mapState(["listingShow","yeahProxyRegistry","yeahExchange","address","network"]),
    },
    data(){
      return {
        url:'',
        mToUpperCase,
        copyBtn: null,
        loading:{
          buyNft: false
        }
      }
    },
    methods:{
      copyUrl() {
        let _this = this;
        let clipboard = this.copyBtn;
        clipboard.on('success', function() {
          _this.$notify({
            title: 'prompt',
            message: 'Copy Success',
            type: 'success',
            duration: 3000
          });
        });
      },
      listing(){
        // todo
        if(parseInt(this.network) !== 1){
          this.$store.commit('SET_NETWORKDIALOGSHOW', true);
          return;
        }

        if (!this.item.basePrice) {
          this.$message.error('price error');
          return;
        }
        if(!this.item.expirationTime){
          this.$message.error('duration error');
          return;
        }
        this.$store.commit('SET_LISTINGSHOW', true);
      },
      cancelOrder(){
        // todo
        if(parseInt(this.network) !== 1){
          this.$store.commit('SET_NETWORKDIALOGSHOW', true);
          return;
        }

        this.$store.commit('SET_CANCELSHOW', true)
      },
      async buyNft(){
        // todo
        if(parseInt(this.network) !== 1){
          this.$store.commit('SET_NETWORKDIALOGSHOW', true);
          return;
        }
        if (this.item.taker) {
          if (mToUpperCase(this.address) !== mToUpperCase(this.item.taker)) {
            this.$store.commit('SET_RESERVEDSHOW', true);
            return;
          }
        }

        this.loading.buyNft = true;
        console.log(this.yeahExchange);
        const r = await buyOrder(this.yeahExchange,this.address,this.item);
        if (r) {

          this.successNft()

        }
        this.loading.buyNft = false;
      },
      async successNft(){
        console.log(this.item);
        const _item = this.item;
        console.log(_item)
        this.$router.push({path: '/nft/success', query: {
            nftId: _item.tokenId,
            address: _item.address,
            basePrice: parseFloat(_item.basePrice),
          }});
      },
      initClipboard(){
        const copyLink = document.getElementById('copyLink');
        console.log(copyLink);
        this.copyBtn = new this.clipboard(copyLink);
      }
    },
    mounted() {
      this.url = window.location.href;
      this.initClipboard();
    }
  }
</script>

<style lang="sass" scoped>
  $Tahoma-Bold: Tahoma-Bold
  $Tahoma: Tahoma

.container
  margin-top: 30px
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  .btn
    font-size: 18px
    font-family: $Tahoma-Bold
    font-weight: bold
    color: #ffffff
  .copy
    height: 60px
    width: 320px
  .buy
    height: 60px
    width: 320px
  .listing
    height: 60px
    width: 320px
  .cancel
    border: 1px solid #725DFF
    color: #725DFF
    background: transparent
    height: 60px
    width: 320px
</style>