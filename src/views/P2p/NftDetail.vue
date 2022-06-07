<template>
  <div class="nftDetail" v-loading="initialLoad">
    <div class="search">
      <div class="left">
        <h2>Your NFTs</h2>
      </div>
    </div>
    <div class="main">
      <div class="left">
        <NftCard :item="nftDetail" />
      </div>
      <div class="right">
        <NftSales :item="nftDetail" />
        <BtnItem :item="nftDetail" />
      </div>
    </div>
  </div>
</template>

<script>

  import { getNft,getOrder } from "@/plugins/request"
  import NftCard from "./components/NftCard.vue";
  import BtnItem from "./components/BtnItem.vue";
  import NftSales from "./components/NftSales.vue";
  import { mapState } from "vuex";
  import { decimalsCarry } from "@/plugins/tools";
  import { getNftOwner } from "./components/common"


  export default {
    name: "NftDetail",
    components: {
      // eslint-disable-next-line vue/no-unused-components
      NftCard,NftSales,BtnItem
    },
    computed: {
      ...mapState(["listingShow","yeahProxyRegistry","yeahExchange","address","refresh"]),
    },
    watch: {
      address(){
        this.initial();
      },
      listingShow(){
        if (!this.listingShow) {
          this.getNftDetail();
        }
      },
      refresh(){
        this.getNftDetail();
      }
    },
    data: () => ({
      initialLoad: null,
      nftDetail: {
        address: '',
        imageUrl: '',
        name: '',
        openseaUrl: '',
        owner: '',
        symbol: '',
        tokenId: null,
        schemaName: '',

        exchange: '',
        maker:'',
        taker:'',
        makerRelayerFee: '0',
        takerRelayerFee: '0',
        makerProtocolFee: '0',
        takerProtocolFee: '0',
        feeRecipient: '0',
        feeMethod:'',
        side: '',
        saleKind: null,
        target: '',
        howToCall: null ,
        calldata: '',
        replacementPattern: '',
        staticTarget: '0',
        staticExtradata: '0',
        paymentToken: '0',
        basePrice: '',
        extra:'0',
        status: null,
        listingTime: null,
        listingTimeParam: null,
        expirationTime: null,
        expirationTimeParam: null,
        salt:'',
        nonce: 0,
        v: '',
        r: '',
        s: '',
      }
    }),
    async mounted() {
      this.initial();
    },
    methods: {
      async initial(){
        await new Promise((resolve) => setTimeout(resolve, 500));
        if(this.address){
          this.getNftDetail()
        }
      },
      async getNftDetail() {
        this.initialLoad = true;
        this.nftDetail.address = this.$route.params.address;
        this.nftDetail.tokenId = this.$route.params.tokenId;
        const nft = await getNft(this.nftDetail.address, this.nftDetail.tokenId);
        console.log(nft);
        if (nft) {
          this.nftDetail.address = nft.address;
          this.nftDetail.imageUrl = nft.image_url;
          this.nftDetail.name = nft.name;
          this.nftDetail.openseaUrl = nft.opensea_url;


          this.nftDetail.owner = nft.owner;
          this.nftDetail.symbol = nft.symbol;
          this.nftDetail.tokenId = nft.token_id;
          this.nftDetail.schemaName = nft.schema_name;
        }
        const orderNft = await getOrder(this.nftDetail.address, this.nftDetail.tokenId);
        console.log(orderNft)
        if (orderNft) {
          this.nftDetail.status = 1;
          this.nftDetail.exchange = orderNft.exchange;
          this.nftDetail.maker = orderNft.maker;
          if (orderNft.taker === '0x0000000000000000000000000000000000000000') {
            this.nftDetail.taker = '';
          } else {
            this.nftDetail.taker = orderNft.taker;
          }

          this.nftDetail.makerRelayerFee = orderNft.makerRelayerFee;
          this.nftDetail.takerRelayerFee = orderNft.takerRelayerFee;
          this.nftDetail.makerProtocolFee = orderNft.makerProtocolFee;
          this.nftDetail.takerProtocolFee = orderNft.takerProtocolFee;
          this.nftDetail.feeRecipient = orderNft.feeRecipient;
          this.nftDetail.feeMethod = orderNft.feeMethod;
          this.nftDetail.side = orderNft.side;
          this.nftDetail.saleKind = orderNft.saleKind;
          this.nftDetail.target = orderNft.target;
          this.nftDetail.howToCall = orderNft.howToCall;
          this.nftDetail.calldata = orderNft.calldata;
          this.nftDetail.replacementPattern = orderNft.replacementPattern;
          this.nftDetail.staticTarget = orderNft.staticTarget;
          this.nftDetail.staticExtradata = orderNft.staticExtradata;
          this.nftDetail.paymentToken = orderNft.paymentToken;
          this.nftDetail.basePrice = parseFloat(decimalsCarry(orderNft.basePrice.toString()));
          this.nftDetail.extra = orderNft.extra;
          this.nftDetail.listingTime = new Date(orderNft.listingTime * 1000);
          this.nftDetail.listingTimeParam = orderNft.listingTime;
          this.nftDetail.expirationTime = new Date(orderNft.expirationTime * 1000);
          this.nftDetail.expirationTimeParam = orderNft.expirationTime;
          this.nftDetail.salt = orderNft.salt;
          this.nftDetail.nonce = orderNft.nonce;
          this.nftDetail.v = orderNft.v;
          this.nftDetail.r = orderNft.r;
          this.nftDetail.s = orderNft.s;
        } else {
          this.nftDetail.status = 0;
        }
        this.initialLoad = false;
      }
    },
  }
</script>

<style lang="sass" scoped>
.nftDetail
  width: 100%
  max-width: 1220px
  margin: 0 auto
  margin-bottom: 100px
  .search
    margin: 35px 0
  .main
    display: flex
    .right
      padding-left: 38px
      width: 100%
</style>