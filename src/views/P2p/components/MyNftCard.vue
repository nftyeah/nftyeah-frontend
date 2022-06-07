<template>
  <div class="container">
    <div class="img">
      <img :src="item.imageUrl" @error="defaultImage($event)" />
    </div>
    <div class="collection">
      <span>{{item.collection_name}}</span>
      <div @click="openSell()" class="btn center">Sell</div>
    </div>
    <div class="desc">
      <el-tooltip class="item" :content="item.name" effect="dark" placement="top">
          <span>{{item.name}}</span>
      </el-tooltip>
      <span>#{{hiddenNftId(item.tokenId)}}</span>
    </div>
    <div class="tag">
      <span>Best Offer</span>
      <span>Last</span>
    </div>
    <div class="sell">
      <div>{{downFixed(item.topBid, 4)}}<img class="eth" src="@/assets/eth.svg" /></div>
      <div>{{downFixed(item.lastPrice, 4)}}<img class="eth" src="@/assets/eth.svg" /></div>
    </div>
  </div>
</template>

<script>
  import { hiddenNftId,downFixed } from "@/plugins/tools";

  export default {
    name: "myNftCard",
    props:{
      item: {},
    },
    data(){
      return {
        hiddenNftId,downFixed,
        defaultImg: require('../../../assets/404.png'),
      }
    },
    methods:{
      defaultImage(event){
        let img = event.target;
        img.src = this.defaultImg;
        img.onerror = null;
      },
      openSell(){
        // window.open('#/nftDetail/'+ this.item.address + '/' + this.item.tokenId, "_blank");
        this.$router.push('/nftDetail/'+ this.item.address + '/' + this.item.tokenId)
      }
    }
  }
</script>

<style lang="sass" scoped>

  $Tahoma-Bold: Tahoma-Bold
  $Tahoma: Tahoma


.container:hover
  box-shadow: 0 2px 10px 0 rgba(113,94,255,0.2)
.container
  box-shadow: 0px 2px 10px 0px rgba(221, 221, 221, 0.2)
  border-radius: 10px
  background-color: #FFFFFF
  width: 100%
  height: 100%
  max-width: 224px
  max-height: 350px
  .collection
    display: flex
    padding: 12px 15px 5px 15px
    justify-content: space-between
    .btn
      width: 54px
      height: 24px
      min-width: unset
      color: #FFFFFF
      font-size: 12px
    span
      color: #999999
      font-size: 12px
      font-weight: 400
      font-family: Tahoma
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      width: 135px
  .sell
    padding: 0 15px 0 15px
    display: flex
    justify-content: space-between
    div
      font-size: 14px
      font-family: Tahoma
      font-weight: bold
      display: flex
      align-items: center
    img
      width: 13px
      height: 25px
  .tag
    padding-right: 15px
    padding-left: 15px
    padding-top: 10px
    color: #999999
    display: flex
    justify-content: space-between
    span
      font-size: 12px
  .desc
    margin-right: 15px
    margin-left: 15px
    padding-bottom: 10px
    display: flex
    border-bottom: 1px solid #EEEEEE
    font-size: 14px
    span
      font-weight: bold
      color: #222
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
      font-size: 14px
  .img 
    display: flex
    justify-content: center
    img
      max-width: 224px
      height: 224px
      border-top-left-radius: 10px
      border-top-right-radius: 10px
</style>