<template>
  <div class="home">
    <div class="main">
      <div class="left">
        <div class="reminder">
          <h5>Reminder</h5>
          <span>Notify you of the latest floor price of NFTs by email <br /> and browser push</span>
          <div class="btn center" @click="jumpReminder()">Reminder</div>
        </div>
        <div class="reminder">
          <h5>P2P</h5>
          <span>Peer-to-peer trading of NFTs, No fees</span>
          <div class="btn center" @click="jumpP2p()">P2P</div>
        </div>
        <div class="media">
          <a href="https://twitter.com/NFTYeah_" target="_blank">
            <i class="iconfont icon-twitter"></i>
          </a>
          <a href="https://discord.gg/2fcp6uwTuZ" target="_blank">
            <i class="iconfont icon-discord"></i>
          </a>
          <a href="https://medium.com/@NFTYeah" target="_blank">
            <i class="iconfont icon-medium"></i>
          </a>
        </div>
      </div>
      <div class="right">
        <div class="carousel">
          <ul class="slider">
            <li :key="item.id" v-for="(item) in list">
              <div @click="jumpUrl(item.website)" class="trait">
                  <img :src="item.logo" />
              </div>
              <div class="name">
                <span>{{item.collection}}</span>
              </div>
            </li>
          </ul>
          <ul class="control-dots">
            <li @click="clickDot(index)" @mouseover="inDot()" @mouseout="outDot()" class="dot" :class="index == 0 ? 'select':''" :key="item.id" v-for="(item,index) in list"></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { fetchBannerList } from "@/plugins/request";

export default {
  name: "Home",
  components: {

  },
  computed: {
  },
  watch: {

  },
  data: () => ({
    index: 0,
    max: 0,
    time: null,
    list: [],
  }),
  created(){
    this.fetchBannerList();
  },
  async mounted() {
    this.time = setInterval(this.swapImg, 3000)
  },
  methods: {
    clickDot(index){
      this.index = index - 1;
      this.swapImg();
    },
    inDot(){
      clearInterval(this.time);
    },
    outDot(){
      this.time = setInterval(this.swapImg, 3000)
    },
    jumpUrl(url){
      window.open(url);
    },
    async fetchBannerList(){
      const list = await fetchBannerList();
      console.log(list);
      this.list = list;
      this.max = list.length - 1;
    },
    swapImg(){
      if(this.max == 0){return;}

      let controlDots = document.getElementsByClassName('control-dots')[0].querySelectorAll('li');

      controlDots.forEach(dots =>{
        dots.setAttribute('class','dot');
      });

      if(this.index == this.max){
        const po = 0;
        let lis = document.getElementsByClassName('slider')[0].querySelectorAll('li');
        lis.forEach(li =>{
          li.style.transform = "translateX(-"+po+"%)"
        });
        this.index = 0;

        controlDots[0].setAttribute('class','dot select');
        return;
      }
      let po = (this.index+1) * 100;
      let lis = document.getElementsByClassName('slider')[0].querySelectorAll('li');
      lis.forEach(li =>{
        li.style.transform = "translateX(-"+po+"%)"
      });
      this.index = (this.index+1);
      console.log('设置');
      controlDots[this.index].setAttribute('class','dot select');
    },
    jumpReminder(){
      this.$router.push('/reminder')
    },
    jumpP2p(){
      this.$router.push('/p2p')
    }
  },
};
</script>
<style lang="sass" scoped>
.home
  min-height: 650px
  .main
    width: 100%
    max-width: 1220px
    margin: 0 auto
    display: flex
    justify-content: space-between
    .left
      width: 100%
      max-width: 755px
      .media
        margin-top: 60px
        a
          text-decoration: none
          .iconfont:hover
            color: #725DFF
          .iconfont
            font-size: 36px
            margin-right: 30px
            color: #D8D3DE
      .reminder
        display: flex
        flex-direction: column
        margin-top: 60px
        h5
          font-size: 42px
          font-family: Tahoma-Bold
          color: #222222
          font-weight: bold
        span
          font-size: 18px
          font-family: Tahoma
          color: #222222
          line-height: 36px
        .btn
          margin-top: 30px
          width: 120px
          height: 48px
          font-weight: bold
          font-size: 16px
          font-family: Tahoma
          color: #FFFFFF
          border-radius: 10px
    .right
      .carousel
        background-color: #ffffff
        margin-top: 80px
        height: 100%
        width: 420px
        max-height: 490px
        box-shadow: 0px 2px 20px 0px rgba(114, 93, 255, 0.1)
        border-radius: 10px
        .slider
          display: flex
          overflow: hidden
          li
            min-width: 100%
            position: relative
            transform: translateX(0%)
            transition: all linear 350ms
          .name
            text-align: center
            font-size: 16px
            font-family: Tahoma-Bold
            color: #222222
          .trait
            cursor: pointer
            padding: 15px
            img
              border-radius: 10px 10px 0 0
              height: 390px
              width: 390px
        .control-dots
          text-align: center
          margin-top: 10px
          .dot
            background: #DDDDDD
            border-radius: 50%
            width: 8px
            height: 8px
            cursor: pointer
            display: inline-block
            margin: 0 8px
          .select
            background: #725DFF

</style>
