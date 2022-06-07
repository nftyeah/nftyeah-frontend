<template>
  <div class="successNft">
    <div class="main">
      <div class="cardItem">
        <div class="img">
          <img :src="imageUrl" />
        </div>
        <div class="desc">
          <span>{{symbol}}</span>
          <span>#{{nftId}}</span>
        </div>
      </div>
      <div class="buyInfo">
        <div class="tips">The transaction was successful, this transaction saved {{calcSavedAmount}}ETH</div>
        <ul>
          <li>
            <span>Price</span>
            <i class="iconfont icon-eth"></i><span>{{parseFloat(basePrice)}}</span>
          </li>
          <li>
            <span>Service Fee</span>
            <span>0.00</span>
          </li>
          <li>
            <span>Creator Fee</span>
            <span>0.00</span>
          </li>
        </ul>
        <div class="btn-next">
          <div @click="jumpHome()" class="btn center">View my NFTs</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { getNft,calcSavedAmount } from "@/plugins/request"

  export default {
    name: "SuccessNft",
    data(){
      return {
        nftId:'',
        basePrice:'',
        address:'',
        imageUrl:'',
        name:'',
        symbol:'',
        calcSavedAmount: '',
      }
    },
    methods:{
      jumpHome(){
        this.$router.push('/myNfts')
      },
      async initialData(){

        this.calcSavedAmount = await calcSavedAmount(this.basePrice,this.address);
        const nft = await getNft(this.address, this.nftId);
        this.imageUrl = nft.image_url;
        this.name = nft.name;
        this.owner = nft.owner;
        this.symbol = nft.symbol;
      }
    },
    mounted() {
      this.nftId = this.$route.query.nftId;
      this.basePrice = this.$route.query.basePrice;
      this.address = this.$route.query.address;
      console.log(this.nftId);
      this.initialData();
    }
  }
</script>

<style lang="sass" scoped>


  $Tahoma-Bold: Tahoma-Bold
  $Tahoma: Tahoma



.successNft
  max-width: 900px
  width: 100%
  margin: 88px auto 0
  margin-bottom: 120px
  .btn-next
    margin-top: 70px
    display: flex
    .btn
      color: #ffffff
      font-size: 18px
      font-weight: bold
      font-family: $Tahoma
      width: 320px
      height: 60px
  .main
    display: flex
    .buyInfo
      padding-top: 30px
      padding-left: 30px
      ul
        margin-top: 60px
        li
          display: flex
          list-style: none
          margin-bottom: 23px
          span:last-child
            font-family: $Tahoma-Bold
            font-weight: bold
            color: #725DFF
            font-size: 16px
            .icon-eth
              font-size: 16px
              color: unset
          span:first-child
            width: 160px
            color: #666666
            font-size: 16px
            font-family: $Tahoma
      .tips
        color: #222222
        font-size: 24px
        font-family: $Tahoma
        font-weight: bold
        line-height: 40px
    .cardItem
      box-shadow: 0 2px 10px 0 rgba(114, 93, 255, 0.2)
      border-radius: 10px
      background-color: #FFFFFF
      width: 100%
      height: 100%
      max-width: 330px
      max-height: 421px
      .sell
        padding: 15px 15px 15px 15px
        .sellBtn
          width: 100%
          max-width: 194px
          height: 36px
      .desc
        padding: 35px 30px
        display: flex
        justify-content: space-between
        span:last-child
          font-family: $Tahoma
          font-size: 18px
          font-weight: 400
        span:first-child
          font-family: $Tahoma-Bold
          font-weight: bold
          font-size: 18px
          color: #222
          overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
      .img img
        width: 330px
        height: 330px
        border-radius: 10px
</style>