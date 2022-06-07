<template>
  <el-dialog
          :visible="listingShow"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          center

          width="560px"
          :before-close="closeDepositModel"
          class="listingDialog">
    <div slot="title" class="title">
      Complete your listing
    </div>
    <div v-loading="loading.select">
      <div class="step line nullMargin">
        <span class="tipsTitle">Unlock selling functionality</span>
        <div class="flex dirRow">
          <span class="tipsText">Submit a transaction with your wallet to unlock selling functionality for this collection.This only needs to be done once.</span>
          <div v-loading="loading.one" :class="success.one ? 'success':''" class="btn center">Unlock</div>
        </div>
      </div>
      <div class="step line">
        <span class="tipsTitle">Unlock currency</span>
        <div class="flex dirRow">
          <span class="tipsText">Submit a transaction with your wallet to trade with this currency. This only needs to be done once.</span>
          <div v-loading="loading.two" :class="success.two ? 'success':''" class="btn center">Unlock</div>
        </div>
      </div>
      <div class="step">
        <span class="tipsTitle">Sign message</span>
        <div class="flex dirRow">
          <span class="tipsText">Sign a message using your wallet to continue.</span>
          <div v-loading="loading.three" @click="three()" class="btn center">Sign</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { getRegistryAddress,registryAddress,isApprovedForAll,setApprovalForAll,
    signOrder,getNonce} from "./common"
  import { mapState } from "vuex";
  import { decimalsAbdicate } from '@/plugins/tools.js'

  export default {
    name: "ListingDialog",
    computed: {
      ...mapState(["listingShow","yeahProxyRegistry","yeahExchange","address","merkleValidatorAddress","feeRecipient"]),
    },
    props:{
      item: {},
    },
    watch:{
      listingShow(){
        if (this.listingShow) {
          this.checkStatus();
        }
      }
    },
    data(){
      return {
        registryAdd: '',
        nonce: null,
        approve: false,
        success:{
          one: false,
          two: false,
          three: false,
        },
        loading: {
          select:false,
          one: false,
          two: false,
          three: false,
        }
      };
    },
    methods:{
      async checkStatus(){
        this.loading.select = true;

        this.registryAdd = await getRegistryAddress(this.yeahProxyRegistry,this.address);
        console.log(this.registryAdd)

        this.approve = await isApprovedForAll(this.item.address,this.address,this.registryAdd);
        this.loading.select = false;
        this.startListing();
      },
      async startListing(){

        this.loading.one = true;
        if (this.registryAdd === '0x0000000000000000000000000000000000000000') {
          const r = await registryAddress(this.yeahProxyRegistry, this.address);
          if (!r) {
            this.registryAdd = await getRegistryAddress(this.yeahProxyRegistry, this.address);
            this.loading.one = false;
            return;
          } else {

            for (let i = 0; i < 10; i++) {
              if (this.registryAdd === '0x0000000000000000000000000000000000000000') {
                this.registryAdd = await getRegistryAddress(this.yeahProxyRegistry, this.address);
              } else {
                break;
              }
            }
            this.success.one = true
          }
        } else {
          this.success.one = true
        }
        this.loading.one = false;

        if (!this.approve) {


          this.loading.two = true;
          let summary = 'setApprovalForAll';
          let r = await setApprovalForAll(this.item.address, this.registryAdd, this.address, summary);
          if (!r) {
            this.loading.two = false;
            return;
          } else {
            this.success.two = true;
          }
          this.loading.two = false;
        } else {
          this.success.two = true;
        }


        this.loading.three = true;
        this.nonce = await getNonce(this.yeahExchange,this.address);
        console.log(this.nonce);
        const basePrice = decimalsAbdicate(this.item.basePrice);
        const listingTime = Math.ceil(this.item.listingTime.getTime() / 1000);
        const expirationTime = Math.ceil(this.item.expirationTime.getTime() / 1000);
        let taker = '0x0000000000000000000000000000000000000000';
        if (this.item.taker) {
          taker = this.item.taker;
        }


        let r = await signOrder(
          this.item.address,
          this.item.tokenId,
          this.address,
          this.yeahExchange,
          this.registryAdd,
          basePrice,
          listingTime,
          expirationTime,
          this.nonce,
          taker,
          this.merkleValidatorAddress,
          this.feeRecipient);
        console.log(r);

        this.loading.three = false;
        if (r) {
          this.$message.success('success');
          this.$notify({
            title: 'prompt',
            message: 'Complete Success',
            type: 'success',
            duration: 3000
          });
          this.closeDepositModel();
        }

      },
      async one(){
        this.loading.one = true;
        if (this.registryAdd === '0x0000000000000000000000000000000000000000') {
          const r = await registryAddress(this.yeahProxyRegistry,this.address);
          if (!r) {
            this.registryAdd = await getRegistryAddress(this.yeahProxyRegistry,this.address);
            this.loading.one = false;
            return;
          }
          this.$message.success('success');
        }
        this.loading.one = false;
      },
      async two(){

        if (!this.approve) {
          this.loading.two = true;
          let summary = 'setApprovalForAll';
          let r = await setApprovalForAll(this.item.address, this.registryAdd, this.address, summary);
          if (!r) {
            this.loading.two = false;
            return;
          }
          this.$message.success('success');
          this.loading.two = false;
        }
      },
      async three(){
 
        this.loading.three = true;
        this.nonce = await getNonce(this.yeahExchange,this.address);
        console.log(this.nonce);
        const basePrice = decimalsAbdicate(this.item.basePrice);
        const listingTime = Math.ceil(this.item.listingTime.getTime() / 1000);
        const expirationTime = Math.ceil(this.item.expirationTime.getTime() / 1000);
        let taker = '0x0000000000000000000000000000000000000000';
        if (this.item.taker) {
          taker = this.item.taker;
        }
        let r = await signOrder(
          this.item.address,
          this.item.tokenId,
          this.address,
          this.yeahExchange,
          this.registryAdd,
          basePrice,
          listingTime,expirationTime,this.nonce,taker,
          this.merkleValidatorAddress,
          this.feeRecipient);
        console.log(r);
        this.loading.three = false;
        if (r) {
          this.closeDepositModel();
        }

      },
      closeDepositModel() {
        this.loading.one = false;
        this.loading.two = false;
        this.loading.three = false;
        this.$store.commit('SET_LISTINGSHOW', false)
      }
    }
  }
</script>

<style lang="sass" scoped>
  $Tahoma-Bold: Tahoma-Bold
  $Tahoma: Tahoma

.listingDialog
  .title
    color: #222222
    font-weight: bold
    font-family: $Tahoma-Bold
    font-size: 20px
  .line
    border-bottom: 1px solid #EEEEEE
  .step
    margin-top: 30px
    font-family: $Tahoma
    .tipsTitle
      color: #222222
      font-weight: 400
      font-size: 16px
    .tipsText
      max-width: 344px
      word-break: break-word
      padding-top: 17px
      padding-bottom: 25px
      font-size: 14px
      font-family: $Tahoma
      color: #777777
      line-height: 21px
    .btn
      font-family: $Tahoma
      color: #ffffff
      font-weight: 400
      font-size: 16px
      margin-top: 17px
      height: 40px
      width: 120px
    .dirRow
      align-items: flex-start
      flex-direction: row
      justify-content: space-between
      .success
        background-color: rgb(0 0 0 / 5%)
        background-image: unset
        color: #999999
        cursor: not-allowed
    .flex
      display: flex
  .nullMargin
    margin-top: 0
</style>