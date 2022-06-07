import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/Home/Index.vue')
  },
  {
    path: '/p2p',
    name: 'myNfts',
    component: () => import('../views/P2p/MyNfts.vue')
  },

  {
    path: '/nftDetail/:address/:tokenId',
    name: 'nftDetail',
    component: () => import('../views/P2p/NftDetail.vue')
  },
  {
    path: '/nft/success',
    name: 'success',
    component: () => import('../views/P2p/SuccessNft.vue')
  },
  {
    path: '/connect',
    name: 'connect',
    component: () => import('../views/wallet/connect.vue')
  },
  {
    path: '/reminder',
    name: 'drops',
    component: () => import('../views/Reminder/Index.vue')
  },
  {
    path: '/reminder/:id',
    name: 'drops',
    component: () => import('../views/Reminder/Index.vue')
  },
  {
    path: '/event',
    name: 'remind',
    component: () => import('../views/Event/Index.vue')
  },
  {
    path: '/activity',
    name: 'activity',
    component: () => import('../views/Activity/index.vue')
  },
];

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  document.documentElement.scrollTop = 0
  next();
})

export default router
