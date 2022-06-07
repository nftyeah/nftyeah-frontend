import Vue from 'vue'
import Vuex from 'vuex'
import remind from "./remind"
import nfts from "./nfts"
import drops from "./drops"
import { chainNetwork } from '@/contants/index.js';
import { web3Send } from "@/plugins/contracts"
import { changeChainNetwork,mToLowerCase,decimalsCarry,downFixed } from '@/plugins/tools.js'
import Cookie from 'js-cookie'
import { getEmail } from "@/plugins/request";

const debug = process.env.NODE_ENV !== 'production';
Vue.use(Vuex)

const state = {
  version: '1',
  theme: 'ETH',
  lang: 'en-US',
  reload: true,
  network: '1',
  blockExplorerUrls:'https://etherscan.io',
  networkDialogShow: true,
  address: '',
  menu: false,
  slogan: true,
  transaction: [],
  abi: null,
  scroll: 0,
  scrollTop: 0,
  yeahProxyRegistry: '',
  yeahExchange: '',
  merkleValidatorAddress: '',
  feeRecipient: '',
  loginSign: '',
  userEmail: '',
  userBalance: '',
};

const mutations = {

  SET_VERSION(state, e) {
    state.version = e;
  },

  SET_MENU(state, e) {
    state.menu = e;
  },

  SET_LANG(state, e) {
    state.lang = e;
  },

  SET_SLOGAN(state, e) {
    state.slogan = e;
  },
  SET_RELOAD(state, value) {
    state.reload = value;
  },

  SET_NETWORK(state, value) {
    state.network = value;
  },

  SET_ADDRESS(state, value) {
    state.address = value;
  },

  SET_LOGINSIGN(state, value) {
    state.loginSign = value;
  },

  SET_CONTRACT(state, value) {
    state.yeahExchange = value.yeahExchange;
    state.yeahProxyRegistry = value.yeahProxyRegistry;
    state.merkleValidatorAddress = value.merkleValidatorAddress;
    state.feeRecipient = value.feeRecipient;
  },

  SET_TRANSACTION(state, value) {
    state.transaction = value;
  },
  SET_ABI(state, value) {
    state.abi = value
  },
  SET_EMAIL(state, value) {
    state.userEmail = value
  },
  SET_SCROLL(state, value){
    state.scroll = value
  },
  SET_SCROLLTOP(state, value){
    state.scrollTop = value
  },
  SET_NETWORKDIALOGSHOW(state, value) {
    state.networkDialogShow = value
  },
  SET_USERBALANCE(state, value) {
    state.userBalance = value
  }
};
const actions = {

  async loginSignCall({commit,state}){
    if (!window.ethereum) {
      return;
    }
    if (!state.address) {
      return;
    }
    const loginSign = Cookie.get('loginSign_' + mToLowerCase(state.address));

    if (loginSign) {
      commit('SET_LOGINSIGN', loginSign);
      return;
    }

    let sign = await web3Send.eth.personal.sign("Welcome to NFTYeah!\n" +
      "\n" +
      "Click to sign in and accept the NFTYeah Terms of Service\n" +
      "\n" +
      "This request will not trigger a blockchain transaction or cost any gas fees.\n" +
      "\n" +
      "Your authentication status will reset after 24 hours.\n" +
      "\n" +
      "Wallet address:\n" +
      mToLowerCase(state.address), state.address).catch(error => {
        return false;
    });
    if(sign){
      commit('SET_LOGINSIGN', sign);
      Cookie.set('loginSign_' + mToLowerCase(state.address), sign, {expires: 1});
    }
    return sign;
  },
  getEmailAddress({commit,state}){
    if (!state.address) {
      return;
    }
    getEmail(state.address).then(data =>{
      console.log(data);
      if (data) {
        commit('SET_EMAIL', data.e_mail);
      }
    })

  },
  getEthereumAddress({
    commit,
  }) {
    if (!window.ethereum) {
      return;
    }
    console.log(1)
    let ethereum = window.ethereum;
    let accountsCatch = localStorage.getItem('accountsCatch');
    ethereum.enable().then(async (accounts) => {
      console.log('accounts', accounts)

      let network = [];
      chainNetwork.map(async e => {
        network.push(Number(e.chainId))
      });
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log(network, Number(chainId))

      if(network.indexOf(Number(chainId)) === -1){
        await changeChainNetwork(chainNetwork[0]);
      }

      // Switch account clear
      if (accountsCatch && accountsCatch !== accounts[0]) {
        localStorage.clear();
      }
      localStorage.setItem('accountsCatch', accounts[0])

      let account = accounts[0]
      commit('SET_ADDRESS', account)

      const ethBalance = await web3Send.eth.getBalance(account);
      commit('SET_USERBALANCE', downFixed(decimalsCarry(ethBalance),2))

    }).catch(() => {
      
    })
  },
  async setNetwork({
    commit,
  }, value) {

    chainNetwork.map(async e => {
      if (parseInt(e.chainId) === parseInt(value)) {
        commit('SET_NETWORK', e.chainId)
        commit('SET_CONTRACT', {
          yeahProxyRegistry:e.yeahProxyRegistry,
          yeahExchange:e.yeahExchange,
          merkleValidatorAddress:e.merkleValidatorAddress,
          feeRecipient:e.feeRecipient
        })
      }
    });
    let network = [];
    chainNetwork.map(async e => {
      network.push(Number(e.chainId))
    });
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    if(network.indexOf(Number(value)) === -1){
      commit('SET_NETWORK', chainId)
    }
  },
  setVersion({
    state
  }) {
    let v = Vue.prototype.localStorage.get("version");

    if (v && Number(state.version) > Number(v)) {
      localStorage.clear();
      Vue.prototype.localStorage.set("version", state.version);
      window.location.reload();
    } else {
      Vue.prototype.localStorage.set("version", state.version);
    }
  }
};

export default new Vuex.Store({
  state: Object.assign(state, remind.state, drops.state,nfts.state),
  mutations: Object.assign(mutations, remind.mutations, drops.mutations, nfts.mutations),
  actions: Object.assign(actions, remind.actions, drops.actions, nfts.actions),
  strict: debug
});
