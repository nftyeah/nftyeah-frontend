<template>
  <div class="drops">
    <div class="dropsTitle">
      <div class="title">Reminder</div>
      <div class="date">Notify you of the latest floor price of NFTs by email and browser push</div>
    </div>
    <div class="select">
      <div class="group">
        <div
          class="btn center"
          :class="revealed==0 ? 'active' : ''"
          @click="changeRevealed(0, true)"
        >
          Revealed
        </div>
        <div
          class="btn center"
          :class="revealed==1 ? 'active' : ''"
          @click="changeRevealed(1, true)"
        >
          Unrevealed
        </div>
      </div>
      <div @click="jumpReminders()" class="reminders">
        <i class="iconfont icon-a-allreminders"></i> All reminders
      </div>
    </div>
    <div class="refresh">
      <div class="time">
        <div v-loading="loading" @click="updatedData()" class="circle">
          <i class="iconfont icon-updated" v-if="!loading"></i>
        </div>
        <div class="collect">
          <span>{{list.length}} Collections</span>
          <br />
          <span>
            <el-tooltip class="item" effect="dark" :content="curTimeExt" placement="top">
              <span class="name">{{curTime}}</span>
            </el-tooltip>
          </span>
        </div>
      </div>
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input
                type="text"
                v-model="input"
                placeholder="Search items, collections"
        />
      </div>
    </div>
    <div class="dropsList">
      <div class="dropsListHeader">
        <div>
          Collection
          <el-tooltip class="item" content="Sort by volume on OpenSea in the last 24 hours" effect="dark" placement="top">
            <i class="iconfont icon-hint"></i>
          </el-tooltip>
        </div>
        <div @click="sortHandler(1)">
          
          Mint price
          <el-tooltip class="item" content="The average price of the latest mint" effect="dark" placement="top">
          <i class="iconfont icon-hint"></i>
          </el-tooltip>
          <span class="sort" :class="sortIndex === 1 ? sortBy : ''">
            <i class="iconfont icon-up1"></i>
            <i class="iconfont icon-down1"></i>
          </span>
        </div>
        <div @click="sortHandler(2)">Floor price
          <span class="sort" :class="sortIndex === 2 ? sortBy : ''">
            <i class="iconfont icon-up1"></i>
            <i class="iconfont icon-down1"></i>
          </span>
        </div>
        <div @click="sortHandler(3)">Items
          <span class="sort" :class="sortIndex === 3 ? sortBy : ''">
            <i class="iconfont icon-up1"></i>
            <i class="iconfont icon-down1"></i>
          </span>
        </div>
        <div @click="sortHandler(4)">Mint time
          <span class="sort" :class="sortIndex === 4 ? sortBy : ''">
            <i class="iconfont icon-up1"></i>
            <i class="iconfont icon-down1"></i>
          </span>
        </div>
        <div>Explore</div>
        <div class="Reminder">
          Reminder
          <img src="@/assets/reminder.gif" alt="" />
        </div>
      </div>
      <div class="dropsListTable"
           v-infinite-scroll="load"
           infinite-scroll-disabled="disabled">
        <div class="dropsEmpty" v-if="list.length == 0 && !loading">
          <img src="@/assets/null.svg" alt="" />
          <p>No items to display</p>
        </div>
        <div class="dropsListItem" :class="i % 2 == 0 ? 'dot':''" v-for="(item, i) in list" :key="i">
          <div class="icon">
            <span class="index">{{(i+1)}}</span>
            <img :src="item.logo" @error="defaultImage($event)" alt="" />
            <el-tooltip class="item" :disabled="item.collection.length > 22 ? false : true" effect="dark" :content="item.collection" placement="top">
              <span class="name">{{ showColl(item.collection) }}</span>
            </el-tooltip>
          </div>
          <div class="mPrice">
            <span v-if="item.mint_price == '-'">-</span>
            <span v-if="item.mint_price == 0">0</span>
            <span v-if="item.mint_price > 0">{{ downFixedExt(item.mint_price,2) == '0.00' ? '<0.01' : downFixedExt(item.mint_price,2) }}</span>
            <img class="eth" src="@/assets/eth.svg" />
          </div>
          <div class="fPrice">
            <span v-if="item.floor_price == '-'">-</span>
            <span v-if="item.floor_price == 0">{{ downFixedExt(item.floor_price,2) }}</span>
            
            <span v-if="item.floor_price > 0">{{ downFixedExt(item.floor_price,2) == '0.00' ? '<0.01' : downFixedExt(item.floor_price,2) }}</span>
            <img class="eth" src="@/assets/eth.svg" />
          </div>
          <div class="supply">{{ formatSizeKM(item.total_supply) }}</div>
          <div class="time">
            
            <el-tooltip class="item" content="HKT" effect="dark" placement="top">
              <span>{{ item.mint_time ? formatDateEN(item.mint_time) : '--' }}</span>
            </el-tooltip>
            <!-- <i class="iconfont icon-sound-off" style="color: #000"></i> -->
          </div>
          <div class="explore">
            <a :href="item.website" v-if="item.website" target="_blank">
              <el-tooltip class="item" content="Website" effect="dark" placement="top">
                <i class="iconfont icon-website1"></i>
              </el-tooltip>
            </a>
            <a :href="item.opensea" v-if="item.opensea" target="_blank">
              <el-tooltip class="item" content="OpenSea" effect="dark" placement="top">
                <i class="iconfont icon-opensea"></i>
              </el-tooltip>
            </a>
            <a :href="item.twitter" v-if="item.twitter" target="_blank">
              <el-tooltip class="item" content="Twitter" effect="dark" placement="top">
                <i class="iconfont icon-twitter"></i>
              </el-tooltip>
            </a>
          </div>
          <div class="sound">
            <a v-if="item.user_status === 0" @click="handleCommand(item)" class="btn center">Create</a>
            <p v-if="item.user_status === 1">Floor price to<span style="color: #725dff">{{item.notify_price}}</span><img class="eth" src="@/assets/eth.svg" /></p>
            <p v-if="item.user_status === 2">Mint</p>
            <p v-if="item.user_status === 3">Mint/Floor price to<span style="color: #725dff">{{item.notify_price}}<img class="eth" src="@/assets/eth.svg" /></span></p>
          </div>
        </div>
        <Skeletons :number="10" v-if="loading" />
      </div>
    </div>
    <RemindDialog :selectData="selectData" :collectionsList="collectionsList" @remindRefresh="remindRefresh"/>
    <div @click="screenTop()" class="top" v-if="topShow">
      <img src="@/assets/top.svg" />
    </div>
  </div>
</template>

<script>
import { decimalsCarry,downFixedExt,formatDateEN,parseTime,formatSizeKM } from "@/plugins/tools";
import { getCollections, getCollectionsUn, getCollectionsName } from "@/plugins/request";
import RemindDialog from "../Event/RemindDialog.vue"
import Skeletons from "@/components/Skeletons/list.vue"
import { web3Send } from "@/plugins/contracts"
import { mapState } from "vuex";

export default {
  name: "Drops",
  components: {RemindDialog,Skeletons},
  computed: {
    ...mapState(["address", "scrollTop"]),
    noMore() {
      return this.count >= 20;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  data: () => ({
    formatDateEN,
    formatSizeKM,
    downFixedExt,
    parseTime,
    web3Send,
    decimalsCarry,
    collectionsList: [],
    selectData: "",
    revealed: true, // true = Revealed | false Unrevealed
    count: 10,
    loading: true,
    list: "",
    listColl: [],
    listCollUn: [],
    input: "",
    defaultImg: require('../../assets/404.png'),
    sortBy: '',
    sortName: null,
    sortIndex: 0,
    curTime:'',
    curTimeExt: '',
    revealedCurPage: 0,
    revealedFlag: true,
    unrevealedCurPage: 0,
    unrevealedFlag: true,
    topShow: false,
  }),
  watch: {
    input() {
      console.log(this.input);
      if (this.revealed) {
        this.list = this.listColl
        this.list = this.list.filter(e => {
          return e.collection.toLowerCase().indexOf(this.input.toLowerCase()) > -1
        })
      } else {
        this.list = this.listCollUn
        this.list = this.list.filter(e => {
          return e.collection.toLowerCase().indexOf(this.input.toLowerCase()) > -1
        })
      }
    },
    address() {
      console.log(this.address)
    },
    scrollTop() {
      if(!this.scrollTop) return;
      if(this.scrollTop > 1000){
        this.topShow = true;
      } else {
        this.topShow = false;
      }
    }
  },
  async mounted() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let revealed = this.$route.params.id
    if(revealed == undefined) {
      this.changeRevealed(0, true)
      this.getCurrent();
      return;
    }
    this.changeRevealed(revealed)
    this.getCurrent();
  },
  methods: {
    screenTop(){
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    load(){

      if (!this.loading) {
        this.loading = true;
        this.getNextData();
      }
    },
    updatedData(){
      this.getCurrent();
      this.loading = true;
      if (this.revealed) {
        this.getCollectionsCall();
      } else {
        this.getCollectionsUnCall();
      }
      
    },
    getCurrent(){
      let d = new Date();
      let hh = d.getHours();
      let m = d.getMinutes();
      let s = d.getSeconds();
      let dd = "AM";
      let h = hh;
      if(m < 10){
        m = '0'+m;
      }

      if(s < 10){
        s = '0'+s;
      }

      this.curTime =  h + ':' + m + ':' + s;
      this.curTimeExt = this.formatDateEN(this.parseTime(d))+" (HKT)";
    },
    jumpReminders(){
      this.$router.push('/event');
    },
    sortHandler(i) {
      if (i === 1) {
        this.sortName = 'mint_price';
      } else if (i === 2) {
        this.sortName = 'floor_price';
      } else if (i === 3) {
        this.sortName = 'total_supply';
      } else if (i === 4) {
        this.sortName = 'mint_time';
      }
      if (this.sortBy === 'ascending') {
        this.sortBy = 'descending';
      } else if (this.sortBy === 'descending') {
        this.sortBy = '';
        this.sortName = null;
      } else {
        this.sortBy = 'ascending';
      }
      this.sortIndex = i;
      console.log(this.sortName, this.sortBy)
      this.getCollectionsCall();
    },
    showColl(name){
      return name.length > 22 ? name.substring(0,21) + '...' : name;
    },
    defaultImage(event){
      let img = event.target;
      img.src = this.defaultImg;
      img.onerror = null;
    },
    handleCommand(e) {
      this.selectData = e
      this.selectData.type = this.revealed;
      this.$store.commit('SET_REMINDDIALOGSHOW', true)
    },
    remindRefresh() {

      if(this.revealed) {
        this.getCollectionsCall();
      }else{
        this.getCollectionsUnCall();
      }
      this.getCurrent();
    },
    getNextData(){
      const orderType = this.sortName;
      let orderDirection = 'DESC';
      if (this.sortBy === 'descending') {
        orderDirection = 'DESC';
      } else if (this.sortBy === 'ascending') {
        orderDirection = 'ASC';
      } else {
        orderDirection = '';
      }

      if(this.revealed == 0) {
        if(!this.revealedFlag){
          this.loading = false;
          return;
        }
        console.log(this.address,orderType,orderDirection,this.revealedCurPage)
        this.revealedCurPage++;
        getCollections(this.address,orderType,orderDirection,this.revealedCurPage).then((e) => {
          if(!e || e.length === 0){
            this.revealedFlag = false;
            this.loading = false;
            return;
          }
          let list = []
          e.map((o) => {
            o.mint_price = this.decimalsCarryFilter(o.mint_price);
            o.floor_price = this.decimalsCarryFilter(o.floor_price);
            o.logo = o.logo ? o.logo : 'https://gateway.ipfs.io/ipfs/QmdE2EyKkf96XFb3vW4zT2iv4iFkh8QThYFjmYvzd2csUV';

            if (o.notify_list && o.notify_list.length > 0) {
              if (o.notify_list.length == 2) {
                o.notify_price = o.notify_list[0].event_config;
                o.user_status = 3;
              } else {
                console.log(o.notify_list[0])
                o.user_status = o.notify_list[0].event_type;
                o.notify_price = o.notify_list[0].event_config;
              }
            } else {
              o.user_status = 0;
            }
            list.push(o)

          });
          this.listColl = this.listColl.concat(list)
          this.list = this.list.concat(list)

          this.loading = false;
        });
      }else{
        if(!this.unrevealedFlag){
          this.loading = false;
          return;
        }
        this.unrevealedCurPage++;
        getCollectionsUn(this.address,orderType,orderDirection,this.unrevealedCurPage).then((e) => {
          if(!e || e.length === 0){
            this.unrevealedFlag = false;
            this.loading = false;
            return;
          }
          e.map((o) => {
            o.mint_price = this.decimalsCarryFilter(o.mint_price);
            o.floor_price = this.decimalsCarryFilter(o.floor_price);
            o.logo = o.logo ? o.logo : 'https://gateway.ipfs.io/ipfs/QmdE2EyKkf96XFb3vW4zT2iv4iFkh8QThYFjmYvzd2csUV';
            //  User status: 0 not created, 1 floor price, 2 mint time, 3 mint and floor price
            if (o.notify_list && o.notify_list.length > 0) {
              if (o.notify_list.length == 2) {
                o.notify_price = o.notify_list[0].event_config;
                o.user_status = 3;
              } else {
                console.log(o.notify_list[0])
                o.user_status = o.notify_list[0].event_type;
                o.notify_price = o.notify_list[0].event_config;
              }
            } else {
              o.user_status = 0;
            }
            this.listCollUn.push(o);
            this.list.push(o);
          });
          this.loading = false;
        });
      }
    },
    decimalsCarryFilter(e) {
      if (e && e != 0) {
        let string = decimalsCarry(e, 18);
        return parseFloat(string);
      } else if (e == 0) {
        return 0;
      } else {
        return "-";
      }
    },
    getCollectionsCall() {
      this.loading = true;
      this.list = "";
      const orderType = this.sortName;
      let orderDirection = 'DESC';
      if (this.sortBy === 'descending') {
        orderDirection = 'DESC';
      } else if (this.sortBy === 'ascending') {
        orderDirection = 'ASC';
      } else {
        orderDirection = 'DESC';
      }
      getCollectionsName().then(e => {
        this.collectionsList = e;
      });

      getCollections(this.address,orderType,orderDirection,this.revealedCurPage).then((e) => {
        e.map((o) => {
          o.mint_price = this.decimalsCarryFilter(o.mint_price);
          o.floor_price = this.decimalsCarryFilter(o.floor_price);
          o.logo = o.logo ? o.logo : 'https://gateway.ipfs.io/ipfs/QmdE2EyKkf96XFb3vW4zT2iv4iFkh8QThYFjmYvzd2csUV';
          if (o.notify_list && o.notify_list.length > 0) {
            if (o.notify_list.length == 2) {
              o.notify_price = o.notify_list[0].event_config;
              o.user_status = 3;
            } else {
              console.log(o.notify_list[0])
              o.user_status = o.notify_list[0].event_type;
              o.notify_price = o.notify_list[0].event_config;
            }
          } else {
            o.user_status = 0;
          }

        });
        this.listColl = e;
        this.list = e;
        this.loading = false;
      });
    },
    getCollectionsUnCall() {
      this.loading = true;
      this.list = "";

      const orderType = this.sortName;
      let orderDirection = 'DESC';
      if (this.sortBy === 'descending') {
        orderDirection = 'DESC';
      } else if (this.sortBy === 'ascending') {
        orderDirection = 'ASC';
      } else {
        orderDirection = 'DESC';
      }

      getCollectionsUn(this.address,orderType,orderDirection).then((e) => {
        e.map((o) => {
          o.mint_price = this.decimalsCarryFilter(o.mint_price);
          o.floor_price = this.decimalsCarryFilter(o.floor_price);
          o.logo = o.logo ? o.logo : 'https://gateway.ipfs.io/ipfs/QmdE2EyKkf96XFb3vW4zT2iv4iFkh8QThYFjmYvzd2csUV';

          if (o.notify_list && o.notify_list.length > 0) {
            if (o.notify_list.length == 2) {
              o.notify_price = o.notify_list[0].event_config;
              o.user_status = 3;
            } else {
              console.log(o.notify_list[0])
              o.user_status = o.notify_list[0].event_type;
              o.notify_price = o.notify_list[0].event_config;
            }
          } else {
            o.user_status = 0;
          }
        });
        this.listCollUn = e;
        this.list = e;
        this.loading = false;
      });
    },
    changeRevealed(e, c) {
      this.revealed = e;
      if(c) {
        this.$router.replace({path: "/reminder/"+e})
      }
      
      if (e == 0) {
        if (this.listColl.length > 0) {
          this.list = this.listColl;
          return;
        }
        this.getCollectionsCall();
      } else {
        if (this.listCollUn.length > 0) {
          this.list = this.listCollUn;
          return;
        }
        this.getCollectionsUnCall();
      }
    },
  },
};
</script>

<style lang="sass">
.icon-hint
  width: 15px
  height: 15px
  color: #C3C1D0
  margin: 0 5px
  font-weight: 100
.sort
  transform: scale(0.4)
  display: flex
  flex-direction: column
  .icon-up1
    color: #222222
    font-size: 12px
  .icon-down1
    color: #222222
    font-size: 12px
    margin-top: 3px
.descending
  .icon-up1
    color: #725DFF
.ascending
  .icon-down1
    color: #725DFF

.drops
    width: 100%
    max-width: 1220px
    margin: 0 auto
    .top
      width: 50px
      height: 50px
      cursor: pointer
      position: fixed
      right: 30px
      bottom: 100px
      img
        width: 100%
    .dropsEmpty
      display: flex
      align-items: center
      flex-direction: column
      margin-top: 90px
      img
        width: 246px
        height: 186px
      p
        margin-top: 20px
        font-size: 30px
        font-family: Tahoma
        font-weight: 400
        color: #DDDDDD
    .dropsList
        color: #222222
        min-height: 465px
        margin-top: 20px
        font-family: Tahoma-Bold
        .dropsListHeader
            height: 72px
            display: flex
            align-items: center
            background: #ffffff
            border-radius: 10px 10px 0 0
            div
              font-size: 14px
              font-weight: bold
              font-family: Tahoma
              color: #222222
              text-align: right
            div:nth-child(5)
              max-width: 220px
              width: 100%
              display: flex
              justify-content: end
              align-items: center
              cursor: pointer
            div:nth-child(4)
              max-width: 137px
              width: 100%
              display: flex
              justify-content: end
              align-items: center
              cursor: pointer
            div:nth-child(3)
              max-width: 127px
              width: 100%
              display: flex
              justify-content: end
              align-items: center
              cursor: pointer
            div:nth-child(2)
              max-width: 120px
              width: 100%
              display: flex
              cursor: pointer
              justify-content: end
              align-items: center
            div:nth-child(1)
                max-width: 288px
                width: 100%
                padding-left: 20px
                text-align: left
            div:nth-child(7)
              max-width: 164px
              width: 100%
              box-sizing: border-box
              padding-right: 19px
              display: flex
              align-items: center
              text-align: revert
              justify-content: flex-end
              img
                width: 30px
            div:nth-child(6)
                max-width: 145px
                padding-right: 0
                width: 100%
                flex: auto
            .Reminder
                
        .dropsListTable
            margin-bottom: 40px
            .dropsListItem:nth-child(1)
              border-top-left-radius: 4px
              border-top-right-radius: 4px
            .dropsListItem:last-child
              border-bottom-left-radius: 4px
              border-bottom-right-radius: 4px
            .dropsListItem:hover
              background-color: #F6F5FF
            .dropsListItem
                display: flex
                background-color: #FFF
                padding: 20px
                
                border: 1px solid transparent
                font-size: 14px
                font-family: Tahoma
                font-weight: bold
                color: #222222

                div
                    flex: 1
                    display: flex
                    align-items: center
                    justify-content: flex-end
                    .eth
                      width: 16px
                      height: 30px
                div:nth-child(1)
                    justify-content: flex-start
                    max-width: 288px
                    width: 100%
                div:nth-child(2)
                    max-width: 118px
                    width: 100%
                div:nth-child(3)
                    max-width: 127px
                    width: 100%
                div:nth-child(4)
                    max-width: 137px
                    width: 100%
                div:nth-child(5)
                    max-width: 220px
                    width: 100%
                div:nth-child(6)
                    max-width: 145px
                    width: 100%
                div:nth-child(7)
                    max-width: 141px
                    width: 100%
                .icon
                    display: flex
                    align-items: center
                    max-width: 156px
                    width: 100%
                    .index
                      margin-right: 35px
                    img
                        border: 1px solid #EEEEEE
                        width: 40px
                        height: 40px
                        border-radius: 50%
                    .name
                        line-height: 24px
                        font-size: 14px
                        font-weight: bold
                        margin-left: 13px
                .fPrice
                    span
                        color: #725DFF
                        font-weight: bold
                .explore
                    color: #6287F0
                    a
                      text-decoration: none
                    .iconfont
                        margin-left: 6px
                        font-size: 20px
                        color: #28a0dd
                    .icon-website1
                        color: #6287F0
                        font-weight: 100
                    .icon-opensea
                        color: #2081E2
                        font-weight: 100
                    .icon-twitter
                        color: #2DAAE1
                        font-weight: 100
                .sound
                  p
                    display: flex
                    align-items: center
                    span
                      display: flex
                      align-items: center
                  .btn
                    color: #FEFEFE
                    font-size: 14px
                    font-family: Tahoma
                    min-width: 72px
                    cursor: pointer
                    width: 72px
                    height: 30px
                .time
                    width: 200px
                    font-size: 14px
                    .iconfont
                        margin-left: 10px
            .dot
              background-color: #f8f8fc
    .dropsTitle
        text-align: center
        margin-top: 48px
        .date
          font-size: 16px
          font-family: Tahoma
          font-weight: 400
          color: #777777
        .title
            font-size: 36px
            font-family: Tahoma-Bold
            font-weight: bold
            color: #222222
    .select
        margin-top: 20px
        display: flex
        justify-content: space-between
        .reminders
          color: #725DFF
          cursor: pointer
          font-family: Tahoma
          font-size: 14px
          width: 145px
          height: 48px
          border: 1px solid #725DFF
          border-radius: 4px
          display: flex
          align-items: center
          justify-content: center
          i
            margin-right: 6px
            background: linear-gradient(90deg, #A86BFE 0%, #725DFF 100%)
            -webkit-background-clip: text
            color: transparent
        .reminders:hover
          opacity: 0.8
        .reminders:active
          opacity: 1
          
    .refresh
      margin-top: 20px
      display: flex
      .time
        display: flex
        align-items: center
        font-family: Tahoma
        color: #777777
        font-weight: 400
        .collect
          margin: 0 15px
          font-size: 14px
        .circle
          cursor: pointer
          display: flex
          justify-content: center
          align-items: center
          width: 48px
          height: 48px
          background: #ffffff
          box-shadow: 0px 2px 10px 0px rgba(221, 221, 221, 0.2)
          border-radius: 4px
      .search
        position: relative
        .icon-search
          position: absolute
          z-index: 10
          color: #777777
          margin-left: 10px
          margin-top: 17px
        input
          width: 480px
          height: 48px
          border: 1px solid transparent
          border-radius: 4px
          padding: 0px 16px
          padding-left: 35px
        input::-webkit-input-placeholder
          color: #777777
        input:focus
          outline: none
          border: 1px solid #725DFF
    .group
        display: flex
        .btn:nth-child(2)
            margin-left: 20px
        .btn
            width: 120px
            color: #222222
            font-size: 16px
            font-weight: bold
            background: transparent
            height: 48px
        .btn:hover
          background: #efe8ff
          color: #725DFF
        .active
            color: #FFFFFF
            background: linear-gradient(90deg, #A86BFE 0%, #725DFF 100%)
        .active:hover
            color: #FFFFFF
            background: linear-gradient(90deg, #A86BFE 0%, #725DFF 100%)
</style>