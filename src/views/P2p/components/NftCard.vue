<template>
  <div class="container">
    <div class="img">
      <img :src="item.imageUrl" />
    </div>
    <div class="collection">
      {{item.symbol}}
    </div>
    <div class="desc">
      <span>{{item.name}}</span>
      <span>#{{hiddenNftId(item.tokenId)}}</span>
    </div>
    <div class="tag">
      <a :href="item.openseaUrl" target="_blank">
        <i class="iconfont icon-opensea"></i> <span>Opensea</span> </a>
    </div>
  </div>
</template>

<script>
  import { hiddenNftId } from "@/plugins/tools";

  export default {
    name: "NftCard",
    props:{
      item: {},
    },
    data(){
      return {
        hiddenNftId
      }
    }
  }
</script>

<style lang="sass" scoped>

  $Tahoma-Bold: Tahoma-Bold
  $Tahoma: Tahoma


.container
  box-shadow: 0 2px 10px 0 rgba(114, 93, 255, 0.2)
  border-radius: 10px
  background-color: #FFFFFF
  width: 100%
  height: 100%
  max-width: 500px
  max-height: 692px
  .sell
    padding: 15px 15px 15px 15px
    .sellBtn
      width: 100%
      max-width: 194px
      height: 36px
  .tag
    font-family: $Tahoma
    font-size: 24px
    color: #999999
    padding-left: 35px
    padding-top: 10px
    i
      color: #2081E2
      font-size: 30px
      padding-top: 7px
      margin-right: 10px
    a
      text-decoration: none
      color: #2081E2
      display: flex
      align-items: center
      font-size: 18px
  .collection
    padding: 30px 30px 0 30px
    font-size: 18px
    font-family: Noto Sans
    font-weight: 400
    color: #222222
  .desc
    padding: 15px 30px 0 30px
    display: flex
    span:last-child
      font-family: $Tahoma-Bold
      font-size: 30px
      font-weight: bold
    span:first-child
      font-family: $Tahoma-Bold
      font-weight: bold
      font-size: 30px
      color: #222
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
  .img img
    width: 500px
    height: 500px
    border-top-left-radius: 10px
    border-top-right-radius: 10px
</style>