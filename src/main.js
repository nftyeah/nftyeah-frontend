import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/plugins/i18n.js'
import '@/mixin/index.js';
import storeLS from 'storejs';
import Jazzicon from 'vue-jazzicon';
import './styles/common.css';
import './styles/fonts.css'
import './styles/iconfont.css'
import './plugins/ui.js'
import './service-worker'
import BigNumber from 'bignumber.js'
import mavonEditor from 'mavon-editor'
import InfiniteScroll from "vue-infinite-scroll"
import OneSignalVue from 'onesignal-vue'
import clipboard from 'clipboard';
Vue.use(mavonEditor)
Vue.component('jazzicon', Jazzicon);
Vue.use(InfiniteScroll)
Vue.use(OneSignalVue);

const format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0
}
BigNumber.config({ FORMAT: format });

Vue.config.productionTip = false
Vue.prototype.localStorage = storeLS
Vue.prototype.clipboard = clipboard

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
  beforeMount() {
    this.$OneSignal.init({ appId: '920c9328-cf78-46fe-adc4-132f06224ccc', allowLocalhostAsSecureOrigin: true });
  }
}).$mount('#app')
