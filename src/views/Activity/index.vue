<template>
  <div ref="html2canvas" class="myActivity">
    <div class="title">Activity</div>
    <div class="count">
      <div class="box">
        <img class="img" src="@/assets/activity/buy.png" />
        <span>Buy</span>
        <p><span>{{tradeStat.buy}}</span>NFTs</p>
      </div>
      <div class="box">
        <img class="img" src="@/assets/activity/sale.png" />
        <span>Sale</span>
        <p><span>{{tradeStat.sale}}</span>NFTs</p>
      </div>
      <div class="box">
        <img class="img" src="@/assets/activity/fees.png" />
        <span>Cost savings</span>
        <p><span>{{parseFloat(downFixed(decimalsCarry(tradeStat.saving_fees),5))}}</span>
        <img class="eth" src="@/assets/eth.svg" />
        </p>
      </div>
    </div>
    <div class="category">
      <ul>
        <li :class="event_type == '' && 'check'" @click="event_type = ''">ALL</li>
        <li :class="event_type == 'Buy' && 'check'" @click="event_type = 'Buy'">Buy</li>
        <li :class="event_type == 'Sale' && 'check'" @click="event_type = 'Sale'">Sale</li>
        <li :class="event_type == 'Listing' && 'check'" @click="event_type = 'Listing'">Listing</li>
        <li :class="event_type == 'Cancel' && 'check'" @click="event_type = 'Cancel'">Cancel</li>
      </ul>
      <div style="width: 480px">
        <i class="iconfont icon-search"></i>
        <input type="text" v-model="search" placeholder="Search items, collections" />
      </div>
    </div>
    <div class="headers">
      <div class="item">Item</div>
      <div class="event">Event</div>
      <div class="price">Price</div>
      <div class="from">From</div>
      <div class="to">To</div>
      <div class="time">Time</div>
    </div>
    <div class="itemList">
      <div class="item" v-for="(item, i) in list" :key="i">
        <div class="logo">
          <img :src="item.img_url" @error="defaultImage($event)" />
          <div>
            <p class="name">{{item.name}}</p>
            <p class="tag">{{item.symbol}}</p>
          </div>
        </div>
        <div class="event">{{item.event_type}}</div>
        <div class="price">{{ parseFloat(decimalsCarry(item.price)) < 0.01 && parseFloat(decimalsCarry(item.price)) > 0
          ? '<0.01' : downFixed(decimalsCarry(item.price),2) }}
          <img class="eth" src="@/assets/eth.svg" />
        </div>
        <div class="from">{{hiddenAddress(item.from_address)}}</div>
        <div class="to">{{hiddenAddress(item.to_address)}}</div>
        <div class="time" @click="openTxid(item.txid)" :class="item.txid ? 'txid' : ''">{{formatDateEN(item.create_time)}}</div>
      </div>
      <NoItems :tips="'No trading history yet'" class="nullItem" v-if="list != null && list.length == 0"/>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
  import NoItems from '@/components/NoItems'
  import { getTradeStat, getEvent } from "@/plugins/request"
  import { hiddenNftId,hiddenAddress,decimalsCarry,downFixed, formatDateEN } from "@/plugins/tools";
  export default {
    name: "Activity",
    components: {
      NoItems
    },
    computed: {
    ...mapState(["address","blockExplorerUrls"]),
  },
  watch: {
    address () {
      this.getEventCall()
    },
    event_type () {
      this.getEventCall()
    },
    search () {
      if (!this.search){
        this.list = this.listCatch;
        return;
      }
      this.list = this.listCatch;
      this.list = this.list.filter(e => {
        return e.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    }
  },
    data(){
      return {
        defaultImg: require('../../assets/404.png'),
        hiddenNftId,formatDateEN,
        downFixed,
        decimalsCarry,
        hiddenAddress,
        search:'',
        list: null,
        listCatch: null,
        event_type: "",
        tradeStat: {
          buy: "-",
          sale: "-",
          saving_fees: "_"
        }
      }
    },
    mounted() {
      this.getEventCall();
    },
    methods: {
      defaultImage(event){
        let img = event.target;
        img.src = this.defaultImg;
        img.onerror = null;
      },
      openTxid(txid){
        if(!txid){
          return;
        }
        window.open(this.blockExplorerUrls + '/tx/' + txid);
      },
      getEventCall() {
        if (!this.address) return
        getTradeStat(this.address).then(e => {
          console.log(e)
          this.tradeStat = e
        })
        getEvent(this.event_type || undefined, this.address).then(e => {
          console.log(e)
          this.list = e;
          this.listCatch = e;
        })
      }
    }
  }
</script>

<style lang="sass" scoped>


  $Tahoma-Bold: Tahoma-Bold
  $Tahoma: Tahoma


.myActivity
  width: 100%
  max-width: 1200px
  margin: 0 auto
  margin-bottom: 40px
  .itemList
    font-family: $Tahoma-Bold
    min-height: 465px
    .nullItem
      padding: 90px 0
      background-color: #FFFFFF
      border-radius: 0 0 10px 10px
    .item:hover
      border-color: #725DFF
      box-shadow: 0px 2px 10px 0px rgba(114, 93, 255, 0.2)
    .item
      max-width: 1200px
      height: 100px
      border-radius: 4px
      border: 1px solid #EEEEEE
      background-color: #ffffff
      display: flex
      align-items: center
      padding: 0 20px
      box-sizing: border-box
      margin: 10px 0
      div
        width: 100%
        font-size: 16px
        font-weight: 400
        color: #222222
      .logo
        max-width: 350px
        display: flex
        align-items: center
        div
          padding-left: 10px
        .tag
          font-size: 14px
          font-weight: 400
          color: #777777
        .name
          line-height: 30px
          font-size: 16px
          font-family: $Tahoma-Bold
          color: #222222
          font-weight: bold
          span
            color: #725DFF
        img
          height: 40px
          width: 40px
          border-radius: 50%
      .event
        max-width: 170px
      .price
        max-width: 150px
        font-size: 16px
        font-family: $Tahoma-Bold
        color: #725DFF
        font-weight: bold
      .from
        max-width: 165px
        text-align: right
      .to
        max-width: 165px
        text-align: right
      .txid
        cursor: pointer
      .time
        text-align: right

  .headers
    display: flex
    font-family: $Tahoma
    font-weight: bold
    font-size: 14px
    color: #222222
    background-color: #FFF
    padding: 19px 20px 19px 20px
    box-sizing: border-box
    border-radius: 10px 10px 0px 0px
    div
      width: 100%
    .item
      max-width: 350px
    .event
      max-width: 170px
    .price
      max-width: 150px
    .eth
      width: 16px
      height: 30px
    .from
      max-width: 165px
      text-align: right
    .to
      max-width: 165px
      text-align: right
    .time
      text-align: right
  .title
    margin-top: 34px
    margin-bottom: 56px
    font-size: 24px
    color: #222222
    font-weight: bold
  .category
    display: flex
    
    margin-bottom: 20px
    input
      width: 100%
      height: 48px
      border: 1px solid transparent
      border-radius: 4px
      padding: 0 16px 0 40px
      box-sizing: border-box
    input::-webkit-input-placeholder
      color: #999999
    input:focus
      outline: none
      border: 1px solid #725DFF
    .icon-search
      position: absolute
      z-index: 10
      color: #777777
      margin-left: 14px
      margin-top: 16px
    ul
      display: flex
      flex: 1
      .check
        background: linear-gradient(-53deg, #725DFF 50%,#A86BFE  100%)
        border-radius: 5px
        color: #FFF
      .check:hover
        background: linear-gradient(-53deg, #725DFF 50%,#A86BFE  100%)
        border-radius: 5px
        color: #FFF
        opacity: 0.8
      li
        margin-left: 20px
        cursor: pointer
        line-height: 48px
        text-align: center
        width: 100%
        max-width: 100px
        height: 48px
        font-size: 16px
        font-family: $Tahoma-Bold
        color: #222
        font-weight: 400
        border-radius: 5px
      li:hover
        background: #efe8ff
        color: #725DFF
      li:first-child
        margin-left: 0
  .count
    display: flex
    margin-bottom: 48px
    .box:last-child
      margin-left: 40px
    .box:first-child
      margin-right: 40px
    .box:hover
      box-shadow: 0px 2px 10px 0px rgba(113,94,255,0.2)
    .box
      padding-top: 22px
      box-sizing: border-box
      justify-content: space-between
      align-items: center
      display: flex
      position: relative
      max-width: 380px
      width: 100%
      height: 97px
      background-color: #ffffff
      border-radius: 10px
      box-shadow: 0px 2px 10px 0px rgba(221,221,221,0.2)
      .eth
        width: 20px
      .img
        top: -26px
        left: 30px
        position: absolute
        height: 48px
        width: 48px
      p
        padding-right: 29px
        font-size: 16px
        font-weight: 400
        font-family: $Tahoma
        span
          margin-right: 12px
          color: #725DFF
          font-weight: bold
          font-size: 30px
          font-family: $Tahoma-Bold
          padding: 0
      span
        padding-left: 30px
        color: #222222
        font-weight: 400
        font-family: $Tahoma
        font-size: 24px
</style>