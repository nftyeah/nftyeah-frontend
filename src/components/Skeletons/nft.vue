<template>
  <div class="skeleton">
    <div v-for="(item, i) in number" :key="i" class="item">
      <div class="img"></div>
      <div class="text1">
        <div class="text"></div>
        <div class="text"></div>
      </div>
      <div class="text2">
        <div class="text"></div>
      </div>
      <div class="text3">
        <div class="text"></div>
        <div class="text"></div>
      </div>
    </div>
  </div>
</template>
<script>

  export default {
    name: 'skeleton-nft',
    props: {
      number: {
        type: Number,
        default: 1
      }
    },
  };
</script>

<style lang="sass" scoped>
  .skeleton
    display: flex
    flex-wrap: wrap
    .item
      margin: 0 12px 20px 12px
      box-shadow: 0 2px 10px 0 rgb(221 221 221 / 20%)
      border-radius: 10px
      background-color: #ffffff
      width: 100%
      height: 100%
      max-width: 224px
      max-height: 350px
      display: flex
      flex-direction: column
      .img
        width: 224px
        height: 224px
        border-radius: 10px
        background-image: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%)
        background-size: 400% 100%
        animation: skeleton-loading 1.4s ease infinite
      .text
        text-align: center
        background-image: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%)
        background-size: 400% 100%
        animation: skeleton-loading 1.4s ease infinite
        
        border-radius: 5px
        height: 20px
      .text1
        display: flex
        justify-content: space-between
        padding: 10px
        div:nth-child(1)
          width: 100px
        div:nth-child(2)
          width: 60px
      .text2
        padding: 2px 10px 10px 10px
        div:nth-child(1)
          width: 100px
      .text3
        display: flex
        justify-content: space-between
        padding: 5px 10px 10px 10px
        div:nth-child(1)
          width: 50px
        div:nth-child(2)
          width: 50px

  @keyframes skeleton-loading
    0%
      background-position: 100% 50%
    100%
      background-position: 0 50%
</style>