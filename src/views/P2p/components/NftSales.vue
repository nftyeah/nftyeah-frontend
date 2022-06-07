<template>
  <div class="NftSales">
    <div class="title">
      <span>List item for sale</span>
    </div>
    <div class="price">
      <div class="text">Price</div>
      <input :class="item.status === 1 ? 'disabledInput':''"  :disabled="item.status === 1" class="amount" type="text" v-model="item.basePrice" placeholder="Amount" />
      <i class="iconfont icon-eth"></i>
    </div>
    <div class="duration">
      <div class="text">Duration</div>
      <input :class="item.status === 1 ? 'disabledInput':''"  :disabled="item.status === 1" v-model="dateText" class="amount" @click="selectDate()" type="text" placeholder="Select Date" />
      <i class="iconfont icon-date"></i>
      <div class="block">
        <el-date-picker
                class="duration_date"
                v-model="showDate"
                type="datetime"
                start-placeholder="Start Date"
                end-placeholder="End Date"
                :picker-options="pickerOptions">
        </el-date-picker>
      </div>
    </div>
    <div class="reserve">
      <div class="flex">
        <div class="text">Reserve for specific buyer</div>
        <el-switch active-color="#725DFF" :disabled="reserveStatus" @change="changeReserveSwitch()" v-model="reserveSwitch">
        </el-switch>
      </div>
      <input class="amount" v-model="item.taker" :class="reserveSwitch ? '' :'disabledInput'" :disabled="item.status === 1 || !reserveSwitch" type="text" placeholder="" />
    </div>

    <div v-if="item.status === 1 && mToUpperCase(item.owner) !== mToUpperCase(address)"  class="fees">
      <div class="service">
        <span>Owned by</span>
        <span>{{hiddenAddress(item.owner)}}</span>
      </div>
    </div>
    <div v-else class="fees">
      <div class="text">Fees</div>
      <div class="service">
        <span>Service Fee</span>
        <span>0%</span>
      </div>
      <div class="service">
        <span>Creator Fee</span>
        <span>0%</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { parseTime,decimalsAbdicate,decimalsCarry,hiddenAddress,mToUpperCase } from "@/plugins/tools";
  import { mapState } from "vuex";

  export default {
    name: "NftSales",
    props:{
      item: {},
    },
    computed: {
      ...mapState(["listingShow","yeahProxyRegistry","yeahExchange","address"]),
      reserveStatus() {

        return this.item.status === 1
      }
    },
    components: {

    },
    watch: {
      "item.status"() {

        this.calcObtain();
      },
      showDate(){
        console.log('showDate',this.showDate)
        if (this.showDate) {
          const a = parseTime(new Date(),'{y}-{m}-{d} {h}:{i}');
          const b = parseTime(this.showDate,'{y}-{m}-{d} {h}:{i}');
          this.dateText = a + ' - ' + b;
          this.item.listingTime = new Date();
          this.item.expirationTime = this.showDate;
        }
      }
    },
    data: () => ({
      mToUpperCase,
      decimalsAbdicate,
      hiddenAddress,
      showDate:'',
      dateText: '',
      input4: '',
      reserveSwitch: false,
      pickerOptions:{
        disabledDate(time){
          return time.getTime() < Date.now();
        },
      },
    }),
    async mounted() {

    },
    methods: {
      changeReserveSwitch(){
        if (!this.reserveSwitch) {
          this.item.taker = '';
        }
      },
      calcObtain(){
        this.reserveSwitch = !!this.item.taker;
        if (this.item.status === 1) {

          this.showDate = this.item.expirationTime;
          console.log(this.showDate);
        } else {
          this.showDate = '';
          this.dateText = '';
        }
      },
      selectDate(){
        const duration_date = document.getElementsByClassName('el-input__inner')[0];
        console.log(duration_date);
        duration_date.focus()
      }
    },
  }
</script>

<style lang="sass" scoped>
  $Tahoma-Bold: Tahoma-Bold
  $Tahoma: Tahoma
  $--input-height: 40px

.NftSales
  width: 100%
  .disabledInput
    background-color: rgba(0, 0, 0, 0.05) !important
    border: 1px solid #dddddd !important
  .duration
    position: relative
    .block
      opacity: 0
      position: absolute
      top: 40px
      z-index: -2
    .amount:focus-visible
      border: 1px solid #725DFF
    .amount
      outline: none
      box-sizing: border-box
      height: 55px
      border: 1px solid #dddddd
      border-radius: 4px
      width: 100%
      padding-left: 17px
      font-size: 16px
      font-family: $Tahoma
      background-color: transparent
    .icon-date
      position: absolute
      top: 50px
      right: 18px
      font-size: 20px
      font-weight: 400
      color: #777777
  .price
    position: relative
    i
      position: absolute
      top: 50px
      right: 14px
      font-size: 19px
      font-weight: 400
      color: #777777
    .amount:focus-visible
      border: 1px solid #725DFF
    .amount
      outline: none
      box-sizing: border-box
      height: 55px
      border: 1px solid #dddddd
      border-radius: 4px
      width: 100%
      padding-left: 17px
      font-size: 16px
      font-family: $Tahoma
      background-color: transparent
  .title
    margin-top: 20px
    span
      font-family: $Tahoma-Bold
      font-size: 30px
      font-weight: bold
  .text
    font-size: 18px
    margin: 29px 0 10px 0
    font-family: $Tahoma-Bold
  .reserve
    .amount:focus-visible
      border: 1px solid #725DFF
    .amount
      outline: none
      box-sizing: border-box
      height: 55px
      border: 1px solid #ddd
      border-radius: 4px
      width: 100%
      padding-left: 22px
      font-size: 16px
      font-family: $Tahoma
      background-color: transparent
    .flex
      align-items: center
      margin-top: 29px
      margin-bottom: 10px
      justify-content: space-between
      flex-direction: row
      .text
        margin-top: 0
        margin-bottom: 0
  .fees
    margin-top: 60px
    .service
      padding: 10px 0 0 0
      span:first-child
        font-family: $Tahoma
        margin-right: 60px
        color: #666666
        font-size: 16px
        font-weight: 400
      span:last-child
        font-family: $Tahoma-Bold
        font-size: 16px
        color: #725DFF
    .creator
</style>