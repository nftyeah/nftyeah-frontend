<template>
  <div class="skeleton">
    <div v-for="(item, i) in number" :key="i" class="item">
      <div class="icon">
        <div class="logo"></div>
        <div class="name"></div>
      </div>
      <div class="mintPrice"></div>
      <div class="floorPrice"></div>
      <div class="supply"></div>
      <div class="explore"></div>
      <div class="mintTime"></div>
      <div class="reminder"></div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'skeleton-list',
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
  .item
    display: flex
    background-color: #FFF
    padding: 20px
    border-radius: 4px
    border: 1px solid transparent
    align-items: center
    .icon
      max-width: 200px
      width: 100%
      display: flex
      align-items: center
      .name
        width: 60%
        margin-left: 13px
        height: 20px
        background-image: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%)
        background-size: 400% 100%
        animation: skeleton-loading 1.4s ease infinite
      .logo
        background-image: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%)
        background-size: 400% 100%
        animation: skeleton-loading 1.4s ease infinite
        width: 40px
        border-radius: 50%
        height: 40px
    .mintPrice
      margin-left: 100px
      width: 80px
      height: 20px
      background-image: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%)
      background-size: 400% 100%
      animation: skeleton-loading 1.4s ease infinite
    .floorPrice
      margin-left: 70px
      width: 80px
      height: 20px
      background-image: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%)
      background-size: 400% 100%
      animation: skeleton-loading 1.4s ease infinite
    .supply
      margin-left: 75px
      width: 80px
      height: 20px
      background-image: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%)
      background-size: 400% 100%
      animation: skeleton-loading 1.4s ease infinite
    .explore
      margin-left: 107px
      width: 120px
      height: 20px
      background-image: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%)
      background-size: 400% 100%
      animation: skeleton-loading 1.4s ease infinite
    .mintTime
      margin-left: 65px
      width: 73px
      height: 20px
      background-image: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%)
      background-size: 400% 100%
      animation: skeleton-loading 1.4s ease infinite
    .reminder
      margin-left: 48px
      width: 80px
      height: 20px
      background-image: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%)
      background-size: 400% 100%
      animation: skeleton-loading 1.4s ease infinite

@keyframes skeleton-loading
  0%
    background-position: 100% 50%
  100%
    background-position: 0 50%
</style>