<template>
  <div class="myNfts">
    <div class="top">
      <h1>P2P</h1>
      <span>Peer-to-peer trading of NFTs, No fees</span>
    </div>
    <div class="search">
      <div class="right">
        <i class="iconfont icon-search"></i>
        <input type="text" v-model="search" placeholder="Search items, collections" />
      </div>

      <div class="left">
        <p class="nftNum">{{nftList.length}} <span>NFTs</span></p>
        <p class="tips">
          Currently only supports the ERC-721 standard
        </p>
      </div>
      
    </div>
    <Skeletons :number="10" v-if="initial === true" />
    <div
         v-infinite-scroll="load"
         infinite-scroll-disabled="disabled"
         class="itemList">
      <MyNftCard v-for="(item) in nftList" v-show="showItem(item)" :item="item" :key="item.tokenId" class="item" />
    </div>
    <NoItems :tips="'No items to display'" class="noItems" v-if="initial === false && nftList.length === 0" />
    <div>
      <div class="pageLoad" v-if="loading">
        <img class="img" src="@/assets/pageLoad.gif" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { userNft } from "@/plugins/request"
import MyNftCard from "./components/MyNftCard.vue";
import NoItems from '@/components/NoItems'
import {deepClone2,mToUpperCase,decimalsCarry,downFixed} from "@/plugins/tools.js";
import Skeletons from "@/components/Skeletons/nft.vue"

export default {
  name: "myNfts",
  components: {
    MyNftCard,NoItems,Skeletons
  },
  computed: {
    ...mapState(["address","scroll"]),
    noMore () {
      return this.next === null
    },
  },
  watch: {
    initial(){
      const elm = document.getElementsByClassName('itemList')[0];
      if (!this.initial && this.nftList.length === 0) {
        elm.style.display = 'none';
      } else {
        elm.style.display = 'flex';
        this.calcHeight();
      }
    },
    scroll(){
      this.calcHeight();
    },
    address(){
      this.init();
    }
  },
  data: () => ({
    loading:false,
    initial: null,
    nftList: [],
    next: '',
    search: '',
    nftObjType: {
      address: '',
      imageUrl: '',
      openSeaUrl: '',
      name: '',
      owner: '',
      symbol: '',
      tokenId: null,
      lastPrice: null,
      topBid: null,
    }
  }),
  async mounted() {

    this.init();
    this.calcHeight();
  },
  methods: {
    calcHeight() {

      const elm = document.getElementsByClassName('itemList')[0];
      console.log(elm);
      console.log(document.documentElement.clientHeight)
      elm.style.height = (document.documentElement.clientHeight - 380) + 'px';

    },
    async load () {
      if (this.next == null) {
        return;
      }
      this.loading = true;
      await this.getNextData();
      this.loading = false;
    },
    showItem(item){
      return (this.search !== '' ? (mToUpperCase(item.symbol).indexOf(mToUpperCase(this.search))) > -1 : true);
    },
    async getUserData(address,next){
      this.nftList = [];
      if (this.initial) {
        return;
      }
      this.initial = true;
      const nftList = await userNft(address,next);
      console.log(nftList);
      this.next = nftList.next;
      if (nftList.assets) {
        nftList.assets.forEach(nftObj => {
          let obj = deepClone2(this.nftObjType);
          obj.address = nftObj.address;
          obj.imageUrl = nftObj.image_url;
          obj.openSeaUrl = nftObj.opensea_url;
          obj.name = nftObj.name;
          obj.owner = nftObj.owner;
          obj.symbol = nftObj.symbol;
          obj.tokenId = nftObj.token_id;
          obj.collection_name = nftObj.collection_name;

          obj.lastPrice = downFixed(decimalsCarry(nftObj.last_price),2);
          obj.topBid = downFixed(decimalsCarry(nftObj.top_bid),2);

          this.nftList.push(obj);
          this.initial = false;
        });
      }
      this.initial = false;
    },
    async getNextData(){
      if (this.next) {
        const nftList = await userNft(this.address,this.next);
        this.next = nftList.next;
        if (nftList.assets) {
          nftList.assets.forEach(nftObj => {
            let obj = deepClone2(this.nftObjType);
            obj.address = nftObj.address;
            obj.imageUrl = nftObj.image_url;
            obj.openSeaUrl = nftObj.opensea_url;
            obj.name = nftObj.name;
            obj.owner = nftObj.owner;
            obj.symbol = nftObj.symbol;
            obj.tokenId = nftObj.token_id;
            this.nftList.push(obj);
          });
        }
      }

    },
    async init(){
      await new Promise((resolve) => setTimeout(resolve, 500));
      if(this.address){
        this.getUserData(this.address)
      }
    }
  },
};
</script>
<style lang="sass" scoped>
  ::-webkit-scrollbar
    display: none


.myNfts
  width: 100%
  max-width: 1240px
  margin: 0 auto
  .top
    margin-top: 49px
    text-align: center
    h1
      font-family: Tahoma-Bold
      color: #222222
      font-weight: bold
      font-size: 36px
    span
      font-size: 16px
      font-family: Tahoma
      color: #777777
  .pageLoad
    text-align: center
    .img
      width: 120px
      height: 60px
  .noItems
    margin-top: 10%
  .itemList
    min-height: 500px
    -ms-overflow-style: none
    scrollbar-width: none
    overflow-y: scroll
    flex-wrap: wrap
    display: flex
    .item
      margin: 0 12px 20px 12px
  .search
    padding: 0 10px
    margin: 18px 0 20px 0
    display: flex
    align-items: center
    justify-content: space-between
    position: relative
    input
      width: 480px
      height: 48px
      border: 1px solid transparent
      border-radius: 4px
      padding: 0 16px 0 35px
    input::-webkit-input-placeholder
      color: #777777
    input:focus
      outline: none
      border: 1px solid #725DFF
    .icon-search
      position: absolute
      z-index: 10
      color: #777777
      margin-left: 10px
      margin-top: 16px
    .right
      margin: 10px 0
    .left
      text-align: right
      h2
        font-family: Tahoma
      .nftNum
        color: #725DFF
        font-family: Tahoma-Bold
        padding-left: 5px
        font-size: 16px
        font-weight: 400
        span
          color: #222222
      .tips
        font-size: 14px
        font-family: Tahoma
        color: #777777
</style>
