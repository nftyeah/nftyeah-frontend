<template>
  <div class="remind">
    <div class="remindTitle">
      <div class="title" ><i class="iconfont icon-arrow-left" @click="$router.push('/reminder')"></i> <span @click="$router.push('/reminder')">Reminder</span> </div>
    </div>
    <div class="select">
      <div class="group">
        <!-- <el-select v-model="collections" clearable placeholder="All collections">
          <el-option
            v-for="item in collectionsList"
            :key="item.id"
            :label="item.collection"
            :value="item.slug">
          </el-option>
        </el-select> -->
        <div class="search">
          <i class="iconfont icon-search"></i>
          <input
                  type="text"
                  v-model="collections"
                  placeholder="Search items, collections"
          />
        </div>
        <el-select v-model="status" clearable placeholder="All types">
          <el-option
            v-for="item in statusArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="events" clearable placeholder="All status">
          <el-option
            v-for="item in eventsArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!--<div class="btn center" @click="createModel">Create</div>-->
      </div>
    </div>
    
    <div class="remindList">
      <div class="remindListHeader">
        <div>Collection</div>
        <div>Reminder type</div>
        <div>Floor price</div>
        <div>Status</div>
        <div>Time</div>
        <div></div>
      </div>
      <div class="remindListTable">
        <NoItems class="nullItem" :tips="'No reminder events yet'"  v-if="list.length == 0 && loading == false" />
        <div class="remindListItem" :class="i % 2 == 0 ? 'dot':''" v-show="filterList(item)"  v-for="(item, i) in list" :key="i">
          <div class="icon">
            <img :src="item.logo"  @error="defaultImage($event)" alt="" />
            <el-tooltip class="item" :disabled="item.product_name.length > 16 ? false : true" effect="dark" :content="item.product_name" placement="top">
              <span class="name">{{ showColl(item.product_name) }}</span>
            </el-tooltip>
          </div>
          <div class="reminder">
            {{item.event_type == 1 ? "Floor price to" : ""}}
            <span v-if="item.event_type == 1">{{item.event_config}}<img class="eth" src="@/assets/eth.svg" /></span>
            <span v-if="item.event_type == 2">Mint</span>
          </div>
          <div class="fPrice">
            <span v-if="item.floor_price == '-'">
              {{item.floor_price}}
              <img class="eth" src="@/assets/eth.svg" />
            </span>
            <span v-else>
            {{ parseFloat(downFixedExt(item.floor_price,2)) < 0.01 && parseFloat(downFixedExt(item.floor_price,2)) > 0
            ? '<0.01' : downFixedExt(item.floor_price,2) }}
              <img class="eth" src="@/assets/eth.svg" />
          </span>
          </div>
          <div class="status">
            <span v-if="item.status == 1">Not notified</span>
            <span v-else-if="item.status == 2">Notified</span>
            <span v-else>-</span>
          </div>
          <div class="time">
            <span>{{formatDateEN(item.create_time)}}</span>
          </div>
          <div class="operation">
            <i @click="editHandle(item)" class="iconfont icon-edit" v-if="item.event_type != 2"></i>
            <i @click="deleteHandle(item)" class="iconfont icon-delete"></i>
          </div>
        </div>
        <Skeletons :number="10" v-if="loading" />
      </div>
    </div>
    <RemindDialog :selectData="selectData" :collectionsList="collectionsList" @remindRefresh="getNotifyListCall"/>
    <RemindDelDialog :selectData="selectData" @remindRefresh="getNotifyListCall"/>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { decimalsCarry,downFixedExt,formatDateEN } from "@/plugins/tools";
import RemindDialog from "./RemindDialog.vue"
import RemindDelDialog from "./RemindDelDialog.vue"
import { getNotifyList, getCollectionsName } from "@/plugins/request";
import NoItems from '@/components/NoItems'
import Skeletons from "@/components/Skeletons/list.vue"

export default {
  name: "remind",
  components: { RemindDialog, RemindDelDialog,NoItems,Skeletons },
  computed: {
    ...mapState(["address"]),
  },
  data: () => ({
    formatDateEN,
    decimalsCarry,
    downFixedExt,
    selectData: "",
    events: "",
    eventsArr: [
      {
        value: 1,
        label: "Floor price",
      },
      {
        value: 2,
        label: "Mint",
      },
    ],
    status: "",
    statusArr: [
      {
        value: 2,
        label: "Not notified",
      },
      {
        value: 1,
        label: "Notified",
      },
    ],
    collections: "",
    collectionsList: [],
    input: "",
    value: "",
    revealed: true,
    list: "",
    listCatch: "",
    loading: false,
    defaultImg: require('../../assets/404.png'),
  }),
  watch: {
    address() {
      this.getNotifyListCall()
    },
    input() {

    }
  },
  mounted() {
    this.getNotifyListCall()
    getCollectionsName().then(e => {
      this.collectionsList = e;
    })
  },
  methods: {
    showColl(name){
      return name.length > 16 ? name.substring(0,15) + '...' : name;
    },
    defaultImage(event){
      let img = event.target;
      img.src = this.defaultImg;
      img.onerror = null;
    },
    commandObj(item, type) {
      return Object.assign(JSON.parse(JSON.stringify(item)),{type})
    },
    editHandle(e){
      this.selectData = e
      this.$store.commit('SET_REMINDDIALOGSHOW', true)
    },
    deleteHandle(e){
      this.selectData = e
      this.$store.commit('SET_REMINDDELDIALOGSHOW', true)
    },

    filterList(item) {
      return  (this.collections !== '' ? (item.product_name.indexOf(this.collections) > -1) : true) &&
        (this.status !== '' ? (item.status === this.status) : true) &&
        (this.events !== '' ? (item.event_type === this.events) : true);
    },
    getNotifyListCall() {
      if (!this.address) return
      this.loading = true;
      getNotifyList(this.address).then(e => {
        e.map((o) => {
          o.floor_price = this.decimalsCarryFilter(o.floor_price);
          o.collection = o.product_name;
        });

        this.list = this.MsgSort(e);
        this.listCatch = this.MsgSort(e);
        this.loading = false;
      })
    },
    MsgSort(obj){
        obj.sort((a,b)=>{
          let t1 = new Date(Date.parse(a.create_time.replace(/-/g,"/")))
          let t2 = new Date(Date.parse(b.create_time.replace(/-/g,"/")))
          return t2.getTime()-t1.getTime()
        })
        return obj
    },
    changeRevealed(e) {
      this.revealed = e;
    },
    createModel() {
      this.selectData = ""
      this.$store.commit('SET_REMINDDIALOGSHOW', true)
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
    
  },
};
</script>

<style lang="sass">

.eth
  width: 18px
  height: 30px

.el-dropdown-menu__item:hover
  background: #f6f3ff !important
  color: #725DFF !important
.el-select
  .is-focus
    input
      border-color: #725DFF !important
.el-input__inner
  border-color: #DDDDDD !important
.el-select-dropdown__item.hover
    background: #f6f3ff !important
    color: #725DFF !important
.remind
    width: 100%
    max-width: 1220px
    margin: 0 auto

    input
      box-shadow: 0px 2px 10px 0px rgba(221, 221, 221, 0.2)
    input::-webkit-input-placeholder
      color: #999
    .el-icon-arrow-up
      font-size: 20px !important
    .remindEmpty
      display: flex
      align-items: center
      flex-direction: column
      margin-top: 90px
      img
        width: 246px
        height: 186px
      p
        margin-top: 20px
        font-size: 24px
        
        font-weight: 400
        color: #DDDDDD
    .remindList
        color: #222222
        min-height: 465px
        margin-top: 20px
        margin-bottom: 20px
        font-family: Tahoma
        .remindListHeader
            height: 60px
            display: flex
            align-items: center
            background-color: #ffffff
            border-radius: 10px 10px 0 0
            font-family:'Tahoma'
            font-weight: bold

            div
                flex: 1
                font-size: 14px
                font-weight: bold
                text-align: right
            div:nth-child(1)
                padding-left: 20px
                text-align: left
            div:nth-child(6)
                padding-right: 20px
                width: 100px
                flex: inherit
        .remindListTable
            .nullItem
              margin-bottom: 20px
              padding: 90px 0
              background-color: #FFFFFF
              border-radius: 0 0 10px 10px
            .remindListItem
                display: flex
                background-color: #FFF
                padding: 20px
                border-radius: 4px
                border: 1px solid transparent
                div
                    flex: 1
                    display: flex
                    align-items: center
                    justify-content: flex-end
                .icon
                    justify-content: flex-start
                .operation
                    width: 100px
                    flex: inherit
                    display: flex
                    justify-content: flex-end
                .icon
                    display: flex
                    align-items: center
                    img
                        border-radius: 50%
                        width: 40px
                        height: 40px
                        border: 1px solid #eee
                    .name
                        font-size: 14px
                        font-weight: bold
                        margin-left: 13px
                .reminder
                    span
                        display: flex
                        align-items: center
                        color: #725DFF
                        font-weight: bold
                        margin-left: 5px
                .fPrice
                    span
                        display: flex
                        align-items: center
                        margin-left: 5px
                        color: #725DFF
                        font-weight: bold
                .time
                    
                    
                .operation
                    width: 100px
                    font-size: 14px
                    .iconfont
                      cursor: pointer
                      color: #725DFF
                    .icon-edit
                        margin-right: 20px
            .dot
              background-color: #f8f8fc
    .remindTitle
        margin-top: 35px
        .title
            font-size: 18px
            font-family: Tahoma Bold
            font-weight: bold
            color: #222222
            display: flex
            align-items: center
            font-weight: bold
            
        i
            margin-top: 3px
            font-size: 14px
            margin-right: 5px
            cursor: pointer
        span
            cursor: pointer
    .select
        margin-top: 30px
        display: flex
        justify-content: space-between
    .group
      width: 100%
      display: flex
      input
        border: 1px solid #fff !important
      div:last-child
        margin-right: unset
      div
        flex: 1
        margin-right: 20px
      .btn
        width: 120px
        color: #FFF
        height: 48px
        margin-right: 0px
        flex: inherit
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
</style>